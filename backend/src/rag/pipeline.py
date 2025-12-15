"""
Full RAG pipeline for local Ollama (Meditron) + Pinecone
This version:
 - uses local Ollama adapter (llm_ollama)
 - prints step-by-step progress for CLI
 - safely normalizes embeddings
 - robustly parses Pinecone responses
 - handles missing metadata and LLM/timeout errors gracefully
"""

from typing import List, Dict, Tuple, Any
import json
import time

# Use the local Ollama LLM adapter
from src.llm.llm_ollama import generate_llm_response
from src.embed.embedder_cache import get_embedder
from src.vectorstore.pinecone_cache import get_pinecone_client


def _normalize_query_vector(vec: Any) -> List[float]:
    """Normalize embedding to plain Python list."""
    try:
        import numpy as _np
        if isinstance(vec, _np.ndarray):
            return vec.tolist()
    except Exception:
        pass

    if isinstance(vec, (list, tuple)):
        return [float(x) for x in vec]

    try:
        return vec.tolist()
    except Exception:
        raise ValueError("Invalid embedding type: " + str(type(vec)))


def _parse_pinecone_response(resp: Any) -> List[Dict[str, Any]]:
    """
    Accept dict response from Pinecone and extract matches.
    Handles old metadata and new metadata safely.
    """
    results = []

    if not resp:
        return results

    # resp should be a dict with "matches"
    matches = resp.get("matches", []) if isinstance(resp, dict) else []

    for m in matches:
        meta = m.get("metadata", {}) or {}

        results.append({
            "id": m.get("id"),
            "score": m.get("score"),
            "source_file": meta.get("source_file")
                           or meta.get("source")
                           or meta.get("filename")
                           or "unknown_source",
            "text_snippet": meta.get("text_snippet")
                            or meta.get("text")
                            or meta.get("snippet")
                            or "",
            "metadata": meta
        })

    return results


def _build_context(retrieved: List[Dict[str, Any]], max_chars_per_item=800) -> str:
    """
    Build the context string with safe fallback if metadata is missing.
    """
    ctx = []

    for i, item in enumerate(retrieved):
        idx = i + 1
        src = item.get("source_file") or "unknown_source"

        # Safe snippet extraction
        snippet = item.get("text_snippet")
        if not snippet:
            snippet = item.get("metadata", {}).get("text_snippet") \
                      or item.get("metadata", {}).get("text") \
                      or ""

        snippet = (snippet or "")[:max_chars_per_item].strip()

        ctx.append(f"[{idx}] Source: {src}\n{snippet}")

    return "\n\n---\n\n".join(ctx)


PROMPT_TEMPLATE = """
You are a warm, compassionate, and highly knowledgeable maternal health assistant.
Your goal is to provide supportive, evidence-based guidance to expectant and new mothers.
Always address the user with care and empathy, making them feel heard and understood.

Style and requirements:
- **Tone**: Caring, empathetic, and professional. Use phrases like "I understand," "It's completely normal," or "Take a deep breath."
- **Greeting**: Start with a warm, personalized greeting (e.g., "Hello dear," "I'm here for you").
- **Structure**: Use short paragraphs and bullet points for readability.
- **Content**:
    - Expand acronyms at first mention (e.g., "UTI (Urinary Tract Infection)").
    - Be practical: give clear steps, rationale, and examples.
    - **Safety First**: If there are any red flags or urgent symptoms, explicitly advise consulting a healthcare provider immediately.
- **No Inline Citations**: Do NOT include [1], [2] etc. in your text. Sources are shown separately.
- **Conciseness**: Keep it to 4-6 key points + summary.
- **Closing**: End with a supportive check-in question (e.g., "How does that sound to you?" or "Is there anything else on your mind?").

CONTEXT:
{context}

QUESTION:
{question}

Answer now (warm, concise, no inline citations):
"""  # noqa: E501


def run_rag_pipeline(question: str, top_k: int = 2, max_context_chars_per_item: int = 250
                     ) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Run the full RAG pipeline:
     - embed the question
     - query Pinecone
     - build context and prompt
     - call local Ollama (Meditron) via generate_llm_response
    Returns:
      - answer (str)
      - retrieved list (list of dicts)
    """
    start = time.time()

    try:
        print("\n🔍 Processing your question...")
        print("📌 Step 1/4: Embedding your question...")

        embedder = get_embedder()
        qvec_raw = embedder.embed_text(question)
        qvec = _normalize_query_vector(qvec_raw)

        print("📚 Step 2/4: Querying Pinecone for relevant chunks...")
        pine = get_pinecone_client()
        raw = pine.query(qvec, top_k=top_k)

        # Ensure dict format (pinecone_client should already do this)
        if hasattr(raw, "to_dict"):
            raw = raw.to_dict()

        retrieved = _parse_pinecone_response(raw)

        if not retrieved:
            print("⚠️ No sources returned from Pinecone.")
            return ("I couldn't find relevant information in the knowledge base. "
                    "Please try a different question or add more documents to the dataset."), []

        print("🧠 Step 3/4: Building RAG prompt...")
        context = _build_context(retrieved, max_chars_per_item=max_context_chars_per_item)
        prompt = PROMPT_TEMPLATE.format(context=context, question=question)

        print("🤖 Step 4/4: Contacting local Ollama (Meditron) LLM...")
        answer = generate_llm_response(prompt)

        # If the LLM adapter returns an explicit error string, forward it cleanly
        if isinstance(answer, str) and answer.strip().startswith("❌"):
            # return error message as the answer, keeping retrieved for debugging
            return (answer, retrieved)

        elapsed = time.time() - start
        print(f"[RAG] Retrieved: {len(retrieved)} chunks")
        print(f"[RAG] Prompt length: {len(prompt)} chars")
        print(f"[RAG] Time: {elapsed:.2f}s\n")

        return answer, retrieved

    except Exception as exc:
        # Final catch-all so CLI doesn't crash; return a helpful message
        err = f"❌ RAG pipeline error: {str(exc)}"
        print(err)
        return err, []


# -------------------------
# Small test harness for quick CLI testing
# -------------------------
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Quick RAG pipeline test (local Ollama).")
    parser.add_argument("--q", type=str, help="Question to ask", default=None)
    parser.add_argument("--top_k", type=int, help="Top K retrieved chunks", default=4)
    args = parser.parse_args()

    if not args.q:
        args.q = input("Enter a medical question (e.g., 'What vitamins are recommended at 20 weeks?')\n> ")

    print("Running RAG pipeline (Ollama local)...")
    ans, docs = run_rag_pipeline(args.q, top_k=args.top_k)
    print("\n\n===== ANSWER =====\n")
    print(ans)
    print("\n\n===== SOURCES =====\n")
    for i, d in enumerate(docs):
        print(f"[{i+1}] {d.get('source_file')} (score={d.get('score')})")
