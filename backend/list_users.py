from database import SessionLocal, User

def list_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"Total users found: {len(users)}")
        for u in users:
            print(f"USER_ID: '{u.id}', ROLE: '{u.role}'")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    list_users()
