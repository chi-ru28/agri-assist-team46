from database import engine
from sqlalchemy import text

def check_schema():
    with engine.connect() as conn:
        print("Checking schema for table 'users'...")
        result = conn.execute(text("SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'users'"))
        for row in result:
            print(f"COL: {row[0]}, Nullable: {row[1]}")

if __name__ == "__main__":
    check_schema()
