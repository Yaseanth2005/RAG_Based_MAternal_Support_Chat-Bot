"""
Quick test script to verify Ollama and phi3:mini are working
"""

import requests
import time

def test_ollama():
    """Test if Ollama is running and phi3:mini is available"""
    
    print("=" * 60)
    print("🔍 Testing Ollama Setup")
    print("=" * 60)
    print()
    
    # Test 1: Check if Ollama is running
    print("Test 1: Checking if Ollama is running...")
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            print("✅ Ollama is running")
            
            # List available models
            data = response.json()
            models = [m.get('name', '') for m in data.get('models', [])]
            print(f"📦 Available models: {', '.join(models)}")
            
            if 'phi3:mini' in models:
                print("✅ phi3:mini is installed")
            else:
                print("❌ phi3:mini NOT found. Run: ollama pull phi3:mini")
                return False
        else:
            print(f"❌ Ollama returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to Ollama: {e}")
        print("💡 Make sure Ollama is running: ollama serve")
        return False
    
    print()
    
    # Test 2: Test phi3:mini response speed
    print("Test 2: Testing phi3:mini response speed...")
    print("Sending test prompt...")
    
    start = time.time()
    
    try:
        payload = {
            "model": "phi3:mini",
            "prompt": "What are prenatal vitamins?",
            "stream": False,
            "options": {
                "num_predict": 150,
                "temperature": 0.5,
                "top_k": 20,
                "top_p": 0.8,
                "num_ctx": 1024,
                "num_thread": 8
            }
        }
        
        response = requests.post(
            "http://localhost:11434/api/generate",
            json=payload,
            timeout=60
        )
        
        elapsed = time.time() - start
        
        if response.status_code == 200:
            data = response.json()
            answer = data.get('response', '').strip()
            
            print(f"✅ Response received in {elapsed:.1f} seconds")
            print()
            print("📝 Sample response:")
            print("-" * 60)
            print(answer[:200] + "..." if len(answer) > 200 else answer)
            print("-" * 60)
            print()
            
            # Evaluate speed
            if elapsed < 20:
                print("🚀 EXCELLENT: Response time < 20s")
            elif elapsed < 30:
                print("✅ GOOD: Response time < 30s")
            elif elapsed < 45:
                print("⚠️ ACCEPTABLE: Response time < 45s")
            else:
                print("❌ TOO SLOW: Response time > 45s")
                print("💡 Try restarting Ollama or closing other apps")
            
            return True
        else:
            print(f"❌ Request failed with status {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Request timed out (> 60s)")
        print("💡 Model might be too slow. Try restarting Ollama.")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    print()

if __name__ == "__main__":
    success = test_ollama()
    
    print()
    print("=" * 60)
    if success:
        print("✅ ALL TESTS PASSED")
        print("=" * 60)
        print()
        print("🎉 Your setup is ready!")
        print()
        print("Next steps:")
        print("1. Start backend: cd backend && python run_backend.py")
        print("2. Start frontend: cd frontend-react && npm run dev")
        print("3. Open: http://localhost:3000")
    else:
        print("❌ TESTS FAILED")
        print("=" * 60)
        print()
        print("Please fix the issues above before starting the app.")
    print()
