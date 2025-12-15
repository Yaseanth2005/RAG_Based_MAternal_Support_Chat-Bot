"""
Flask API for RAG Chatbot
Provides REST endpoints for the frontend to interact with the RAG pipeline
"""

from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import os
import sys
import threading
from dotenv import load_dotenv
from datetime import datetime, timedelta
from pymongo import MongoClient, ASCENDING
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from src.rag.pipeline import run_rag_pipeline, _parse_pinecone_response, _build_context, PROMPT_TEMPLATE
from src.embed.embedder_cache import get_embedder
from src.vectorstore.pinecone_cache import get_pinecone_client
from src.llm.ollama_health import check_ollama_health
from src.llm.llm_ollama import generate_llm_stream

# Load environment variables from a .env file (if present)
load_dotenv()

app = Flask(__name__)
# Configure CORS: allow specific origin if set, else allow localhost for dev
frontend_origin = os.getenv('FRONTEND_ORIGIN', 'http://localhost:3000')
CORS(app, resources={r"/api/*": {"origins": [
    frontend_origin, 
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3002"
]}})

# JWT configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'local')
token_minutes = int(os.getenv('TOKEN_EXPIRES_MIN', '60'))
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=token_minutes)
jwt = JWTManager(app)

# ------------------
# Warmup on startup (run after app is created)
# ------------------
def _warmup_background():
    try:
        if os.getenv('PRELOAD_MODELS', 'true').lower() == 'true':
            try:
                emb = get_embedder()
                _ = emb.embed_text('hi')
            except Exception:
                pass
            try:
                pc = get_pinecone_client()
                _ = pc.query([0.0]*768, top_k=1)
            except Exception:
                pass
            try:
                check_ollama_health()
            except Exception:
                pass
    except Exception:
        pass

# Start warmup thread immediately (Flask 3 removed before_first_request)
try:
    threading.Thread(target=_warmup_background, daemon=True).start()
except Exception:
    pass

# MongoDB setup
MONGO_URI = os.getenv('MONGO_URI')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')
mongo_client = None
db = None
users_col = None
chats_col = None
messages_col = None

if MONGO_URI and MONGO_DB_NAME:
    try:
        # Short timeout so a bad URI/credentials don't hang startup forever
        mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        # Force an initial ping to validate connection & auth
        mongo_client.admin.command('ping')

        db = mongo_client[MONGO_DB_NAME]
        users_col = db['users']
        chats_col = db['chats']
        messages_col = db['messages']

        # Indexes
        try:
            users_col.create_index([('email', ASCENDING)], unique=True)
            chats_col.create_index([('user_id', ASCENDING), ('created_at', ASCENDING)])
            messages_col.create_index([('chat_id', ASCENDING), ('created_at', ASCENDING)])
        except Exception:
            # Index creation errors are non-fatal
            pass
        print("✅ Connected to MongoDB and initialized collections")
    except Exception as e:
        # Log but keep API running so we can return a clear error to the frontend
        print(f"⚠️ Failed to connect/authenticate with MongoDB: {e}")
        mongo_client = None
        db = None
        users_col = None
        chats_col = None
        messages_col = None

# Optional: Pre-initialize models on startup if requested
preload = os.getenv("PRELOAD_MODELS", "false").lower() == "true"
if preload:
    print(" Pre-loading models for faster responses...")
    try:
        get_embedder()
        get_pinecone_client()
        print(" Models pre-loaded successfully")
    except Exception as e:
        print(f" Warning: Could not pre-load models: {e}")
else:
    print(" Skipping model preloading (set PRELOAD_MODELS=true to enable)")


def oid(s):
    try:
        return ObjectId(s)
    except Exception:
        return None


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'RAG Chatbot API is running'
    })


@app.route('/api/query', methods=['POST'])
def query():
    """
    Main query endpoint
    Expects JSON: { "question": "your question here", "top_k": 4 }
    Returns: { "answer": "...", "sources": [...] }
    """
    try:
        data = request.get_json()
        
        if not data or 'question' not in data:
            return jsonify({
                'error': 'Missing required field: question'
            }), 400
        
        question = data['question'].strip()
        top_k = data.get('top_k', 4)
        
        if not question:
            return jsonify({
                'error': 'Question cannot be empty'
            }), 400
        
        # Check Ollama health before processing
        is_healthy, health_msg = check_ollama_health()
        if not is_healthy:
            return jsonify({
                'error': f'Ollama service issue: {health_msg}'
            }), 503
        
        # Run the RAG pipeline
        answer, retrieved = run_rag_pipeline(question, top_k=top_k)
        
        # Format sources for frontend
        sources = []
        for item in retrieved:
            sources.append({
                'source_file': item.get('source_file', 'unknown'),
                'score': round(item.get('score', 0), 4),
                'snippet': item.get('text_snippet', '')[:200]  # First 200 chars
            })
        
        return jsonify({
            'answer': answer,
            'sources': sources,
            'question': question
        })
    
    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}'
        }), 500


@app.route('/api/info', methods=['GET'])
def info():
    """Get system information"""
    from src.main.settings import LLM_MODEL, EMBEDDING_MODEL, PINECONE_INDEX
    
    # Check Ollama status
    is_healthy, health_msg = check_ollama_health()
    
    return jsonify({
        'llm_model': LLM_MODEL,
        'embedding_model': EMBEDDING_MODEL,
        'pinecone_index': PINECONE_INDEX,
        'ollama_status': 'healthy' if is_healthy else 'unhealthy',
        'ollama_message': health_msg
    })


@app.route('/api/ollama/status', methods=['GET'])
def ollama_status():
    """Check Ollama service status"""
    is_healthy, message = check_ollama_health()
    
    return jsonify({
        'status': 'healthy' if is_healthy else 'unhealthy',
        'message': message,
        'available': is_healthy
    }), 200 if is_healthy else 503


# =====================
# Auth Endpoints (JWT)
# =====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    if users_col is None:
        return jsonify({'error': 'Database not configured'}), 500
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    name = (data.get('name') or '').strip()
    if not email or not password:
        return jsonify({'error': 'email and password are required'}), 400
    if users_col.find_one({'email': email}):
        return jsonify({'error': 'Email already in use'}), 409
    pwd_hash = generate_password_hash(password)
    user_doc = {
        'email': email,
        'password_hash': pwd_hash,
        'name': name,
        'role': 'user',
        'created_at': datetime.utcnow()
    }
    res = users_col.insert_one(user_doc)
    user_id = str(res.inserted_id)
    access_token = create_access_token(identity=user_id)
    return jsonify({'access_token': access_token, 'user': {'id': user_id, 'email': email, 'name': name}}), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    if users_col is None:
        return jsonify({'error': 'Database not configured'}), 500
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    if not email or not password:
        return jsonify({'error': 'email and password are required'}), 400
    user = users_col.find_one({'email': email})
    if not user or not check_password_hash(user.get('password_hash', ''), password):
        return jsonify({'error': 'Invalid credentials'}), 401
    user_id = str(user['_id'])
    access_token = create_access_token(identity=user_id)
    return jsonify({'access_token': access_token, 'user': {'id': user_id, 'email': email, 'name': user.get('name', '')}})


@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def me():
    uid = get_jwt_identity()
    u = users_col.find_one({'_id': oid(uid)}) if users_col is not None else None
    if not u:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'id': str(u['_id']), 'email': u['email'], 'name': u.get('name', '')})


# ==========================
# Chat & Message Endpoints
# ==========================

@app.route('/api/chats', methods=['POST'])
@jwt_required()
def create_chat():
    if chats_col is None:
        return jsonify({'error': 'Database not configured'}), 500
    uid = get_jwt_identity()
    data = request.get_json() or {}
    title = (data.get('title') or 'New Chat').strip() or 'New Chat'
    doc = {
        'user_id': oid(uid),
        'title': title,
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow(),
    }
    res = chats_col.insert_one(doc)
    # Trim to last 10 chats for this user (delete older ones)
    try:
        total = chats_col.count_documents({'user_id': oid(uid)})
        if total > 10:
            to_delete_count = total - 10
            old_cursor = chats_col.find({'user_id': oid(uid)}).sort('updated_at', 1).limit(to_delete_count)
            old_ids = [c['_id'] for c in old_cursor]
            if old_ids:
                chats_col.delete_many({'_id': {'$in': old_ids}})
                messages_col.delete_many({'chat_id': {'$in': old_ids}})
    except Exception:
        pass
    return jsonify({'id': str(res.inserted_id), 'title': title}), 201


@app.route('/api/chats', methods=['GET'])
@jwt_required()
def list_chats():
    if chats_col is None:
        return jsonify({'error': 'Database not configured'}), 500
    uid = get_jwt_identity()
    chats = []
    for c in chats_col.find({'user_id': oid(uid)}).sort('updated_at', -1).limit(10):
        chats.append({'id': str(c['_id']), 'title': c.get('title', ''), 'created_at': c.get('created_at'), 'updated_at': c.get('updated_at')})
    return jsonify(chats)


@app.route('/api/chats/<chat_id>', methods=['PUT'])
@jwt_required()
def rename_chat(chat_id):
    if chats_col is None:
        return jsonify({'error': 'Database not configured'}), 500
    uid = get_jwt_identity()
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    if not title:
        return jsonify({'error': 'title required'}), 400
    res = chats_col.update_one({'_id': oid(chat_id), 'user_id': oid(uid)}, {'$set': {'title': title, 'updated_at': datetime.utcnow()}})
    if res.matched_count == 0:
        return jsonify({'error': 'Chat not found'}), 404
    return jsonify({'ok': True})


@app.route('/api/chats/<chat_id>', methods=['DELETE'])
@jwt_required()
def delete_chat(chat_id):
    if chats_col is None or messages_col is None:
        return jsonify({'error': 'Database not configured'}), 500
    uid = get_jwt_identity()
    res = chats_col.delete_one({'_id': oid(chat_id), 'user_id': oid(uid)})
    if res.deleted_count == 0:
        return jsonify({'error': 'Chat not found'}), 404
    messages_col.delete_many({'chat_id': oid(chat_id)})
    return jsonify({'ok': True})


@app.route('/api/chats/<chat_id>/messages', methods=['GET'])
@jwt_required()
def list_messages(chat_id):
    if messages_col is None or chats_col is None:
        return jsonify({'error': 'Database not configured'}), 500
    uid = get_jwt_identity()
    chat = chats_col.find_one({'_id': oid(chat_id), 'user_id': oid(uid)})
    if not chat:
        return jsonify({'error': 'Chat not found'}), 404
    msgs = []
    for m in messages_col.find({'chat_id': oid(chat_id)}).sort('created_at', 1):
        msgs.append({'id': str(m['_id']), 'role': m.get('role'), 'content': m.get('content'), 'created_at': m.get('created_at')})
    return jsonify(msgs)


@app.route('/api/chats/<chat_id>/messages', methods=['POST'])
@jwt_required()
def add_message(chat_id):
    if messages_col is None or chats_col is None:
        return jsonify({'error': 'Database not configured'}), 500
    uid = get_jwt_identity()
    chat = chats_col.find_one({'_id': oid(chat_id), 'user_id': oid(uid)})
    if not chat:
        return jsonify({'error': 'Chat not found'}), 404
    data = request.get_json() or {}
    content = (data.get('content') or '').strip()
    if not content:
        return jsonify({'error': 'content required'}), 400

    # Save user message
    user_msg = {
        'chat_id': oid(chat_id),
        'role': 'user',
        'content': content,
        'created_at': datetime.utcnow()
    }
    user_res = messages_col.insert_one(user_msg)

    # RAG response
    is_healthy, health_msg = check_ollama_health()
    if not is_healthy:
        return jsonify({'error': f'Ollama service issue: {health_msg}'}), 503
    answer, retrieved = run_rag_pipeline(content, top_k=data.get('top_k', 4))

    # Save assistant message
    asst_msg = {
        'chat_id': oid(chat_id),
        'role': 'assistant',
        'content': answer,
        'created_at': datetime.utcnow()
    }
    asst_res = messages_col.insert_one(asst_msg)

    # Update chat timestamp
    chats_col.update_one({'_id': oid(chat_id)}, {'$set': {'updated_at': datetime.utcnow()}})

    return jsonify({
        'user_message': {'id': str(user_res.inserted_id)},
        'assistant_message': {
            'id': str(asst_res.inserted_id),
            'content': answer,
            'sources': retrieved
        }
    }), 201


@app.route('/api/chats/<chat_id>/messages/stream', methods=['POST'])
@jwt_required()
def add_message_stream(chat_id):
    if messages_col is None or chats_col is None:
        return jsonify({'error': 'Database not configured'}), 500
    uid = get_jwt_identity()
    chat = chats_col.find_one({'_id': oid(chat_id), 'user_id': oid(uid)})
    if not chat:
        return jsonify({'error': 'Chat not found'}), 404

    data = request.get_json() or {}
    content = (data.get('content') or '').strip()
    if not content:
        return jsonify({'error': 'content required'}), 400

    # Save user message first
    user_msg = {
        'chat_id': oid(chat_id),
        'role': 'user',
        'content': content,
        'created_at': datetime.utcnow()
    }
    messages_col.insert_one(user_msg)

    # Health check
    is_healthy, health_msg = check_ollama_health()
    if not is_healthy:
        return jsonify({'error': f'Ollama service issue: {health_msg}'}), 503

    # Build RAG prompt (replicating pipeline steps quickly)
    try:
        embedder = get_embedder()
        qvec = embedder.embed_text(content)
        pine = get_pinecone_client()
        raw = pine.query(qvec, top_k=int((request.get_json() or {}).get('top_k', 4)))
        if hasattr(raw, 'to_dict'):
            raw = raw.to_dict()
        retrieved = _parse_pinecone_response(raw)
        context = _build_context(retrieved, max_chars_per_item=250)
        prompt = PROMPT_TEMPLATE.format(context=context, question=content)
    except Exception as e:
        return jsonify({'error': f'RAG prep failed: {str(e)}'}), 500

    def event_stream():
        buffer = []
        try:
            # Send sources first so UI can render them while streaming
            try:
                import json as _json
                yield "event: sources\n" + f"data: {_json.dumps(retrieved)}\n\n"
            except Exception:
                pass
            # Quick ready event to confirm stream open on client
            try:
                yield "event: ready\ndata: ok\n\n"
            except Exception:
                pass
            for chunk in generate_llm_stream(prompt):
                if not chunk:
                    continue
                buffer.append(chunk)
                yield f"data: {chunk}\n\n"
            full_text = ''.join(buffer)
            # Save assistant message and update chat timestamp
            asst_doc = {
                'chat_id': oid(chat_id),
                'role': 'assistant',
                'content': full_text,
                'created_at': datetime.utcnow()
            }
            messages_col.insert_one(asst_doc)
            chats_col.update_one({'_id': oid(chat_id)}, {'$set': {'updated_at': datetime.utcnow()}})
            yield "event: done\ndata: done\n\n"
        except Exception as e:
            yield f"event: error\ndata: {str(e)}\n\n"

    headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
    }
    return Response(stream_with_context(event_stream()), headers=headers)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
