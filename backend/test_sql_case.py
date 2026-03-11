from database import engine
from sqlalchemy import text

def test_sql():
    with engine.connect() as conn:
        print("Testing RAW SQL queries...")
        
        # Test 1: Case insensitive (no quotes)
        try:
            res = conn.execute(text("SELECT otp_code FROM users LIMIT 1"))
            print("✅ SELECT otp_code (no quotes) WORKED")
        except Exception as e:
            print(f"❌ SELECT otp_code (no quotes) FAILED: {e}")
            
        # Test 2: Case sensitive (with quotes)
        try:
            res = conn.execute(text('SELECT "otp_code" FROM users LIMIT 1'))
            print('✅ SELECT "otp_code" (with quotes) WORKED')
        except Exception as e:
            print(f'❌ SELECT "otp_code" (with quotes) FAILED: {e}')

        # Test 3: Check table name case
        try:
            res = conn.execute(text('SELECT * FROM "users" LIMIT 1'))
            print('✅ SELECT FROM "users" (with quotes) WORKED')
        except Exception as e:
            print(f'❌ SELECT FROM "users" (with quotes) FAILED: {e}')

if __name__ == "__main__":
    test_sql()
