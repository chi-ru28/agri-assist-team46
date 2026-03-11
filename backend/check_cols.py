from database import engine
from sqlalchemy import text

def check_columns():
    with engine.connect() as conn:
        print("Columns in 'users' table:")
        result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'"))
        columns = [row[0] for row in result]
        print(", ".join(columns))
        
        # Check for our added columns specifically
        for col in ["isFarmer", "isShopkeeper", "isPesticideShop"]:
            if col in columns:
                print(f"✅ Found {col}")
            else:
                print(f"❌ Missing {col}")

if __name__ == "__main__":
    check_columns()
