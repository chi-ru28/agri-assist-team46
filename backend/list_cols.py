from database import engine
from sqlalchemy import text

def check_columns():
    with engine.connect() as conn:
        print("COLUMNS_START")
        result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'"))
        for row in result:
            print(f"COL: {row[0]}")
        print("COLUMNS_END")

if __name__ == "__main__":
    check_columns()
