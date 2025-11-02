import os
import json
import shutil
from pathlib import Path
from pypdf import PdfReader

from src.main.settings import (
    DATA_DIR,
    CHUNKS_DIR,
    ARCHIVE_DIR,
    CHUNK_SIZE,
    CHUNK_OVERLAP
)


# ===============================================================
# Helper Functions
# ===============================================================

def read_txt(path: Path) -> str:
    """Read .txt / .md / .csv as plain text."""
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        print(f"❌ Failed reading text file {path.name}: {e}")
        return ""


def read_pdf(path: Path) -> str:
    """Extract text from a PDF safely."""
    text_output = []

    try:
        reader = PdfReader(str(path))
    except Exception as e:
        print(f"❌ Could not open PDF {path.name}: {e}")
        return ""

    for i, page in enumerate(reader.pages):
        try:
            extracted = page.extract_text() or ""
            extracted = extracted.strip()
            if extracted:
                text_output.append(extracted)
        except Exception:
            print(f"⚠️ Failed extracting text from page {i} in {path.name}")
            continue

    return "\n".join(text_output)


def chunk_text(text: str, size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    """Split long text into overlapping chunks (safe version)."""
    if not text or not text.strip():
        return []

    text = text.replace("\x00", "")  # remove null bytes from bad PDFs

    chunks = []
    start = 0
    length = len(text)

    while start < length:
        end = start + size
        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        # Move window
        start = end - overlap

    return chunks


def save_chunk(chunk_text: str, source: str, index: int):
    """Save chunk into processed/chunks with RAG metadata."""
    chunk_id = f"{source}__chunk_{index}"

    out_path = Path(CHUNKS_DIR) / f"{chunk_id}.json"

    data = {
        "chunk_id": chunk_id,
        "source_file": source,
        "text": chunk_text,
        "text_snippet": chunk_text[:300]   # ✅ Used by RAG pipeline
    }

    try:
        out_path.write_text(
            json.dumps(data, ensure_ascii=False, indent=2),
            encoding="utf-8"
        )
    except Exception as e:
        print(f"❌ Failed saving chunk {chunk_id}: {e}")

    return chunk_id


# ===============================================================
# Main Ingestion Function
# ===============================================================

def ingest_files():
    """Main function: read → chunk → save → archive."""
    data_path = Path(DATA_DIR)
    files = list(data_path.glob("*"))

    if not files:
        print("✅ No files in /data folder — add PDFs or TXT files to ingest.")
        return

    print(f"📥 Found {len(files)} file(s). Starting ingestion...\n")

    for file in files:
        ext = file.suffix.lower()
        print(f"🔍 Processing: {file.name}")

        # -----------------------------------
        # Step 1: Extract text
        # -----------------------------------
        if ext in [".txt", ".md", ".csv"]:
            text = read_txt(file)
        elif ext == ".pdf":
            text = read_pdf(file)
        else:
            print(f"⚠️ Unsupported file type: {file.name}, skipping.\n")
            continue

        # -----------------------------------
        # Step 2: Chunk
        # -----------------------------------
        chunks = chunk_text(text)

        if not chunks:
            print(f"⚠️ No extractable text found in {file.name}, skipping.\n")
            continue

        print(f"✅ Extracted {len(chunks)} chunks.")

        # -----------------------------------
        # Step 3: Save chunks
        # -----------------------------------
        for i, chunk in enumerate(chunks):
            save_chunk(chunk, file.stem, i)

        # -----------------------------------
        # Step 4: Archive original file
        # -----------------------------------
        try:
            shutil.move(str(file), Path(ARCHIVE_DIR) / file.name)
            print(f"📦 Archived original file: {file.name}\n")
        except Exception as e:
            print(f"⚠️ Failed to archive {file.name}: {e}\n")

    print("🎉 Ingestion complete! All files processed.\n")
