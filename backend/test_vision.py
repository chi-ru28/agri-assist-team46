import sys
import os
import asyncio
from fastapi import UploadFile
from sqlalchemy.orm import Session
from database import SessionLocal, User
from utils.security import create_access_token
from routes.vision_routes import analyze_crop

async def run_test():
    db = SessionLocal()
    try:
        # 1. Get or create a test user
        test_phone = "1112223333"
        user = db.query(User).filter(User.phone == test_phone).first()
        if not user:
            user = User(name="Test Farmer", phone=test_phone, role="farmer")
            db.add(user)
            db.commit()
            db.refresh(user)
            
        print(f"Test user ID: {user.id}")
            
        # 2. Create a dummy image file
        dummy_image_path = "dummy_crop.jpg"
        with open(dummy_image_path, "wb") as f:
            f.write(b"dummy image data")
            
        # 3. Create a pseudo UploadFile
        # Since analyze_crop expects a FastAPI UploadFile, we need to mock it slightly
        # Or even better, we can just use httpx or requests to hit the actual running server
        # Let's use requests against the running dev server for a more realistic test.
        db.close()
        
        token = create_access_token(data={"sub": str(user.id), "role": user.role, "phone": user.phone})
        print(f"Generated Token: {token[:20]}...")
        
        import requests
        base_url = "http://127.0.0.1:8000/api"
        headers = {"Authorization": f"Bearer {token}"}
        
        with open(dummy_image_path, 'rb') as f:
            files = {
                'image': ('dummy_crop.jpg', f, 'image/jpeg')
            }
            data = {
                'crop_name': 'Test Tomato'
            }
            
            print("\nSending request to Vision API...")
            res = requests.post(f"{base_url}/vision/analyze", headers=headers, files=files, data=data)
            
            print(f"Status Code: {res.status_code}")
            try:
                import json
                print(json.dumps(res.json(), indent=2))
            except:
                print(res.text)
            
    finally:
        if os.path.exists("dummy_crop.jpg"):
            os.remove("dummy_crop.jpg")

if __name__ == "__main__":
    asyncio.run(run_test())
