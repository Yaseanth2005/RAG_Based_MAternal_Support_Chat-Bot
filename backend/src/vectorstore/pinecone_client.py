"""
Updated PineconeClient for new Pinecone SDK (Serverless)
Fully fixed upsert, query, and dimension handling.
"""

from pinecone import Pinecone, ServerlessSpec
from tqdm import tqdm

from src.main.settings import (
    PINECONE_API_KEY,
    PINECONE_ENV,
    PINECONE_INDEX
)
from src.embed.embedder import Embedder


class PineconeClient:
    def __init__(self):
        print("🔗 Connecting to Pinecone...")

        # Load embedder FIRST to auto-detect embedding dimension
        self.embedder = Embedder()
        self.embedding_dim = self.embedder.dim
        print(f"✅ Embedding dimension detected: {self.embedding_dim}")

        # Initialize Pinecone client
        self.pc = Pinecone(api_key=PINECONE_API_KEY)
        self.index_name = PINECONE_INDEX

        # Check existing indexes
        existing_indexes = [idx.name for idx in self.pc.list_indexes()]

        # Create index if not exists
        if self.index_name not in existing_indexes:
            print(f"📌 Creating new index: {self.index_name}")
            self.pc.create_index(
                name=self.index_name,
                dimension=self.embedding_dim,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region=PINECONE_ENV
                )
            )
            print("✅ Index created successfully!")
        else:
            print(f"✅ Pinecone index already exists: {self.index_name}")

        # Connect to index
        self.index = self.pc.Index(self.index_name)

    # ----------------------------------------------------
    # UPSERT ALL CHUNKS
    # ----------------------------------------------------
    def upsert_all_chunks(self):
        print("\n🚀 Starting full embedding + upsert...\n")

        batch_ids = []
        batch_vectors = []
        batch_metadata = []

        for chunk_id, text in tqdm(self.embedder.load_chunks(), desc="Embedding chunks"):

            vec = self.embedder.embed_text(text)

            batch_ids.append(chunk_id)
            batch_vectors.append(vec)
            batch_metadata.append({
                "source_file": chunk_id.split("__")[0],
                "text_snippet": text[:300]  # trimmed for safety
            })

            # Push every 100 items
            if len(batch_ids) >= 100:
                self._push(batch_ids, batch_vectors, batch_metadata)
                batch_ids, batch_vectors, batch_metadata = [], [], []

        # Final batch
        if batch_ids:
            self._push(batch_ids, batch_vectors, batch_metadata)

        print("\n✅ All embeddings successfully uploaded to Pinecone!\n")

    # ----------------------------------------------------
    # PUSH BATCH
    # ----------------------------------------------------
    def _push(self, ids, vectors, metadata):
        items = [
            {
                "id": ids[i],
                "values": vectors[i],
                "metadata": metadata[i]
            }
            for i in range(len(ids))
        ]

        self.index.upsert(vectors=items)

    # ----------------------------------------------------
    # QUERY
    # ----------------------------------------------------
    def query(self, query_vector, top_k=4):
        try:
            resp = self.index.query(
                vector=query_vector,
                top_k=top_k,
                include_metadata=True
            )

            # Pinecone's response object → convert to pure dict
            if hasattr(resp, "to_dict"):
                resp = resp.to_dict()

            return resp

        except Exception as e:
            print(f"❌ Pinecone query failed: {str(e)}")
            return {"matches": []}
