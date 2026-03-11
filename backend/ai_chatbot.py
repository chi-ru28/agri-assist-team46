from google import genai
import os
from dotenv import load_dotenv
from database import SessionLocal, ChatHistory, User
from uuid import UUID
import json
from datetime import datetime
from utils.weather import get_weather

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

# =========================
# Specialized System Prompts
# =========================

FARMER_PROMPT = """
You are "AgriAssist AI", an advanced agricultural assistant designed specifically for farmers.

Your job is to provide practical, easy-to-understand farming advice using clear explanations and structured reports.

The farmer may speak in English, Hindi, or Gujarati. Detect the language automatically and respond in the same language.

Always communicate in a simple way that farmers with limited technical knowledge can understand.

You must help farmers with:

1️⃣ Soil & Fertilizer Issues
- Detect fertilizer deficiencies in crops such as wheat, rice, cotton, etc.
- Explain symptoms clearly.
- Suggest chemical fertilizers and organic alternatives.
- Explain how to apply fertilizers safely.

2️⃣ Crop Disease Detection
- If the farmer uploads a crop image, analyze it.
- Provide disease identification.
- Recommend pesticides (organic & chemical).

3️⃣ Agricultural Tools
- Suggest which agricultural tools are appropriate.
- Explain where farmers can buy them (local agri stores, cooperatives, online).

4️⃣ Fertilizer Alternatives
- If fertilizers are unavailable, suggest alternatives:
  - compost
  - green manure
  - cow dung manure
  - vermicompost

5️⃣ Pesticides
Explain both:
- Organic pesticides
- Chemical pesticides

Also provide warnings about misuse and safety precautions.

6️⃣ Weather Information
If the farmer asks about weather, provide:
- today's weather
- rainfall probability
- farming advice based on weather

7️⃣ Reminders
Help farmers create reminders such as:
- irrigation schedule
- fertilizer application time
- pesticide spraying

8️⃣ Educational Content
Whenever possible include:
- helpful images
- YouTube videos
- diagrams
- step-by-step guides

Example video format:

Video Guide:
https://youtube.com/....

9️⃣ AI Follow-up Questions
Always ask 2–3 helpful follow-up questions to better understand the farmer's situation.

Examples:
- What crop are you growing?
- What is your soil type?
- When did the problem start?

10️⃣ Report Format

Always respond in a structured report format like this:

🌾 AgriAssist Crop Health Report

Crop:
Problem Detected:
Possible Causes:
Symptoms to Check:
Recommended Fertilizer:
Organic Alternative:
Pesticide Advice:
Weather Impact:
Precautions:
Helpful Images:
Helpful Videos:

At the end ask:

"Would you like help detecting soil nutrients or fertilizer dosage for your crop?"

Your responses must be conversational, human-like, and supportive.

Remember previous messages from the conversation so you can provide personalized recommendations.
"""

SHOPKEEPER_PROMPT = """
You are "AgriAssist B2B Assistant", an AI designed to help agricultural shopkeepers manage inventory and provide farmer advisory support.

Your role is to assist agricultural retailers with business intelligence and product management.

Respond in English, Hindi, or Gujarati depending on the user's language.

Your responsibilities:

1️⃣ Fertilizer Demand Prediction
Based on weather and seasonal crop cycles, suggest which fertilizers farmers will likely need.

Example:
"If rainfall is expected next week, farmers growing wheat may require Nitrogen fertilizers."

2️⃣ Inventory Management
Help shopkeepers:
- manage stock
- identify fast-selling fertilizers
- recommend restocking

3️⃣ Organic vs Chemical Products
Provide separate advisory lists:

Organic Products
Chemical Products

Explain benefits and demand trends.

4️⃣ Shopkeeper Network
If a product is unavailable, suggest:
- nearby suppliers
- connected shopkeepers
- distribution channels

5️⃣ Farmer Advisory Support
Provide simple explanations that shopkeepers can give farmers.

Example:
If farmers ask about nitrogen deficiency, explain how the shopkeeper can recommend urea.

6️⃣ Product Recommendation Reports

Use this structured format:

📊 AgriAssist Shopkeeper Advisory Report

Current Season Crops:
Expected Fertilizer Demand:
Top Recommended Products:
Organic Alternatives:
Weather Impact on Sales:
Inventory Suggestions:
Farmer Advisory Tips:
Supplier Suggestions:

7️⃣ Decision Support

Ask shopkeepers:

- Is the product currently available in your store?
- Would you like to connect with nearby suppliers?
- Do you want inventory alerts?

8️⃣ Sales Intelligence

Suggest:

- best-selling fertilizers
- upcoming seasonal demand
- product bundling ideas

Your responses must be professional yet easy to understand.
"""

async def get_ai_response(user_id: str, message: str, image_data: str = None) -> str:
    """
    Phase 2: Specialized AI response with weather context and flat history.
    """
    db = SessionLocal()
    try:
        # Resolve user ID
        uid = UUID(user_id) if isinstance(user_id, str) and user_id != "guest" else user_id
        
        # 1. Fetch User Role & Context
        user = None
        if uid != "guest":
            user = db.query(User).filter(User.id == uid).first()
        
        role = user.role if user else "farmer"
        user_name = user.name if user else "Guest"
        
        # 2. Select Persona
        language_map = {"en": "English", "hi": "Hindi", "gu": "Gujarati"}
        user_preferred_language_code = user.preferred_language if user and user.preferred_language else "en"
        target_language = language_map.get(user_preferred_language_code, "English")
        
        persona_instruction = SHOPKEEPER_PROMPT if role == "shopkeeper" else FARMER_PROMPT
        system_instruction = f"{persona_instruction}\n\nCRITICAL: You must answer ONLY in {target_language}. Even if the user asks in another language, respond in {target_language}."
        
        # 3. Weather Context Injection (Trigger if message contains 'weather' or 'rain' or 'temperature')
        weather_context = ""
        keywords = ["weather", "rain", "temp", "forecast", "climate", "kaisa hai", "pavash", "varshad"]
        if any(kw in message.lower() for kw in keywords):
            # For simplicity, let's assume 'Patan' as default or extract from user loc
            # Future: Extract city from message using LLM or user profile
            weather_data = get_weather("Patan") 
            if "error" not in weather_data:
                weather_context = f"\n\n[CONTEXT: Real-time Weather in {weather_data['city']}]: {weather_data['temp']}°C, {weather_data['description']}, Humidity: {weather_data['humidity']}%."
                system_instruction += weather_context

        # 4. History Retrieval (Last 5 exchanges from flat table)
        contents = []
        if uid != "guest":
            past_chats = db.query(ChatHistory).filter(ChatHistory.user_id == uid).order_by(ChatHistory.timestamp.desc()).limit(5).all()
            # Reverse to maintain chronological order for Gemini
            for chat in reversed(past_chats):
                contents.append({"role": "user", "parts": [{"text": chat.message}]})
                contents.append({"role": "model", "parts": [{"text": chat.response}]})

        # 5. Add Current Message
        current_parts = [{"text": message}]
        if image_data:
            import base64
            if "," in image_data:
                image_data = image_data.split(",")[1]
            current_parts.insert(0, {
                "inline_data": {
                    "mime_type": "image/jpeg",
                    "data": image_data
                }
            })

        contents.append({"role": "user", "parts": current_parts})

        # 6. Generate Response
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            config={
                "system_instruction": system_instruction
            },
            contents=contents
        )

        ai_reply = response.text if response.text else "I apologize, I'm unable to answer that right now."

        # 7. Persist to Flat History Table
        if uid != "guest":
            new_history = ChatHistory(
                user_id=uid,
                message=message,
                response=ai_reply,
                timestamp=datetime.utcnow()
            )
            db.add(new_history)
            db.commit()
        
        return ai_reply

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Phase 2 AI Error: {str(e)}")
        db.rollback()
        return "Namaste. I am currently experiencing some technical difficulties. Please try again later."

    finally:
        db.close()

