import psycopg2
import os
from dotenv import load_dotenv
import uuid
import json

load_dotenv()
db_url = os.getenv("DATABASE_URL")
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

def test_psycopg2():
    print("Testing direct psycopg2 insertion...")
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # We need an existing user ID
        user_id = "fda7c87b-0f6d-405a-8db6-2934169be146"
        history_id = str(uuid.uuid4())
        messages = json.dumps([{"role": "user", "content": "psycopg2_test"}])
        
        print(f"Inserting: id={history_id}, userId={user_id}, messages={messages}")
        
        # Use explicit column names and double quotes for case-sensitive names
        cur.execute(
            'INSERT INTO chat_history (id, "userId", messages) VALUES (%s, %s, %s)',
            (history_id, user_id, messages)
        )
        
        conn.commit()
        print("✅ psycopg2 INSERT successful!")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ psycopg2 Error: {e}")

if __name__ == "__main__":
    test_psycopg2()
