from sqlalchemy import create_engine, text
from database import DATABASE_URL

engine = create_engine(DATABASE_URL)

def migrate():
    # Mapping of Old CamelCase to New snake_case
    # Only for columns that actually need renaming in PostgreSQL
    # PostgreSQL stores unquoted names as lowercase by default, 
    # but we might have created some with quotes or they might be missing.
    
    renames = {
        "users": [
            ("preferredLanguage", "preferred_language"),
            ("createdAt", "created_at"),
            ("updatedAt", "updated_at"),
            ("isActive", "is_active")
        ],
        "chat_history": [
            ("userId", "user_id")
        ],
        "farmers": [
            ("userId", "user_id"),
            ("landSize", "land_size")
        ],
        "shops": [
            ("userId", "user_id"),
            ("shopName", "shop_name")
        ],
        "products": [
            ("shopId", "shop_id"),
            ("inventoryCount", "inventory_count"),
            ("isAvailable", "is_available")
        ],
        "crop_reports": [
            ("userId", "user_id"),
            ("cropName", "crop_name"),
            ("analysisResult", "analysis_result"),
            ("imageUrl", "image_url"),
            ("createdAt", "created_at")
        ],
        "reminders": [
            ("userId", "user_id"),
            ("remindAt", "remind_at"),
            ("isCompleted", "is_completed"),
            ("createdAt", "created_at")
        ],
        "admin_logs": [
            ("adminId", "admin_id"),
            ("targetId", "target_id"),
            ("createdAt", "created_at")
        ],
        "ai_usage_analytics": [
            ("userId", "user_id"),
            ("requestType", "request_type"),
            ("tokenCount", "token_count"),
            ("createdAt", "created_at")
        ]
    }

    with engine.connect() as conn:
        for table, cols in renames.items():
            print(f"Checking table: {table}...")
            for old_col, new_col in cols:
                try:
                    # Try to rename if the old one exists
                    # We use lowercase old_col because PG often lowercases them unless quoted 
                    # but if they were created as CamelCase via SQLAlchemy 1.x or similar they might need quotes.
                    
                    # First try unquoted
                    try:
                        conn.execute(text(f'ALTER TABLE {table} RENAME COLUMN {old_col} TO {new_col}'))
                        print(f"  ✅ Renamed {old_col} -> {new_col} (unquoted)")
                    except Exception:
                        # Try quoted
                        conn.execute(text(f'ALTER TABLE {table} RENAME COLUMN "{old_col}" TO {new_col}'))
                        print(f"  ✅ Renamed {old_col} -> {new_col} (quoted)")
                        
                except Exception as e:
                    # Column might not exist or already renamed
                    if "does not exist" in str(e).lower() or "already exists" in str(e).lower():
                         pass
                    else:
                        print(f"  ⚠️ Error renaming {old_col} in {table}: {e}")
        
        conn.commit()
    print("\nMigration Complete!")

if __name__ == "__main__":
    migrate()
