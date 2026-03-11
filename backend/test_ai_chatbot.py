import asyncio
import os
import sys
import traceback
from dotenv import load_dotenv

# Add the current directory to sys.path to import local modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_chatbot import get_ai_response

async def test_chatbot():
    print("Starting AI Chatbot Verification...")
    
    # Use existing user ID
    user_id = "fda7c87b-0f6d-405a-8db0-2934169be146"
    print(f"Using existing user: {user_id}")

    # 2. Test Queries
    queries = [
        "My tomato leaves have yellow spots. What should I do?",
        "How to control pest in cotton?",
        "Fertilizer for wheat?"
    ]

    for query in queries:
        print(f"\n--- Testing Query: {query} ---")
        try:
            response = await get_ai_response(user_id, query)
            print(f"AI Response Snippet: {response[:100]}...")
            if response and "Namaste" not in response and "technical issue" not in response:
                print("Test Passed")
            else:
                print("Test Failed or returned fallback message")
                print(f"Full response: {response}")
        except Exception as e:
            print(f"Error during test: {e}")
            traceback.print_exc()

if __name__ == "__main__":
    load_dotenv()
    asyncio.run(test_chatbot())
