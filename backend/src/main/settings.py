import os
from dotenv import load_dotenv

# Load .env from project root
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
ENV_PATH = os.path.join(ROOT_DIR, ".env")

load_dotenv(ENV_PATH)

# ================================
# PINECONE SETTINGS
# ================================
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV")
PINECONE_INDEX = os.getenv("PINECONE_INDEX", "med-chat-index")

# ================================
# EMBEDDING MODEL
# ================================
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "intfloat/e5-base")

# ================================
# LOCAL OLLAMA LLM SETTINGS
# ================================
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "OLLAMA")          # always OLLAMA for local
LLM_MODEL = os.getenv("LLM_MODEL", "phi3:mini")             # Consistent with README

# ================================
# CHUNK SETTINGS
# ================================
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "500"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "50"))

# ================================
# PATH SETTINGS
# ================================
DATA_DIR = os.path.join(ROOT_DIR, "data")
PROCESSED_DIR = os.path.join(ROOT_DIR, "processed")
CHUNKS_DIR = os.path.join(PROCESSED_DIR, "chunks")
ARCHIVE_DIR = os.path.join(PROCESSED_DIR, "archived")

# Create required directories
for d in [DATA_DIR, PROCESSED_DIR, CHUNKS_DIR, ARCHIVE_DIR]:
    os.makedirs(d, exist_ok=True)

# ================================
# VALIDATION
# ================================
missing = []

if not PINECONE_API_KEY:
    missing.append("PINECONE_API_KEY")
if not PINECONE_ENV:
    missing.append("PINECONE_ENV")

if missing:
    print(f"⚠️  WARNING: Missing RAG environment variables: {missing}. RAG features may fail if not configured.")

# ================================
# EXPORT
# ================================
__all__ = [
    "ROOT_DIR",
    "DATA_DIR",
    "PROCESSED_DIR",
    "CHUNKS_DIR",
    "ARCHIVE_DIR",
    "PINECONE_API_KEY",
    "PINECONE_ENV",
    "PINECONE_INDEX",
    "EMBEDDING_MODEL",
    "LLM_PROVIDER",
    "LLM_MODEL",
    "CHUNK_SIZE",
    "CHUNK_OVERLAP",
]
