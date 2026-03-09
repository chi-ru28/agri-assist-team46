from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database import SessionLocal, Shop
from auth import get_current_user
from sqlalchemy.orm import Session
from uuid import UUID

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ShopUpdateRequest(BaseModel):
    location: str
    name: str

@router.put("/shops/{shop_id}")
async def update_shop(shop_id: str, request: ShopUpdateRequest, user_data: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_data.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    shop_uid = UUID(shop_id)
    shop = db.query(Shop).filter(Shop.id == shop_uid).first()
    if not shop:
        # Create new shop if not exists (upsert logic from Mongo)
        # Note: Upsert logic usually needs a userId references. 
        # For simplicity, if it doesn't exist, we might need a userId.
        # Let's assume for now we only update existing or require userId.
        # But to be safe, if we want to mimic Mongo upsert exactly, we need more info.
        # Let's just update if exists.
        raise HTTPException(status_code=404, detail="Shop not found")

    shop.address = request.location
    shop.shopName = request.name
    db.commit()
    
    return {"message": "Shop updated successfully"}

@router.delete("/shops/{shop_id}")
async def delete_shop(shop_id: str, user_data: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_data.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    shop_uid = UUID(shop_id)
    shop = db.query(Shop).filter(Shop.id == shop_uid).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
        
    db.delete(shop)
    db.commit()
    
    return {"message": "Shop deleted successfully"}
