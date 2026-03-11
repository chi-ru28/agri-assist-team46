# AgriAssist: Smart Fertilizer, Soil and Farm Tool Recommendation Platform

## 🌟 Project Overview
**AgriAssist** is a comprehensive B2B platform with an advanced AI conversational agent. The platform provides hyper-personalized assistance to **Farmers** and **Shopkeepers** using **Google Gemini AI**.
It features a multi-lingual (English, Hindi, Gujarati), multi-modal (Text, Voice, Image) chatbot that acts as an intelligent agricultural and business consultant.

---

## 🏗️ Step-by-Step Implementation Guide

### Phase 1: Environment & Database Setup
1. **Database Selection**: Install **PostgreSQL** locally or use a cloud provider like Supabase or Neon.
2. **Backend Foundation**: Set up a Python environment and initialize a **FastAPI** project.
3. **Database ORM Setup (SQLAlchemy)**:
   - Create tables for `Users`, `Farmers`, `Shops`, `Products`, `ChatHistory`, and `CropReports`.
   - Implement relationships so every Chat History and Report is linked to a specific user ID.

### Phase 2: Authentication & Role Management
1. **User Registration & Login**:
   - Create a robust registration page allowing users to select their role: **Farmer** or **Shopkeeper**.
   - Enforce strong passwords (1 uppercase, 1 lowercase, 1 special char, 1 number, 8 char min).
2. **JWT Security**:
   - Upon login, generate a JWT token containing the user's `id` and `role`. 
   - Protect all backend API endpoints using a bearer token middleware.

### Phase 3: The AI Chatbot (Backend - FastAPI & Gemini)
1. **Gemini Integration**:
   - Install the `google-generativeai` SDK. Set your `GEMINI_API_KEY` in your `.env`.
   - Create a specialized `get_ai_response` function that accepts `roles`.
2. **Role-based System Prompts**:
   - **For Farmers**: Inject a system map instructing Gemini to act as an agronomist. 
     *Capabilities to encode*: Soil analysis, fertilizer usage, tool recommendations, alternative organic pesticides, and weather integration via external APIs (Google Search / OpenWeather).
   - **For Shopkeepers**: Inject a system map instructing Gemini to act as a B2B advisor. 
     *Capabilities to encode*: Analyzing inventory, advising on stock updates (chemical vs organic), and generating sales strategies.
3. **Output Formatting**:
   - Instruct the AI via the prompt to always return responses using Markdown, specifically structuring data as "Reports" when detailed analytics are requested.
   - Embed placeholder logic in your frontend if the AI recommends returning an image/video link based on context.

### Phase 4: Frontend Development (React & Vite)
1. **UI Layout**:
   - Implement a clean, responsive layout using **TailwindCSS**. Add animations for a premium feel.
2. **Multi-Language Support (i18next)**:
   - Install `react-i18next`. Extract all static text into `en.json`, `hi.json`, `gu.json`.
   - Add a language toggle in the Navbar that globally switches the app's default language. 
   - Pass the selected language to the backend so the AI responds natively.
3. **The Multi-Modal Chat Interface**:
   - **Voice (Default)**: Implement the **Web Speech API** (`SpeechRecognition` for input, `speechSynthesis` for output). Configure it to auto-listen (if desired) and automatically read the AI's response aloud.
   - **Text**: Add a standard textarea input.
   - **Image Upload**: Add an upload button that converts selected images to `Base64` and sends them alongside the text prompt to the Gemini Vision model.
4. **Role Routing**:
   - After a successful login, redirect Farmers to the Farmer Dashboard/Chat, and Shopkeepers to the Inventory Dashboard/Chat.

---

## 🚀 Step-by-Step Deployment Guide

### 1. Backend Deployment (Render or AWS EC2)
**Option A: Render (Easiest)**
1. Push your `backend` folder to a GitHub repository.
2. Go to [Render.com](https://render.com/), create a "New Web Service", and connect your repository.
3. Set the Root Directory to `backend/`.
4. Set the Start Command to: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add your Environment Variables (`DATABASE_URL`, `GEMINI_API_KEY`, etc.) in the Render dashboard.

**Option B: AWS EC2 (More Control)**
1. Launch an Ubuntu EC2 instance. Secure it by opening Ports 22 (SSH), 80 (HTTP), and 443 (HTTPS).
2. SSH into your server, install Python 3.10+, and clone your repository.
3. Set up a virtual environment and install your `requirements.txt`.
4. Run your FastAPI app using `Gunicorn` with `Uvicorn` workers for production stability. Use `Nginx` as a reverse proxy.

### 2. Database Deployment (Neon.tech or AWS RDS)
1. Go to [Neon.tech](https://neon.tech/) (Free PostgreSQL hosting).
2. Create a new project and copy the provided Connection String.
3. Paste this string into your Backend's `.env` file as `DATABASE_URL`.
4. Run your `database.py` script once to auto-create your tables in the cloud.

### 3. Frontend Deployment (Firebase Hosting or Vercel)
**Using Firebase (Recommended)**
1. Ensure your frontend `.env` is pointing to your live backend URL (e.g., `VITE_API_URL=https://your-backend-url.onrender.com`).
2. Run `npm run build` inside your frontend folder.
3. Install Firebase CLI: `npm install -g firebase-tools`.
4. Login: `firebase login`.
5. Initialize: `firebase init hosting`. Select your build folder (`dist`).
6. Deploy: `firebase deploy`.

---

## 💻 How to Run Locally for Testing

1. **Start the PostgreSQL Server** on your local machine and ensure the `DATABASE_URL` in `backend/.env` is correct.
2. **Open a Terminal**:
   ```bash
   cd backend
   # Activate virtual environment
   .venv\Scripts\Activate.ps1
   # Start the backend server
   uvicorn main:app --reload --port 8000
   ```
3. **Open a Second Terminal**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. **Access the platform** at `http://localhost:5173`.
