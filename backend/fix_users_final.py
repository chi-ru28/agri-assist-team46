import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
db_url = os.getenv("DATABASE_URL")

try:
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cur = conn.cursor()
    
    print("Executing final column renames on users table...")
    
    renames = [
        ('createdAt', 'created_at'),
        ('updatedAt', 'updated_at'),
        ('isActive', 'is_active'),
        ('preferredlanguage', 'preferred_language')
    ]
    
    for old, new in renames:
        try:
            cur.execute(f'ALTER TABLE "users" RENAME COLUMN "{old}" TO "{new}";')
            print(f"Renamed {old} to {new}")
        except Exception as e:
            print(f"Could not rename {old} (might already be renamed): {e}")

    cur.close()
    conn.close()
    print("Done fixing users schema.")
except Exception as e:
    print(f"DB Error: {e}")
