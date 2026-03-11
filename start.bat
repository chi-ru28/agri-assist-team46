@echo off
echo =======================================================
echo          AgriAssist Full Stack Launcher
echo =======================================================

echo.
echo [1/2] Starting FastAPI Python Backend...
start "AgriAssist - FastAPI Backend" cmd /k "cd backend && ..\venv\Scripts\python.exe main.py"

echo.
echo waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > NUL

echo.
echo [2/2] Starting React Vite Frontend...
start "AgriAssist - React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo =======================================================
echo All services launched in separate windows!
echo - FastAPI Backend is running on http://127.0.0.1:8000
echo - React Frontend is running on http://localhost:5173
echo =======================================================
echo Make sure to keep the new terminal windows open.
pause
