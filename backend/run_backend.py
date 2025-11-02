"""
Backend Server Launcher
Starts the Flask API server for the RAG chatbot
"""

import sys
import os

# Ensure UTF-8 output on Windows
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

def main():
    """Start the Flask backend server"""
    print("=" * 60)
    print("🚀 Starting RAG Chatbot Backend Server")
    print("=" * 60)
    print()
    print("📋 Server Information:")
    print("   • Port: 5000")
    print("   • API Base: http://localhost:5000/api")
    print("   • CORS: Enabled")
    print()
    print("⏳ Initializing...")
    print()
    
    try:
        from src.api.app import app
        
        print("✅ Backend loaded successfully")
        print()
        print("=" * 60)
        print("🌐 Backend running at http://localhost:5000")
        print("=" * 60)
        print()
        print("💡 API Endpoints:")
        print("   • GET  /api/health  - Health check")
        print("   • POST /api/query   - Submit questions")
        print("   • GET  /api/info    - System information")
        print()
        print("Press Ctrl+C to stop the server")
        print("-" * 60)
        print()
        
        # Start Flask server
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=False,
            use_reloader=False
        )
        
    except ImportError as e:
        print("❌ Failed to import Flask app. Error:")
        print(f"   {str(e)}")
        print()
        print("💡 Make sure you have installed all dependencies:")
        print("   pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Fatal error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n")
        print("=" * 60)
        print("👋 Backend server stopped")
        print("=" * 60)
        sys.exit(0)
