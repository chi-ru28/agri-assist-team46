import logging
import traceback
from uuid import uuid4, UUID
from database import SessionLocal, ChatHistory, engine

logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

def test_simple_db():
    print("Testing minimal database insertion for ChatHistory...")
    db = SessionLocal()
    try:
        # Use a known existing user ID
        uid_str = "fda7c87b-0f6d-405a-8db6-2934169be146"
        uid = UUID(uid_str)
        
        print(f"Using UUID: {uid}, type: {type(uid)}")
        
        # Try to create a record
        history = ChatHistory(userId=uid, messages=[{"role": "user", "content": "test_sql_log"}])
        db.add(history)
        print("Record added to session. Committing...")
        db.commit()
        print("✅ Commit successful!")
        
    except Exception as e:
        print(f"❌ Error during test: {e}")
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    test_simple_db()
