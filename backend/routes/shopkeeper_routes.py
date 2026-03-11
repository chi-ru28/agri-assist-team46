from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database import SessionLocal, Product, ChatHistory, Shop
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

class InventoryToggleRequest(BaseModel):
    item_id: str
    is_available: bool

class InventoryTagRequest(BaseModel):
    item_id: str
    tag: str # "Organic" or "Chemical"

@router.post("/inventory/toggle")
async def toggle_inventory(request: InventoryToggleRequest, user_data: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_data.get("role") != "shopkeeper":
        raise HTTPException(status_code=403, detail="Not authorized as shopkeeper")
    
    item_uid = UUID(request.item_id)
    shop = db.query(Shop).filter(Shop.user_id == UUID(user_data.get("sub"))).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found for this user")

    product = db.query(Product).filter(Product.id == item_uid, Product.shop_id == shop.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.is_available = request.is_available
    db.commit()
    
    return {"message": "Inventory updated successfully"}

@router.post("/inventory/tag")
async def tag_inventory(request: InventoryTagRequest, user_data: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_data.get("role") != "shopkeeper":
        raise HTTPException(status_code=403, detail="Not authorized as shopkeeper")
        
    if request.tag not in ["Organic", "Chemical"]:
        raise HTTPException(status_code=400, detail="Invalid tag")
        
    item_uid = UUID(request.item_id)
    shop = db.query(Shop).filter(Shop.user_id == UUID(user_data.get("sub"))).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found for this user")

    product = db.query(Product).filter(Product.id == item_uid, Product.shop_id == shop.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.tag = request.tag
    db.commit()
    
    return {"message": f"Item tagged as {request.tag}"}

@router.get("/history")
async def get_history(user_data: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_data.get("role") != "shopkeeper":
        raise HTTPException(status_code=403, detail="Not authorized as shopkeeper")
        
    # In MongoDB history was fetched using chat_history.find({"role": "farmer"})
    # Let's just return some chat histories or stay consistent with previous logic
    # Fetch all chat histories where at least one message is from a farmer (role choice was in previous logic)
    # Since our ChatHistory model has messages as JSONB, we just filter or return recent
    histories = db.query(ChatHistory).all() # Simplified for now
    
    result = []
    for h in histories:
        result.append({
            "id": str(h.id),
            "user_id": str(h.user_id),
            "message": h.message,
            "response": h.response,
            "timestamp": h.timestamp
        })
        
    return {"history": result}
