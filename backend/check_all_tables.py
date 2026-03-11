from database import engine
from sqlalchemy import text

def check_tables():
    with engine.connect() as conn:
        print("Checking all tables in all schemas...")
        res = conn.execute(text("SELECT table_schema, table_name FROM information_schema.tables ORDER BY table_schema, table_name"))
        for r in res:
            if r[1].lower() == 'users':
                print(f"FOUND: Schema='{r[0]}', Table='{r[1]}'")
        
        print("\nChecking Search Path:")
        res = conn.execute(text("SHOW search_path"))
        print(f"Search Path: {res.fetchone()[0]}")

if __name__ == "__main__":
    check_tables()
