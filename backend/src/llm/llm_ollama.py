import os
import requests

def generate_llm_response(prompt: str) -> str:
    url = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434") + "/api/generate"

    model = os.getenv("LLM_MODEL", "phi3:mini")
    num_predict = int(os.getenv("LLM_NUM_PREDICT", "450"))
    temperature = float(os.getenv("LLM_TEMPERATURE", "0.25"))
    top_k = int(os.getenv("LLM_TOP_K", "30"))
    top_p = float(os.getenv("LLM_TOP_P", "0.9"))
    num_ctx = int(os.getenv("LLM_NUM_CTX", "2048"))
    num_thread = int(os.getenv("LLM_NUM_THREAD", "4"))
    repeat_penalty = float(os.getenv("LLM_REPEAT_PENALTY", "1.15"))

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "num_predict": num_predict,
            "temperature": temperature,
            "top_k": top_k,
            "top_p": top_p,
            "num_ctx": num_ctx,
            "num_thread": num_thread,
            "repeat_penalty": repeat_penalty
        }
    }

    try:
        response = requests.post(url, json=payload, timeout=120)
        response.raise_for_status()

        # Ollama sometimes returns NDJSON even when stream=False
        text = response.text.strip()

        # Split possible NDJSON lines
        if "\n" in text:
            try:
                import json
                last = json.loads(text.splitlines()[-1])
                return last.get("response", "").strip()
            except:
                pass

        # Normal JSON case
        data = response.json()
        return data.get("response", "").strip()

    except requests.exceptions.Timeout:
        return ("I apologize, but I'm taking longer than expected to respond. "
                "This might be because the AI model is processing a complex question. "
                "Please try asking a simpler question, or wait a moment and try again. "
                "If this persists, the Ollama service might need to be restarted.")
    except requests.exceptions.ConnectionError:
        return ("I'm having trouble connecting to the AI model. "
                "Please make sure Ollama is running. You can start it with: ollama serve")
    except Exception as e:
        return f"I encountered an unexpected error: {str(e)}. Please try again or contact support."


def generate_llm_stream(prompt: str):
    """Yield assistant text chunks from Ollama as they arrive."""
    url = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434") + "/api/generate"
    model = os.getenv("LLM_MODEL", "phi3:mini")
    num_predict = int(os.getenv("LLM_NUM_PREDICT", "450"))
    temperature = float(os.getenv("LLM_TEMPERATURE", "0.25"))
    top_k = int(os.getenv("LLM_TOP_K", "30"))
    top_p = float(os.getenv("LLM_TOP_P", "0.9"))
    num_ctx = int(os.getenv("LLM_NUM_CTX", "2048"))
    num_thread = int(os.getenv("LLM_NUM_THREAD", "4"))
    repeat_penalty = float(os.getenv("LLM_REPEAT_PENALTY", "1.15"))
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": True,
        "options": {
            "num_predict": num_predict,
            "temperature": temperature,
            "top_k": top_k,
            "top_p": top_p,
            "num_ctx": num_ctx,
            "num_thread": num_thread,
            "repeat_penalty": repeat_penalty
        }
    }
    try:
        with requests.post(url, json=payload, stream=True, timeout=120) as r:
            r.raise_for_status()
            for line in r.iter_lines(decode_unicode=True):
                if not line:
                    continue
                # Ollama streams NDJSON lines
                try:
                    import json
                    obj = json.loads(line)
                    if 'response' in obj and obj['response']:
                        yield obj['response']
                    if obj.get('done'):
                        break
                except Exception:
                    # ignore malformed line
                    continue
    except Exception as e:
        yield f"[stream-error] {str(e)}"
