from database import SessionLocal, User

def get_existing_user():
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if user:
            print(f"FOUND_USER_ID:{user.id}")
        else:
            print("NO_USER_FOUND")
    except Exception as e:
        print(f"ERROR:{e}")
    finally:
        db.close()

if __name__ == "__main__":
    get_existing_user()
