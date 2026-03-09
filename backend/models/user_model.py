from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class RoleEnum(str, Enum):
    farmer = "farmer"
    shopkeeper = "shopkeeper"

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=5, max_length=50)
    email: Optional[EmailStr] = None
    password: str = Field(..., min_length=6)
    role: RoleEnum

class UserLogin(BaseModel):
    phone: str = Field(..., max_length=50)
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str]
    role: str
    createdAt: datetime
    isActive: bool

# Used for internal representation (saving to DB)
class UserModel(BaseModel):
    name: str
    phone: str = Field(..., max_length=50)
    email: Optional[EmailStr] = None
    password: str
    role: RoleEnum
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    isActive: bool = True
