from sqlalchemy import create_engine, Column, String, Float, Integer, JSON, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from dotenv import load_dotenv
import os
import uuid
from datetime import datetime

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

DATABASE_URL = os.getenv("DATABASE_URL")

# For SQLAlchemy, we need to ensure the URL starts with 'postgresql://' or 'postgresql+psycopg2://'
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=True)
    refreshToken = Column(String)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    isActive = Column(Boolean, default=True)

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    userId = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    messages = Column(JSONB, default=[])

class Farmer(Base):
    __tablename__ = "farmers"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    userId = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    landSize = Column(Float, default=0.0)
    address = Column(String, default='')
    location = Column(JSONB, default={"type": "Point", "coordinates": [0, 0]})

class Shop(Base):
    __tablename__ = "shops"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    userId = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    shopName = Column(String, default='')
    address = Column(String, default='')
    location = Column(JSONB, default={"type": "Point", "coordinates": [0, 0]})

class Product(Base):
    __tablename__ = "products"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    shopId = Column(UUID(as_uuid=True), ForeignKey("shops.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    inventoryCount = Column(Integer, default=0)
    isAvailable = Column(Boolean, default=True)
    tag = Column(String) # "Organic" or "Chemical"

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Legacy collection references for backward compatibility (where possible)
users_col = None
chat_col = None
inventory_col = None
reminders_col = None
shops_col = None