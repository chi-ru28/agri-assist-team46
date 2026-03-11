import asyncio
import io
from fastapi import UploadFile
from sqlalchemy.orm import Session
from database import SessionLocal, User
from routes.vision_routes import analyze_crop

async def debug_analyze():
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if not user:
            print("No users found in database.")
            return

        print(f"Testing with User ID: {user.id}")

        # Create dummy image
        dummy_content = b"dummy image data"
        file_obj = io.BytesIO(dummy_content)
        
        # Mock UploadFile setup as FastAPI would inject
        upload_file = UploadFile(filename="dummy.jpg", file=file_obj)
        upload_file.content_type = "image/jpeg"

        current_user = {"sub": str(user.id)}

        print("Calling analyze_crop directly...")
        res = await analyze_crop(image=upload_file, crop_name="Wheat", db=db, current_user=current_user)
        print("Success:")
        print(res)

    except Exception as e:
        import traceback
        print("\n--- CAUGHT EXCEPTION ---")
        traceback.print_exc()
        print("------------------------")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(debug_analyze())
