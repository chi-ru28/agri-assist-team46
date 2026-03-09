@echo off
echo =======================================================
echo          AgriAssist Full Stack Launcher
echo =======================================================

echo.
echo [1/3] Starting Local MongoDB Memory Server...
start "AgriAssist - MongoDB" cmd /k "cd backend && node start_db.js"

echo.
echo Waiting 3 seconds for database to initialize...
timeout /t 3 /nobreak > NUL

echo.
echo [2/3] Starting FastAPI Python Backend...
start "AgriAssist - FastAPI Backend" cmd /k "cd backend && ..\venv\Scripts\python.exe main.py"

echo.
echo [3/3] Starting React Vite Frontend...
start "AgriAssist - React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo =======================================================
echo All services launched in separate windows!
echo - FastAPI Backend is running on http://127.0.0.1:8000
echo - React Frontend is running on http://localhost:5173
echo =======================================================
echo Make sure to keep the new terminal windows open.
pause
