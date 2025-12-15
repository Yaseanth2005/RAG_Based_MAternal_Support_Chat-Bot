import sys
import os

# Add the current directory to sys.path so we can import from src
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.ingest.ingest import ingest_files
from src.vectorstore.pinecone_client import PineconeClient

def main():
    print("==================================================")
    print("🚀 AUTOMATED RAG PIPELINE INITIATED")
    print("==================================================")
    print("Checking for new PDF/Text documents in /data folder...")

    # Step 1: Chunking & archiving
    print("\n[Stage 1/2] Ingesting & Chunking Files...")
    try:
        ingest_files()
    except Exception as e:
        print(f"❌ Error during ingestion: {e}")
        return

    # Step 2: Embedding & Inserting into Pinecone
    print("\n[Stage 2/2] Embedding & Upserting to Pinecone...")
    try:
        pc_client = PineconeClient()
        pc_client.upsert_all_chunks()
    except Exception as e:
        print(f"❌ Error during vector upsert: {e}")
        return

    print("\n==================================================")
    print("✅ SUCCESS: RAG Pipeline Completed!")
    print("Dcouments are chunks are now live in the knowledge base.")
    print("==================================================")

if __name__ == "__main__":
    main()
