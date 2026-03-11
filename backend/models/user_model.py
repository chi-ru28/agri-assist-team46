from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from enum import Enum

class RoleEnum(str, Enum):
    farmer = "farmer"
    shopkeeper = "shopkeeper"

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: RoleEnum
    language: Optional[str] = 'en'

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    preferred_language: str
    created_at: datetime
    is_active: bool

# Used for internal representation (saving to DB)
class UserModel(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: RoleEnum
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    isActive: bool = True
