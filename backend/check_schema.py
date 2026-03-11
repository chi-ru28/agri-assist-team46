from database import engine
from sqlalchemy import text

def check_schema():
    with engine.connect() as conn:
        print("Checking schema for table 'users'...")
        result = conn.execute(text("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'users'"))
        columns = result.fetchall()
        for col in columns:
            print(f"Column: {col[0]}, Type: {col[1]}, Nullable: {col[2]}")

if __name__ == "__main__":
    check_schema()
