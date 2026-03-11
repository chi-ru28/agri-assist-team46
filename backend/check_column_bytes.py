from database import engine
from sqlalchemy import text

def check_names():
    with engine.connect() as conn:
        res = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'"))
        for r in res:
            name = r[0]
            print(f"Column: '{name}', Length: {len(name)}, Bytes: {name.encode('utf-8').hex()}")

if __name__ == "__main__":
    check_names()
