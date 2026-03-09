from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/agriassist")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    db_instance.client = AsyncIOMotorClient(MONGO_URI)
    db_instance.db = db_instance.client.get_default_database()
    # Defaulting to agriassist if URI doesn't contain a db name
    if db_instance.db.name == 'admin':
        db_instance.db = db_instance.client['agriassist']
    
    # Create indexes
    await db_instance.db.users.create_index("phone", unique=True)
    await db_instance.db.chat_history.create_index([("userId", 1), ("timestamp", -1)])
    
    print("Connected to MongoDB via Motor.")

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        print("Closed MongoDB connection.")

def get_database():
    return db_instance.db
