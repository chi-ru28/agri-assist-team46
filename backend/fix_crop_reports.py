import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
db_url = os.getenv("DATABASE_URL")

try:
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cur = conn.cursor()
    
    print("Executing column renames on crop_reports table...")
    
    renames = [
        ('userId', 'user_id'),
        ('cropName', 'crop_name'),
        ('analysisResult', 'analysis_result'),
        ('imageUrl', 'image_url'),
        ('createdAt', 'created_at')
    ]
    
    for old, new in renames:
        try:
            cur.execute(f'ALTER TABLE "crop_reports" RENAME COLUMN "{old}" TO "{new}";')
            print(f"Renamed {old} to {new}")
        except Exception as e:
            print(f"Could not rename {old}: {e}")

    cur.close()
    conn.close()
    print("Done fixing crop_reports schema.")
except Exception as e:
    print(f"DB Error: {e}")
