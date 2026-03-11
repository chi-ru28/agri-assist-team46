from database import SessionLocal, User, Base, engine
from utils.security import get_password_hash
import uuid

def create_demo_user():
    db = SessionLocal()
    try:
        # Check if demo user exists
        exists = db.query(User).filter(User.email == "demo@farmer.com").first()
        if exists:
            print(f"Demo user already exists with ID: {exists.id}")
            return
            
        hashed_pw = get_password_hash("password123")
        from datetime import datetime
        new_user = User(
            id=uuid.uuid4(),
            name="Demo Farmer",
            email="demo@farmer.com",
            password=hashed_pw,
            role="farmer",
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(new_user)
        db.commit()
        print(f"Demo user created! Email: demo@farmer.com, Password: password123")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_user()
