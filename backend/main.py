from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Import modules

from ai_chatbot import get_ai_response
from pydantic_schemas import ChatRequest
from database import SessionLocal, User, ChatHistory
from auth import get_user_optional
from routes.shopkeeper_routes import router as shopkeeper_router
from routes.admin_routes import router as admin_router
from routes.chat_routes import router as chat_router
from routes.auth_routes import router as auth_router

app = FastAPI(
    title="AgriAssist Production Backend",
    description="AI Chatbot Backend for AgriAssist Platform",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for the frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    print("[SUCCESS] AgriAssist backend started with PostgreSQL")

@app.on_event("shutdown")  
async def shutdown_db_client():
    print("[STOP] Backend shutting down")

from routes.vision_routes import router as vision_router

app.include_router(shopkeeper_router, prefix="/api/shopkeeper", tags=["Shopkeeper"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin"])
app.include_router(chat_router)
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(vision_router, prefix="/api/vision", tags=["Vision"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
