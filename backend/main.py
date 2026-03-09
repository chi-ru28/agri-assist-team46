from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Import modules

from ai_chatbot import get_ai_response
from models import ChatRequest
from database import SessionLocal, User, ChatHistory
from auth import get_user_optional
from routes.shopkeeper_routes import router as shopkeeper_router
from routes.admin_routes import router as admin_router
from routes.chat_routes import router as chat_router

app = FastAPI(
    title="AgriAssist Production Backend",
    description="AI Chatbot Backend for AgriAssist Platform",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for the frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    print("✅ AgriAssist backend started with PostgreSQL")

@app.on_event("shutdown")  
async def shutdown_db_client():
    print("🛑 Backend shutting down")

app.include_router(shopkeeper_router, prefix="/api/shopkeeper", tags=["Shopkeeper"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin"])
app.include_router(chat_router)

@app.post("/api/chat")
async def chat(request: ChatRequest, user_data: dict = Depends(get_user_optional)):
    try:
        # 1. Get user ID
        user_id = user_data.get("id", "guest") if user_data else "guest"

        # 2. Call AI and get response
        ai_response = await get_ai_response(user_id, request.message)

    except Exception as e:
        print(f"Error calling AI: {e}")
        return {"error": "AI service unavailable", "reply": str(e)}

    # 3. Store chat history in PostgreSQL
    db: Session = SessionLocal()
    try:
        if user_data:
            from uuid import UUID
            # Fetch or create chat history session
            # Note: For simplicity in this step, we append to a list in a single record per user
            # or creating multiple records. Let's follow the model: userId and messages (JSONB)
            uid = UUID(user_data["id"])
            history = db.query(ChatHistory).filter(ChatHistory.userId == uid).first()
            
            new_msg = {"role": "user", "content": request.message, "timestamp": datetime.utcnow().isoformat()}
            new_reply = {"role": "ai", "content": ai_response, "timestamp": datetime.utcnow().isoformat()}
            
            if history:
                messages = list(history.messages) if history.messages else []
                messages.extend([new_msg, new_reply])
                history.messages = messages
            else:
                history = ChatHistory(userId=uid, messages=[new_msg, new_reply])
                db.add(history)
            
            db.commit()
    except Exception as e:
        print(f"DB save error: {e}")
        db.rollback()
    finally:
        db.close()

    # 4. Return response
    return {"reply": ai_response}