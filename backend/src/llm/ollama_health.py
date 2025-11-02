"""
Ollama Health Check
Verifies Ollama is responsive before sending queries
"""

import requests

def check_ollama_health(timeout=5):
    """
    Check if Ollama is running and responsive
    Returns: (is_healthy: bool, message: str)
    """
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=timeout)
        if response.status_code == 200:
            return True, "Ollama is running"
        else:
            return False, f"Ollama returned status {response.status_code}"
    except requests.exceptions.ConnectionError:
        return False, "Cannot connect to Ollama. Please start it with: ollama serve"
    except requests.exceptions.Timeout:
        return False, "Ollama is not responding. It might be overloaded."
    except Exception as e:
        return False, f"Ollama health check failed: {str(e)}"


def get_loaded_models(timeout=5):
    """
    Get list of loaded models from Ollama
    Returns: list of model names or empty list
    """
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=timeout)
        if response.status_code == 200:
            data = response.json()
            return [model.get('name', '') for model in data.get('models', [])]
        return []
    except:
        return []
