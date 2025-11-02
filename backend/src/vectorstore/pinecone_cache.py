"""
Singleton Pinecone Client Cache
Prevents reconnecting to Pinecone on every request
"""

from src.vectorstore.pinecone_client import PineconeClient

_pinecone_instance = None

def get_pinecone_client():
    """Get or create a singleton Pinecone client instance"""
    global _pinecone_instance
    if _pinecone_instance is None:
        print("🔗 Initializing Pinecone connection (first time only)...")
        _pinecone_instance = PineconeClient()
        print("✅ Pinecone client cached and ready")
    return _pinecone_instance
