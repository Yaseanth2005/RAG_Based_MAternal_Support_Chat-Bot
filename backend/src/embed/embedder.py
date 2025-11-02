import json
from pathlib import Path
from sentence_transformers import SentenceTransformer
from src.main.settings import EMBEDDING_MODEL, CHUNKS_DIR


class Embedder:
    """Handles text embedding using SentenceTransformer models (e5-base, etc.)."""

    def __init__(self):
        print(f"🔧 Loading embedding model: {EMBEDDING_MODEL}")

        try:
            self.model = SentenceTransformer(EMBEDDING_MODEL)
        except Exception as e:
            raise RuntimeError(
                f"❌ Failed to load embedding model '{EMBEDDING_MODEL}'. Error: {e}"
            )

        # Auto-detect embedding dimension
        try:
            self.dim = self.model.get_sentence_embedding_dimension()
            print(f"✅ Embedding dimension detected: {self.dim}")
        except Exception:
            self.dim = 768  # safe fallback
            print("⚠️ Could not auto-detect embedding dimension. Using fallback: 768")

    # ---------------------------------------------------------
    # Single text embedding
    # ---------------------------------------------------------
    def embed_text(self, text: str):
        """Return embedding as a Python list."""
        if not text or not text.strip():
            # Return all-zeros vector to avoid pipeline failure
            return [0.0] * self.dim

        try:
            vec = self.model.encode(text, convert_to_numpy=True)
            return vec.tolist()
        except Exception as e:
            print(f"❌ Embedding failed for text chunk. Error: {e}")
            return [0.0] * self.dim

    # ---------------------------------------------------------
    # Batch embedding for faster ingestion
    # ---------------------------------------------------------
    def embed_batch(self, texts):
        """Batch embed multiple chunks safely."""
        cleaned = [(t if t and t.strip() else "") for t in texts]

        try:
            vectors = self.model.encode(cleaned, convert_to_numpy=True)
            return [v.tolist() for v in vectors]
        except Exception as e:
            print(f"❌ Batch embedding failed. Error: {e}")
            return [[0.0] * self.dim for _ in texts]

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
