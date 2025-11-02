# 🤖 Maternal Care RAG Chatbot

A modern RAG (Retrieval-Augmented Generation) chatbot for maternal health information, powered by local LLM (Ollama), Pinecone vector database, and a React frontend.

## ✨ Features

- **Modern React UI** (Vite) with consistent styling
- **Streaming answers** with Stop and Regenerate
- **Reliable first response** via backend warmup + client fallback
- **Separate Sources panel** (no inline citations), with relevance %
- **Auth + Chat history** (max 10 recent per user, rename/delete)
- **Local LLM (Ollama)** configurable via `.env`
- **Pinecone** vector search for RAG context

## 📁 Project Structure

```
RAGGGGGG/
├── backend/
│   ├── src/
│   │   ├── api/           # Flask API endpoints
│   │   ├── rag/           # RAG pipeline (CORE - DO NOT MODIFY)
│   │   ├── llm/           # LLM integration (CORE)
│   │   ├── embed/         # Embedding models (CORE)
│   │   ├── vectorstore/   # Pinecone client (CORE)
│   │   └── main/          # Settings & config (CORE)
│   ├── data/              # Raw documents
│   ├── processed/         # Processed chunks
│   ├── run_backend.py     # Backend launcher
│   └── run_backend.bat    # Windows launcher
├── frontend-react/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Styling
│   │   └── main.jsx       # Entry point
│   ├── package.json       # Node dependencies
│   ├── vite.config.js     # Vite configuration
│   └── run_frontend.bat   # Windows launcher
└── requirements.txt       # Python dependencies
```

## 🚀 Quick Start

### Prerequisites

1. **Python 3.12** (recommended)
2. **Node.js 18+**
3. **Ollama** installed and running
4. **Pinecone API Key** (optional if you disable RAG)

### Installation

#### 1) Backend Setup

```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # PowerShell
python -m pip install --upgrade pip setuptools wheel
python -m pip install torch==2.4.1 --index-url https://download.pytorch.org/whl/cpu
python -m pip install --no-build-isolation -r requirements.txt
```

Create or edit `backend/.env`:
```env
# LLM (Ollama)
LLM_PROVIDER=OLLAMA
LLM_MODEL=phi3:mini
PRELOAD_MODELS=true

# Pinecone (optional, for RAG)
PINECONE_API_KEY=your_api_key
PINECONE_ENV=us-east-1
PINECONE_INDEX=med-chat-index

# Embeddings
EMBEDDING_MODEL=intfloat/e5-base
EMBEDDING_DIM=768

# MongoDB + Auth
MONGO_URI=your_mongo_uri
MONGO_DB_NAME=RAG_Chat_Bot_Final_User_Data
JWT_SECRET_KEY=local
TOKEN_EXPIRES_MIN=60
```

#### 2) Frontend Setup

```bash
# Install Node dependencies
cd frontend-react
npm install
```

Create `frontend-react/.env`:
```env
VITE_API_URL=http://localhost:5000
```

#### 3. Install Ollama Model

```bash
ollama pull phi3:instruct
```

## 🎯 Running the Application

### Option 1: Windows Batch Files (Easiest)

**Terminal 1 - Backend:**
```bash
cd backend
.\run_backend.bat
```

**Terminal 2 - Frontend:**
```bash
cd frontend-react
.\run_frontend.bat
```

### Option 2: Manual Commands

**Terminal 1 - Backend:**
```bash
cd backend
python run_backend.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend-react
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## 💻 Usage

1. **Start backend** (Terminal 1)
2. **Start frontend** (Terminal 2)
3. **Open browser** at `http://localhost:3000`
4. **Ask questions** about maternal health
5. **View answers**. References shown below the answer as subtle chips (no inline citations)

### Example Questions

- "What vitamins are recommended during pregnancy?"
- "What are common symptoms in the first trimester?"
- "How to manage morning sickness?"

## 🔧 Configuration

### Backend Configuration (via `backend/.env`)

- `LLM_PROVIDER` = `OLLAMA`
- `LLM_MODEL` = e.g., `phi3:mini` (change model without code changes)
- `PRELOAD_MODELS` = `true|false` (warmup models on start)
- `PINECONE_*` = enable/disable RAG by setting or omitting API key
- `EMBEDDING_MODEL`, `EMBEDDING_DIM`
- `MONGO_URI`, `MONGO_DB_NAME`, `JWT_SECRET_KEY`, `TOKEN_EXPIRES_MIN`

### Frontend Settings (`frontend-react/vite.config.js`)

- `port`: Development server port (default: 3000)
- `proxy`: Backend API proxy configuration

### Key API Endpoints

- `GET /api/health` – Health check
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Chats: `GET/POST /api/chats`, `PUT/DELETE /api/chats/:id`
- Messages: `GET/POST /api/chats/:id/messages`
- Streaming: `POST /api/chats/:id/messages/stream` (SSE: `sources`, `ready`, chunks)

## 🎨 UI Features

- **Modern React UI**: Built with Vite for fast development
- **Dark Theme**: Professional gradient design
- **Responsive**: Works on all screen sizes
- **Real-time Status**: Connection status indicator
- **Inline Sources**: Sources displayed in single line format
- **Loading States**: Visual feedback during processing

## 🛠️ Development

### Backend Development

```bash
cd backend
python run_backend.py
```

Backend runs on `http://localhost:5000`

### Frontend Development

```bash
cd frontend-react
npm run dev
```

Frontend runs on `http://localhost:3000` with hot reload

### Building for Production

```bash
cd frontend-react
npm run build
```

## 📊 System Requirements

- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 5GB for models and dependencies
- **Network**: Internet required for Pinecone queries

## 🐛 Troubleshooting

### Backend Issues

**"Module not found"**
```bash
pip install -r requirements.txt
```

**"Ollama connection refused"**
```bash
ollama serve
ollama pull phi3:instruct
```

**"Pinecone authentication failed"**
- Check `backend/.env` file
- Verify API key and environment

### Frontend Issues

**"Cannot find module"**
```bash
cd frontend-react
npm install
```

**"Backend offline"**
- Ensure backend is running on port 5000
- Check CORS settings

### Performance & UX

- First request: backend warms up models in background.
- Client fallback: if no tokens arrive quickly, app auto-switches to non‑stream once.
- Sources panel: minimal chips show filename and relevance %. Inline citations are suppressed in answers.
- Auto‑scroll: only scrolls if you’re near the bottom; you can read older messages while new tokens stream.

## 📝 License

Educational and research purposes.


---

**Need help?** Check terminal output for detailed error messages.
