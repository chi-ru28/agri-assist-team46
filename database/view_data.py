import os
import sys

# Add backend directory to path so we can import database
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

try:
    from database import SessionLocal, engine
    from sqlalchemy import text
    import pandas as pd
    
    # We will use pandas just to easily format the output as a table in the terminal
    # If pandas isn't installed, we'll fall back to basic printing
    try:
        import pandas as pd
        HAS_PANDAS = True
    except ImportError:
        HAS_PANDAS = False

    # The main tables we care about in the new schema
    TARGET_TABLES = [
        "users", 
        "chat_history", 
        "farmers", 
        "shops", 
        "products"
    ]

    print("\n" + "="*50)
    print("🚜 AGRI-ASSIST DATABASE CONTENT EXPLORER 🚜")
    print("="*50 + "\n")

    db = SessionLocal()
    
    for table_name in TARGET_TABLES:
        print(f"\n--- 📋 Data for Table: {table_name.upper()} ---")
        
        # Query all rows from the table
        query = text(f"SELECT * FROM {table_name} LIMIT 5;") # Limiting to 5 to avoid flooding terminal
        result = db.execute(query)
        rows = result.fetchall()
        
        if not rows:
            print("  (Table is empty)")
            continue
            
        columns = result.keys()
        
        if HAS_PANDAS:
            # Format nicely with pandas
            # Convert UUIDs and JSON to strings for display
            display_rows = []
            for row in rows:
                display_row = [str(col) if col is not None else "NULL" for col in row]
                display_rows.append(display_row)
                
            df = pd.DataFrame(display_rows, columns=columns)
            
            # Truncate long strings (like passwords or json) for cleaner display
            for col in df.columns:
                df[col] = df[col].apply(lambda x: (x[:30] + '...') if isinstance(x, str) and len(x) > 30 else x)
                
            print(df.to_string(index=False))
        else:
            # Basic fallback print
            print(" | ".join(columns))
            print("-" * 50)
            for row in rows:
                print(" | ".join([str(val)[:30] + ('...' if len(str(val)) > 30 else '') for val in row]))

    print("\n" + "="*50)
    print("Note: Only showing up to 5 rows per table for readability.")
    print("Passwords and long data (like chat history) are truncated.")
    print("="*50 + "\n")

except Exception as e:
    print(f"❌ Error connecting to database: {e}")
finally:
    try:
        db.close()
    except:
        pass
