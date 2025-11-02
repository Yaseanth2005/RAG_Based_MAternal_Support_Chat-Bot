"""
Singleton Embedder Cache
Prevents reloading the embedding model on every request
"""

from src.embed.embedder import Embedder

_embedder_instance = None

def get_embedder():
    """Get or create a singleton embedder instance"""
    global _embedder_instance
    if _embedder_instance is None:
        print("🔧 Initializing embedder (first time only)...")
        _embedder_instance = Embedder()
        print("✅ Embedder cached and ready")
    return _embedder_instance
