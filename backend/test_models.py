from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

models_to_test = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]

for model_name in models_to_test:
    print(f"Testing model: {model_name}...")
    try:
        response = client.models.generate_content(
            model=model_name,
            contents="Hello"
        )
        print(f"✅ {model_name} is WORKING!")
        print(f"Response: {response.text[:50]}...")
    except Exception as e:
        print(f"❌ {model_name} FAILED: {e}")
