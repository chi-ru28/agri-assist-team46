from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChatRequest(BaseModel):
    message: str
    image_data: Optional[str] = None # Base64 encoded image
    location: Optional[str] = "Ranuj"

class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: Optional[str] = None

class ChatHistoryModel(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = "farmer"
    message: str
    timestamp: datetime = datetime.utcnow()
