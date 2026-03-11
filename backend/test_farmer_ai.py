import asyncio
from ai_chatbot import get_ai_response

async def test_farmer_persona():
    user_id = "f5e6ad59-fe4b-4fdf-9942-1e99152b4aca" # Truncated to 36 if needed, but I'll use the ID from DB
    # Let me re-fetch the exact ID to be sure
    from database import SessionLocal, User
    db = SessionLocal()
    farmer = db.query(User).filter(User.role == 'farmer').first()
    if not farmer:
        print("No farmer found in DB")
        return
    
    uid = str(farmer.id)
    print(f"Testing with Farmer ID: {uid}")
    
    question = "My wheat leaves are turning yellow. What should I do?"
    print(f"Question: {question}")
    
    response = await get_ai_response(uid, question)
    
    print("\n--- AI RESPONSE ---")
    print(response)
    print("-------------------\n")
    
    # Validation checks
    if "🌾 AgriAssist Crop Health Report" in response:
        print("✅ Report header found.")
    else:
        print("❌ Report header NOT found.")
        
    if "Crop:" in response and "Problem Detected:" in response:
         print("✅ Report structure looks correct.")
    else:
         print("❌ Report structure missing fields.")

    if "?" in response:
         print("✅ AI asked follow-up questions.")
    else:
         print("❌ No follow-up questions detected.")

if __name__ == "__main__":
    asyncio.run(test_farmer_persona())
