import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from database import engine, Base
from sqlalchemy import text

print("⚠️ Dropping legacy tables to recreate clean schema...")

# We drop the specific tables that have schema mismatches. 
# They will be auto-recreated by Base.metadata.create_all() right after.
tables_to_drop = [
    "products",
    "reminders",
    "crop_reports",
    "chat_history",
    "farmers",
    "shops",
    "users",
    "admin_logs",
    "ai_usage_analytics"
]

with engine.connect() as conn:
    for table in tables_to_drop:
        try:
            conn.execute(text(f"DROP TABLE IF EXISTS {table} CASCADE"))
            print(f"🗑️ Dropped table: {table}")
        except Exception as e:
            print(f"Failed to drop {table}: {e}")
    conn.commit()

print("✨ Recreating all tables with modern SQLAlchemy schema...")
Base.metadata.create_all(bind=engine)
print("✅ Database schema is now clean and fully up to date!")
