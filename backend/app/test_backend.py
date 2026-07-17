import httpx
import sys

def test_health():
    print("Testing GET /health...")
    try:
        r = httpx.get("http://127.0.0.1:8000/health")
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}\n")
        assert r.status_code == 200
        assert r.json().get("status") == "healthy"
        print("Health check PASSED!\n")
    except Exception as e:
        print(f"Health check FAILED: {e}")
        sys.exit(1)

def test_chat():
    print("Testing POST /chat (using non-flight intent to test LLM pipeline without needing scraping)...")
    payload = {
        "message": "Draft a calendar invite for a project review meeting tomorrow at 2 PM."
    }
    try:
        r = httpx.post("http://127.0.0.1:8000/chat", json=payload, timeout=30.0)
        print(f"Status: {r.status_code}")
        print(f"Response JSON keys: {list(r.json().keys())}")
        print(f"Response details:")
        print(f"  Intent: {r.json().get('intent')}")
        print(f"  Summary: {r.json().get('summary')}")
        print(f"  Email field length: {len(r.json().get('email', ''))}")
        
        assert r.status_code == 200
        print("\nChat pipeline query PASSED!\n")
    except Exception as e:
        print(f"Chat pipeline test FAILED: {e}")
        # Note: This might fail if the user's GEMINI_API_KEY is not set or valid.
        print("Note: If this failed with API key errors, please ensure you have set GEMINI_API_KEY in backend/.env")

if __name__ == "__main__":
    test_health()
    test_chat()
