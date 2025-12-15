# 🤖 Maternal Care RAG Chatbot

![License](https://img.shields.io/badge/license-Educational-blue.svg)
![Python](https://img.shields.io/badge/python-3.12-blue.svg)
![React](https://img.shields.io/badge/react-18-cyan.svg)
![Ollama](https://img.shields.io/badge/ollama-local-orange.svg)

A modern, production-ready Retrieval-Augmented Generation (RAG) chatbot designed to provide maternal health information. Powered by a local Large Language Model (Ollama), Pinecone vector search, and a polished React frontend.

---

## ✨ Key Features

*   **🧠 Local LLM Intelligence**: Privacy-focused and cost-effective using local models via Ollama.
*   **📚 RAG Architecture**: Accurate responses grounded in your document knowledge base using Pinecone vector search.
*   **💻 Modern React Client**: A beautiful, responsive UI built with Vite, featuring dark mode, glassmorphism, and smooth animations.
*   **⚡ Streaming Responses**: Real-time token streaming with "Stop" and "Regenerate" capabilities.
*   **🔍 Transparent Citations**: "Sources" panel displays relevance scores and filenames for every answer (no inline hallucinations).
*   **🛡️ Robust Backend**: Flask API with model warming, health checks, and connection resilience.

---

## 🏗️ System Architecture

The project is structured into two main components:

### 1. Backend (`/backend`)
*   **Framework**: Flask (Python)
*   **Core Modules**:
    *   `src/rag`: RAG pipeline and retrieval logic.
    *   `src/llm`: Interface for Ollama.
    *   `src/vectorstore`: Pinecone integration.
    *   `src/ingest`: Document processing and chunking.
*   **Data**: `data/` for raw PDFs, `processed/` for artifacts.

### 2. Frontend (`/frontend-react`)
*   **Framework**: React (Vite)
*   **Styling**: Custom CSS with responsive design.
*   **State**: Real-time chat history and connection management.

---

## 🚀 Quick Start

For detailed installation and configuration instructions, please refer to the **[Setup Guide](setup_guide.md)**.

### Brief Summary

1.  **Prerequisites**: Python 3.12, Node.js, Ollama.
2.  **Setup**:
    *   Install backend dependencies (`pip install -r requirements.txt`).
    *   Install frontend dependencies (`npm install`).
    *   Configure `.env` files in both directories.
3.  **Run**:
    *   Backend: `run_backend.bat` (Windows) or `python run_backend.py`
    *   Frontend: `run_frontend.bat` (Windows) or `npm run dev`

---

## 📂 Project Structure

```text
RAGGGGGG/
├── backend/                # Python Flask API & RAG Logic
│   ├── src/                # Core source code
│   ├── data/               # Raw documents for ingestion
│   ├── run_backend.py      # Server entry point
│   └── ingest_documents.py # Data ingestion script
├── frontend-react/         # React application
│   ├── src/                # UI source code
│   └── vite.config.js      # Vite config
├── setup_guide.md          # Detailed setup instructions
├── requirements.txt        # Python dependencies
└── README.md               # This file
```

---

## 🛠️ Data Ingestion

To update the knowledge base:

1.  Place PDF documents in `backend/data/`.
2.  Run the ingestion script:
    ```bash
    python backend/ingest_documents.py
    ```
3.  This will chunk the documents, generate embeddings, and upsert them to your Pinecone index.

---

## 📄 License

This project is for **Educational and Research Purposes**.

---

**Need help?** Check the terminal output for error logs or refer to `setup_guide.md` for troubleshooting.
