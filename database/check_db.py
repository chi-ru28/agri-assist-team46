import os
import sys

# Add backend directory to path so we can import database
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

try:
    from database import engine
    from sqlalchemy import inspect

    inspector = inspect(engine)
    tables = inspector.get_table_names()

    print("\n--- AgriAssist PostgreSQL Tables ---")
    if not tables:
        print("Empty database (no tables found).")
    for table in tables:
        print(f"✅ {table}")
    print("----------------------------------\n")

except Exception as e:
    print(f"❌ Error connecting to database: {e}")
    print("Ensure your .env file in the backend folder has the correct DATABASE_URL.")
