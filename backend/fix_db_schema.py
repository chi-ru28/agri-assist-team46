from database import engine
from sqlalchemy import text

def fix_schema():
    print("Checking and fixing users table schema...")
    cols_to_add = [
        ("phone", "VARCHAR UNIQUE"),
        ("refreshToken", "VARCHAR"),
        ("isActive", "BOOLEAN DEFAULT TRUE"),
        ("otp_code", "VARCHAR"),
        ("otp_expiry", "TIMESTAMP"),
        ("preferredLanguage", "VARCHAR DEFAULT 'en'")
    ]
    
    with engine.connect() as conn:
        for col_name, col_type in cols_to_add:
            try:
                # PostgreSQL specific: IF NOT EXISTS for columns
                # We try to add it and catch if already exists
                conn.execute(text(f'ALTER TABLE users ADD COLUMN {col_name} {col_type}'))
                print(f"✅ Added column: {col_name}")
            except Exception as e:
                # Column might already exist, which is fine
                error_str = str(e).lower()
                if "already exists" in error_str or "duplicate" in error_str:
                    print(f"ℹ️ Column {col_name} already exists.")
                else:
                    print(f"⚠️ Error adding {col_name}: {e}")
        
        conn.commit()
    print("Users schema fix complete.")

    print("Checking and fixing reminders table schema...")
    with engine.connect() as conn:
        try:
            conn.execute(text('ALTER TABLE reminders ADD COLUMN "description" TEXT'))
            print("✅ Added column: description to reminders")
        except Exception as e:
            if "already exists" in str(e):
                print("ℹ️ Column description already exists in reminders.")
            else:
                print(f"⚠️ Error adding description to reminders: {e}")
        conn.commit()
    print("Reminders schema fix complete.")

if __name__ == "__main__":
    fix_schema()
