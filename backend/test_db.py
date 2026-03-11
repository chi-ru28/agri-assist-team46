from database import engine, User
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select

Session = sessionmaker(bind=engine)
session = Session()

try:
    # Try to query a user and check columns
    print("Querying database...")
    res = session.execute(select(User).limit(1)).first()
    print("Columns in User model match database schema!")
    
    # Try to insert a dummy user with new columns
    import uuid
    from datetime import datetime
    
    uid = uuid.uuid4()
    test_user = User(
        id=uid,
        name="Test User",
        phone=str(uid),
        role="farmer",
        otp_code="1234",
        otp_expiry=datetime.utcnow(),
        preferredLanguage="en"
    )
    session.add(test_user)
    session.commit()
    print(f"✅ Successfully inserted test user {uid} with OTP columns!")
    
    session.delete(test_user)
    session.commit()
    print("✅ Successfully deleted test user!")
    print("ALL DATABASE COLUMNS VERIFIED!")
except Exception as e:
    print(f"Database verification failed: {e}")
finally:
    session.close()
