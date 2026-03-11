#!/bin/bash
echo "Starting AgriAssist AI Stack..."

# 1. Start Backend
echo "Starting Backend API on port 8000..."
cd backend
source ../venv/Scripts/activate 2>/dev/null || source ../venv/bin/activate 2>/dev/null
uvicorn main:app --reload --host 127.0.0.1 --port 8000 &
cd ..

sleep 3

# 2. Start Frontend
echo "Starting Frontend UI..."
cd frontend
npm install
npm run dev &
cd ..

wait
