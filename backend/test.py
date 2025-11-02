# from src.ingest.ingest import ingest_files

# ingest_files()

# from src.vectorstore.pinecone_client import PineconeClient

# client = PineconeClient()
# client.upsert_all_chunks()


# from pinecone import Pinecone
# from src.main.settings import PINECONE_API_KEY, PINECONE_INDEX

# pc = Pinecone(api_key=PINECONE_API_KEY)
# index = pc.Index(PINECONE_INDEX)

# stats = index.describe_index_stats()

# print("✅ Connected Pinecone Index:", PINECONE_INDEX)
# print("📌 Vector Count:", stats.get("vector_count"))
# print("📌 Namespaces:", stats.get("namespaces"))


# import requests

# url = "https://api-inference.huggingface.co/models/google/gemma-2b-it"
# print("Model exists:", requests.get(url).status_code)

import os, requests
from src.main.settings import HF_API_KEY

def probe(model):
    url = f"https://api-inference.huggingface.co/models/{model}"
    headers = {"Authorization": f"Bearer {HF_API_KEY}"} if HF_API_KEY else {}
    try:
        r = requests.get(url, headers=headers, timeout=20)
        print(model, "→ status:", r.status_code)
        # small print of reason (if any)
        print("  response snippet:", r.text[:400].replace("\n"," "))
    except Exception as e:
        print(model, "→ ERROR:", str(e))

if __name__ == "__main__":
    models = [
        "gpt2",
        "facebook/opt-125m",
        "microsoft/phi-2",
        "google/gemma-7b-it",
        "google/gemma-2b-it",
        "meta-llama/Llama-3.2-3B-Instruct"
    ]
    for m in models:
        probe(m)


