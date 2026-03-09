from database import engine
from sqlalchemy import text

def fix_schema():
    print("Checking and fixing users table schema...")
    cols_to_add = [
        ("phone", "VARCHAR UNIQUE"),
        ("refreshToken", "VARCHAR"),
        ("isActive", "BOOLEAN DEFAULT TRUE")
    ]
    
    with engine.connect() as conn:
        for col_name, col_type in cols_to_add:
            try:
                # PostgreSQL specific: IF NOT EXISTS for columns needs a bit more logic in SQL 
                # or we just try and catch the exception if it already exists.
                conn.execute(text(f'ALTER TABLE users ADD COLUMN "{col_name}" {col_type}'))
                print(f"✅ Added column: {col_name}")
            except Exception as e:
                # Column might already exist, which is fine
                if "already exists" in str(e):
                    print(f"ℹ️ Column {col_name} already exists.")
                else:
                    print(f"⚠️ Error adding {col_name}: {e}")
        
        conn.commit()
    print("Schema fix complete.")

if __name__ == "__main__":
    fix_schema()
