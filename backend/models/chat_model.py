from pydantic import BaseModel, Field
from datetime import datetime

class ChatMessage(BaseModel):
    userId: str
    role: str # "farmer" or "shopkeeper"
    message: str
    reply: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatHistoryResponse(BaseModel):
    id: str
    userId: str
    role: str
    message: str
    reply: str
    timestamp: datetime
