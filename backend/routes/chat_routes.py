from fastapi import APIRouter, Header, HTTPException, Depends
from models import ChatMessage
from database import SessionLocal, ChatHistory
from auth import decode_token
from ai_chatbot import get_ai_response
from sqlalchemy.orm import Session
from uuid import UUID

router = APIRouter(prefix="/api/chat", tags=["Chat"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user_from_token(authorization: str):
    try:
        token = authorization.replace("Bearer ", "")
        return decode_token(token)
    except Exception as e:
        raise HTTPException(401, f"Invalid token: {str(e)}")

@router.post("/farmer")
async def farmer_chat(body: ChatMessage, authorization: str = Header(...)):
    user = get_user_from_token(authorization)

    try:
        reply = await get_ai_response(str(user["id"]), body.content)

        return {
            "reply": reply
        }

    except Exception as e:
        print("❌ Chat route error:", str(e))
        raise HTTPException(status_code=500, detail="AI response failed")

@router.get("/history")
async def get_history(authorization: str = Header(...), db: Session = Depends(get_db)):
    user = get_user_from_token(authorization)
    uid = UUID(user["id"])
    history = db.query(ChatHistory).filter(ChatHistory.userId == uid).first()
    if history:
        return history.messages
    return []

@router.delete("/history")
async def clear_history(authorization: str = Header(...), db: Session = Depends(get_db)):
    user = get_user_from_token(authorization)
    uid = UUID(user["id"])
    history = db.query(ChatHistory).filter(ChatHistory.userId == uid).first()
    if history:
        db.delete(history)
        db.commit()
    return {"message": "Cleared"}