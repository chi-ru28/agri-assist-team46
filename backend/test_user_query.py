from database import engine, User, SessionLocal
from sqlalchemy import text, select

def test_query():
    db = SessionLocal()
    try:
        print("Attempting to query all users and their otp_code...")
        # Use a raw SQL query first to see what's actually there
        with engine.connect() as conn:
            res = conn.execute(text("SELECT id, phone, otp_code FROM users LIMIT 5"))
            for r in res:
                print(f"User ID: {r[0]}, Phone: {r[1]}, OTP: {r[2]}")
        
        print("\nAttempting to query using SQLAlchemy model...")
        users = db.query(User).limit(5).all()
        for u in users:
            print(f"User Obj: ID={u.id}, Phone={u.phone}, OTP={u.otp_code}")
            
    except Exception as e:
        print(f"❌ Query failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_query()
