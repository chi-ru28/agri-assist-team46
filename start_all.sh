#!/bin/bash
echo "Starting AgriAssist AI Stack..."

# 1. Start MongoDB (assuming running locally on 27017 natively or configure below)
echo "Ensuring MongoDB is ready (if not running a service)..."

# 2. Start ML API
echo "Starting ML Pipeline API on port 8000..."
cd ml/api
# Make sure uvicorn is installed on the user environment
uvicorn main:app --reload --host 127.0.0.1 --port 8000 &
cd ../..

# 3. Start Backend
echo "Starting Backend API on port 5000..."
cd backend
npm install
npm run dev &
cd ..

# 4. Start Frontend
echo "Starting Frontend UI..."
cd frontend
npm install
npm run dev &
cd ..

wait
