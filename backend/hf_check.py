import requests
from src.main.settings import HF_API_KEY

def probe(model):
    url = f"https://api-inference.huggingface.co/models/{model}"
    headers = {"Authorization": f"Bearer {HF_API_KEY}"} if HF_API_KEY else {}
    try:
        r = requests.get(url, headers=headers, timeout=20)
        print(f"{model} → {r.status_code}")
        print("   snippet:", r.text[:150].replace("\n"," "))
    except Exception as e:
        print(f"{model} → ERROR:", str(e))


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
