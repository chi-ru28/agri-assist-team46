import requests
import json

BASE_URL = "http://localhost:8000"

def test_auth_flow():
    # 1. Register
    reg_data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123",
        "role": "farmer",
        "language": "en"
    }
    
    print("Testing Registration...")
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=reg_data)
        print(f"Register Status: {response.status_code}")
        print(f"Register Response: {response.json()}")
    except Exception as e:
        print(f"Register Error: {e}")

    # 2. Login
    login_data = {
        "email": "testuser@example.com",
        "password": "password123"
    }
    
    print("\nTesting Login...")
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Login Status: {response.status_code}")
        print(f"Login Response: {response.json()}")
    except Exception as e:
        print(f"Login Error: {e}")

if __name__ == "__main__":
    test_auth_flow()
