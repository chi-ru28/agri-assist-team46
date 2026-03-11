from database import engine, User, DATABASE_URL
from sqlalchemy import text, inspect

def diagnose():
    print(f"DATABASE_URL: {DATABASE_URL}")
    print(f"Engine URL: {engine.url}")
    
    inspector = inspect(engine)
    schemas = inspector.get_schema_names()
    print(f"Schemas: {schemas}")
    
    for schema in schemas:
        tables = inspector.get_table_names(schema=schema)
        if "users" in tables:
            print(f"\nTable 'users' found in schema '{schema}':")
            cols = inspector.get_columns("users", schema=schema)
            for c in cols:
                print(f" - {c['name']} ({c['type']})")

if __name__ == "__main__":
    diagnose()
