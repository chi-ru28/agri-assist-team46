from google import genai
import os
from dotenv import load_dotenv
from database import SessionLocal, ChatHistory
from uuid import UUID
import json

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)


# =========================
# Agriculture Expert Prompt
# =========================

SYSTEM_PROMPT = """
You are "AgriAssist", a professional Senior Agriculture Advisor with decades of experience in agronomy, pest management, and sustainable farming. Your goal is to provide practical, high-yield, and cost-effective advice to farmers.

Core Expertises:
1. Crop Health: Diagnose diseases from descriptions, suggest treatments (preferring organic/low-cost), and prevention.
2. Nutrient Management: Advice on fertilizers, dosage, timing, and soil health.
3. Resource Optimization: Efficient irrigation, pest control strategies (IPM), and sustainable techniques.
4. Strategic Planning: Weather-based decisions, government schemes, and market price insights.

Communication Guidelines:
- Language: Always reply in the same language as the farmer (English, Hindi, or Gujarati).
- Tone: Helpful, professional, and empathetic. Use simple, non-technical language where possible.
- Practicality: Provide actionable steps. Instead of "Nitrogen deficiency", say "Your soil needs more nitrogen; apply 25kg of Urea per acre before the next watering."
- Sustainability: Prioritize organic and affordable solutions when effective.
- Safety: If recommending chemicals, include safety precautions (masks, dosage).
- Completeness: If a crop is mentioned, briefly touch upon its current stage's specific needs (irrigation/fertilizer).

Farmer queries are often short; expand on them with relevant expert advice.
"""


# =========================
# Get AI Response Function
# =========================

async def get_ai_response(user_id: str, message: str) -> str:
    """
    Generates an AI response for a farmer's question, maintaining history in PostgreSQL.
    """
    db = SessionLocal()
    try:
        # Resolve user ID to UUID object
        if isinstance(user_id, str):
            uid = UUID(user_id)
        else:
            uid = user_id
        
        # 1. Retrieve or create chat history
        history_record = db.query(ChatHistory).filter(ChatHistory.userId == uid).first()
        
        if not history_record:
            history_record = ChatHistory(userId=uid, messages=[])
            db.add(history_record)
            messages = []
        else:
            # SQLAlchemy JSONB columns need to be reassigned to trigger updates 
            # or use an explicit list copy.
            messages = list(history_record.messages) if history_record.messages else []

        # 2. Prepare multi-turn context for Gemini
        # Standard roles for Gemini: 'user' and 'model'
        contents = []
        for msg in messages[-10:]:  # Last 10 messages for context
            contents.append({
                "role": "user" if msg["role"] == "user" else "model",
                "parts": [{"text": msg["content"]}]
            })
        
        # Add current message to the Gemini request
        contents.append({
            "role": "user",
            "parts": [{"text": message}]
        })

        # 3. Generate response from Gemini
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            config={
                "system_instruction": SYSTEM_PROMPT
            },
            contents=contents
        )

        ai_reply = response.text if response.text else "I'm sorry, I couldn't generate a helpful answer for that."

        # 4. Update and Save History to DB
        # Add current user message and AI reply to history
        messages.append({"role": "user", "content": message})
        messages.append({"role": "assistant", "content": ai_reply})
        
        history_record.messages = messages
        db.commit()
        
        return ai_reply

    except Exception as e:
        # Log the error and return a safe fallback message
        print(f"Gemini AI Error: {str(e)}")
        db.rollback()
        return "Namaste. I am currently facing a technical issue. Please try asking your farming question again in a moment."

    finally:
        db.close()
