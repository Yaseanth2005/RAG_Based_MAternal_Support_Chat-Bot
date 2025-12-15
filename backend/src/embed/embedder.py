import json
import hashlib
from pathlib import Path
from src.main.settings import EMBEDDING_MODEL, CHUNKS_DIR


class Embedder:
    """
    Handles text embedding.

    Design goals:
    - Try to use SentenceTransformer if available.
    - If heavy deps (torch / torchvision / transformers) are broken, fall back
      to a lightweight deterministic hashing‑based embedder so the backend
      still starts and responds instead of crashing.
    """

    def __init__(self):
        self.model = None
        self.dim = 768  # safe default

        # Try to import SentenceTransformer lazily so import failures don't
        # crash the whole backend at startup.
        try:
            from sentence_transformers import SentenceTransformer  # type: ignore

            print(f"🔧 Loading embedding model: {EMBEDDING_MODEL}")
            self.model = SentenceTransformer(EMBEDDING_MODEL)

            try:
                self.dim = self.model.get_sentence_embedding_dimension()
                print(f"✅ Embedding dimension detected: {self.dim}")
            except Exception:
                print(
                    "⚠️ Could not auto-detect embedding dimension. "
                    "Using fallback: 768"
                )
                self.dim = 768
        except Exception as e:
            # Hard dependency failures end up here (like your transformers /
            # torchvision error). We log and continue with a hash-based embedder.
            print(
                "⚠️ sentence-transformers could not be imported or initialized.\n"
                f"   Falling back to lightweight hash-based embeddings. Error: {e}"
            )
            self.model = None

    # ---------------------------------------------------------
    # Single text embedding
    # ---------------------------------------------------------
    def embed_text(self, text: str):
        """Return embedding as a Python list."""
        if not text or not text.strip():
            # Return all-zeros vector to avoid pipeline failure
            return [0.0] * self.dim

        # Preferred: real model
        if self.model is not None:
            try:
                vec = self.model.encode(text, convert_to_numpy=True)
                return vec.tolist()
            except Exception as e:
                print(f"❌ Embedding failed for text chunk. Error: {e}")
                return [0.0] * self.dim

        # Fallback: deterministic hash-based embedding (no external deps)
        h = hashlib.sha256(text.encode("utf-8")).digest()
        # Repeat hash bytes to fill dim, map to small floats
        vals = []
        while len(vals) < self.dim:
            for b in h:
                vals.append((b - 128) / 128.0)
                if len(vals) >= self.dim:
                    break
        return vals

    # ---------------------------------------------------------
    # Batch embedding for faster ingestion
    # ---------------------------------------------------------
    def embed_batch(self, texts):
        """Batch embed multiple chunks safely."""
        return [self.embed_text(t or "") for t in texts]

    # ---------------------------------------------------------
    # Load pre-processed chunks for Pinecone ingestion
    # ---------------------------------------------------------
    def load_chunks(self):
        """Yield (chunk_id, text) pairs from chunk JSON files."""
        chunk_files = list(Path(CHUNKS_DIR).glob("*.json"))

        if not chunk_files:
            print("⚠️ No chunks found in processed/chunks/. Run ingestion first.")
            return

        print(f"📦 Found {len(chunk_files)} chunks.")

        for file_path in chunk_files:
            try:
                data = json.loads(file_path.read_text(encoding="utf-8"))
                chunk_id = data.get("chunk_id")
                text = data.get("text", "")

                if not chunk_id:
                    print(f"⚠️ Missing chunk_id in {file_path.name}, skipping.")
                    continue

                yield chunk_id, text

            except Exception as e:
                print(f"❌ Failed to load chunk file {file_path.name}: {e}")
                continue
