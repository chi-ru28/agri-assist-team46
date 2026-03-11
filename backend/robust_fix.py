from sqlalchemy import create_engine, inspect, text
from database import DATABASE_URL
import sys

engine = create_engine(DATABASE_URL)

def run():
    print(f"Connecting to: {DATABASE_URL}")
    inspector = inspect(engine)
    
    if "users" not in inspector.get_table_names():
        print("❌ 'users' table not found!")
        return

    columns = [c['name'] for c in inspector.get_columns("users")]
    print(f"Current columns in 'users': {columns}")
    
    required = ["otp_code", "otp_expiry", "preferredLanguage"]
    missing = [r for r in required if r not in columns]
    
    if not missing:
        print("✅ All required columns are present!")
        return

    print(f"Missing columns: {missing}")
    with engine.connect() as conn:
        for col in missing:
            col_type = "VARCHAR" if col != "otp_expiry" else "TIMESTAMP"
            print(f"Adding {col}...")
            try:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} {col_type}"))
                conn.commit()
                print(f"✅ Added {col}")
            except Exception as e:
                print(f"❌ Failed to add {col}: {e}")
    
    # Verify again
    inspector = inspect(engine)
    columns = [c['name'] for c in inspector.get_columns("users")]
    print(f"Verified columns in 'users': {columns}")

if __name__ == "__main__":
    run()
