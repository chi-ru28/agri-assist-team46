from sqlalchemy import create_engine, text
from database import DATABASE_URL

engine = create_engine(DATABASE_URL)

def check():
    with engine.connect() as conn:
        print("Checking tables...")
        res = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        tables = [r[0] for r in res]
        print(f"Tables: {tables}")
        
        if "users" in tables:
            print("\nColumns in 'users' table (raw from information_schema):")
            res = conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'"))
            for r in res:
                print(f" - {r[0]} ({r[1]})")
        else:
            print("❌ 'users' table not found in public schema!")

if __name__ == "__main__":
    check()
