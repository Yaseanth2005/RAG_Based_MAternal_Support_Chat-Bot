# 🛠️ Setup Guide for Maternal Care RAG Chatbot

This guide covers the installation, configuration, and execution of the Maternal Care RAG Chatbot.

## 📋 Prerequisites

Ensure you have the following installed before starting:

1.  **Python 3.12+**
2.  **Node.js 18+** & **npm**
3.  **Ollama**: Installed and running locally.
4.  **Git**: For version control.

---

## 🏗️ Installation

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```powershell
    cd backend
    ```

2.  **Create a virtual environment:**
    ```powershell
    python -m venv .venv
    ```

3.  **Activate the virtual environment:**
    *   **Windows (PowerShell):**
        ```powershell
        .\.venv\Scripts\Activate.ps1
        ```
    *   **Linux/Mac:**
        ```bash
        source .venv/bin/activate
        ```

4.  **Install dependencies:**
    ```powershell
    python -m pip install --upgrade pip
    # Install Torch (CPU version for local dev, or adjust for CUDA)
    python -m pip install torch==2.4.1 --index-url https://download.pytorch.org/whl/cpu
    # Install project requirements
    python -m pip install -r ../requirements.txt
    ```
    *(Note: If `requirements.txt` is in the root, use `../requirements.txt` from inside `backend` or just `pip install -r requirements.txt` from root)*

5.  **Configure Environment Variables:**
    Create a `.env` file in the `backend/` directory based on the example below:

    ```ini
    # LLM Configuration (Ollama)
    LLM_PROVIDER=OLLAMA
    LLM_MODEL=phi3:mini
    PRELOAD_MODELS=true

    # Pinecone Vector DB (for RAG) - Optional if RAG is disabled
    PINECONE_API_KEY=your_pinecone_api_key
    PINECONE_ENV=us-east-1
    PINECONE_INDEX=med-chat-index

    # Embeddings
    EMBEDDING_MODEL=intfloat/e5-base
    EMBEDDING_DIM=768

    # Database & Security
    MONGO_URI=your_mongodb_uri
    MONGO_DB_NAME=RAG_Chat_Bot_Final_User_Data
    JWT_SECRET_KEY=change_this_to_a_secure_random_string
    TOKEN_EXPIRES_MIN=60
    ```

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```powershell
    cd frontend-react
    ```

2.  **Install Node dependencies:**
    ```powershell
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `frontend-react/` directory:

    ```ini
    VITE_API_URL=http://localhost:5000
    ```

### 3. Model Setup (Ollama)

Ensure Ollama is running, then pull the required model:

```powershell
ollama pull phi3:instruct
```

*(Or whichever model you specified in `backend/.env`)*

---

## 🚀 Running the Application

### Option 1: Using Batch Scripts (Windows)

We have provided convenient batch scripts to start both services.

1.  **Start Backend:**
    ```powershell
    cd backend
    .\run_backend.bat
    ```

2.  **Start Frontend:**
    ```powershell
    cd frontend-react
    .\run_frontend.bat
    ```

### Option 2: Manual Start

**Backend:**
```powershell
cd backend
# Ensure venv is active
python run_backend.py
```

**Frontend:**
```powershell
cd frontend-react
npm run dev
```

---

## 🌐 Accessing the App

*   **Frontend UI:** [http://localhost:3000](http://localhost:3000)
*   **Backend API API:** [http://localhost:5000/api](http://localhost:5000/api)
*   **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📦 Production Build

To build the frontend for production:

```powershell
cd frontend-react
npm run build
```

The dist output will be in `frontend-react/dist`. You can serve this using any static file server (e.g., Nginx, serve).
