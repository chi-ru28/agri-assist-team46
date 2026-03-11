from fastapi import APIRouter, Header, HTTPException, Depends
from pydantic_schemas import ChatMessage, ChatRequest
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

@router.post("/", response_model=dict)
async def chat(request: ChatRequest, authorization: str = Header(None), db: Session = Depends(get_db)):
    """
    Consolidated chat endpoint that handles text and image inputs.
    """
    user_id = "guest"
    if authorization:
        try:
            user = get_user_from_token(authorization)
            user_id = str(user["id"])
        except:
            pass # Fallback to guest if token is invalid but provided
    
    try:
        reply = await get_ai_response(user_id, request.message, request.image_data)
        return {"reply": reply}
    except Exception as e:
        print(f"❌ Chat route error: {str(e)}")
        raise HTTPException(status_code=500, detail="AI response failed")

@router.post("/farmer")
async def farmer_chat(body: ChatMessage, authorization: str = Header(...)):
    # Legacy endpoint, keeping for compatibility but routing to main logic
    user = get_user_from_token(authorization)
    reply = await get_ai_response(str(user["id"]), body.content)
    return {"reply": reply}

@router.get("/history")
async def get_history(authorization: str = Header(...), db: Session = Depends(get_db)):
    user = get_user_from_token(authorization)
    uid = UUID(user["id"])
    
    # Query all history for this user
    history_entries = db.query(ChatHistory).filter(ChatHistory.user_id == uid).order_by(ChatHistory.timestamp.asc()).all()
    
    # Format into a list of messages for the frontend
    formatted_history = []
    for entry in history_entries:
        formatted_history.append({"role": "user", "content": entry.message, "timestamp": entry.timestamp.isoformat()})
        formatted_history.append({"role": "assistant", "content": entry.response, "timestamp": entry.timestamp.isoformat()})
        
    return formatted_history

@router.delete("/history")
async def clear_history(authorization: str = Header(...), db: Session = Depends(get_db)):
    user = get_user_from_token(authorization)
    uid = UUID(user["id"])
    
    # Delete all entries for this user
    db.query(ChatHistory).filter(ChatHistory.user_id == uid).delete()
    db.commit()
    
    return {"message": "All chat history cleared"}