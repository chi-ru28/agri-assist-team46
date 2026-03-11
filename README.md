# AgriAssist: Smart Fertilizer, Soil and Farm Tool Recommendation Platform

**AgriAssist** is an intelligent B2B agricultural platform linking Farmers directly with Shopkeepers. At its core, it features a highly advanced, multi-modal AI Conversational Chatbot (powered by Google Gemini) that acts as an expert agronomist and business advisor. 

The website is fully localized in **English, Hindi, and Gujarati**, starting from a distinct Login and Registration page that routes users by their role (Farmer or Shopkeeper).

---

## 🌟 Key Features Implemented

### 1. Multi-Modal Conversational AI (Gemini)
* **Voice-by-Default:** The chatbot listens for voice inputs and speaks answers automatically using native Web Speech TTS (Hindi/Gujarati/English).
* **Text & Image Input:** Users can type questions or upload images (e.g., diseased crops, soil samples) for instant AI analysis.
* **Rich Output Reports:** AI responses are formatted as structured markdown reports containing all asked information, step-by-step guides, lists, and embedded placeholders for educational videos/images.

### 2. Farmer-Specific Features
* **Soil & Fertilizer Diagnosis:** Takes soil status/images and detects fertilizer deficiencies. Recommends exact usage amounts.
* **Tool & Purchase Recommendations:** Suggests correct farming tools and advises where to purchase them relative to local shopkeepers.
* **Fertilizer Alternatives:** If a readymade chemical fertilizer isn't available, the AI suggests organic alternatives or DIY methods.
* **Pesticide Warnings:** Clearly categorizes chemical vs. organic pesticides, attaching strong health warnings to hazardous chemicals.
* **Live Weather Info:** Pulls live Google Weather insights (or OpenWeather API) if the farmer asks about upcoming rain for irrigation.
* **Reminders & Chat History:** Persistent chat history across sessions and the ability to set farming task reminders.

### 3. Shopkeeper-Specific Features
* **B2B Inventory Management:** A dashboard allowing shopkeepers to update stock availability.
* **Chemical vs. Organic Tagging:** Shopkeepers list items explicitly categorized into Chemical and Organic products.
* **Farmer Availability Toggle:** Shopkeepers can update inventory items with a simple "Yes/No" toggle so farmers instantly know what's in stock.
* **Sales Advisory:** AI provides business advisory on what fertilizers to stock based on the upcoming weather and local farmer crop cycles.
* **Chat History:** Persistent history for tracking B2B advice.

---

## 🛠️ Step-by-Step Implementation Guide

If you are setting this project up from scratch, follow this architecture:

### Step 1: Backend Setup (Node.js & PostgreSQL)
1. **Initialize the Server:** Setup a modern Node.js (+ Express) environment.
2. **Secure Database Connectivity:** Connect to your PostgreSQL database securely. The platform exclusively uses PostgreSQL for all data storage.
3. **Database Schema:** Use Sequelize ORM to map and generate your tables (`Users`, `Farmers`, `Shopkeepers`, `Inventory`, `Reminders`, and `ChatHistory`) directly into the PostgreSQL Database URL.
4. **Security & Authentication:** 
   * Hash user passwords using `bcrypt`.
   * Implement strong JWT (JSON Web Tokens) protection for all endpoints. 
   * Ensure the user's `role` (Farmer/Shopkeeper) and `preferredLanguage` (en/hi/gu) are saved in the database during Registration.
5. **Google Gemini Context Injection:** 
   * Integrate the Google Gemini SDK. When handling a Chat API request, check the user's role.
   * **If Farmer:** Inject a System Prompt telling Gemini to act as an Agronomist.
   * **If Shopkeeper:** Inject a System Prompt telling Gemini to act as a B2B Business Advisor.

### Step 2: Frontend Setup (React.js & Vite)
1. **Initialize App:** Create a React application using Vite and TailwindCSS for responsive formatting.
2. **Role-Based Routing:** 
   * Build `/login` and `/register`.
   * Upon successful login, extract the JWT role. Route farmers to `/farmer/dashboard` (or the ChatGPT-like UI), and shopkeepers to `/shopkeeper/dashboard` (inventory + AI advisory).
3. **Multi-Language (i18n):**
   * Install `i18next`. Create deeply translated JSON files for English, Hindi, and Gujarati.
   * Place a Language Switcher in the top navigation bar that updates the whole interface instantly.
4. **The Chat Interface:**
   * Build an interface similar to ChatGPT.
   * Code a dynamic input bar featuring a **Microphone Icon**, a **Text Area**, and an **Image Upload** attachment icon.
5. **Voice Recognition (STT & TTS):**
   * Use the native browser `window.SpeechRecognition` API for input.
   * Use `window.speechSynthesis` for output, explicitly setting the language code to `hi-IN` or `gu-IN` depending on the user's active locale.

---

## 🚀 Step-by-Step Deployment Guide

To deploy your completed "AgriAssist" project live to the internet:

### 1. Database Deployment (Neon / Supabase)
1. Go to **Neon.tech** (or Supabase/Render PostgreSQL) and launch a free PostgreSQL database.
2. Copy the Production Connection String.
3. Replace the local `DATABASE_URL` in your backend `.env` file with this string.
71. Run your Node.js application (`npm start`), and Sequelize will seamlessly sync your tables into the cloud database.

### 2. Backend Deployment (Render or AWS)
1. Commit your `backend` folder to a GitHub repository.
2. Create an account on **Render.com** and choose **New Web Service**.
3. Connect your GitHub repository and set the root directory to your backend folder.
4. Set the build command to `npm install`.
5. Set the Start Command to `npm start`.
6. **Very Important:** In the Render dashboard, add your environment variables:
   * `GEMINI_API_KEY` = `[Your Google Gemini Key]`
   * `DATABASE_URL` = `[Your Neon Postgres URL]`
   * `JWT_SECRET` = `[A secure random string]`

### 3. Frontend Deployment (Vercel or Netlify)
1. In your `frontend` code, find the configuration where the API URL is defined (usually `services/api.js` or `.env` like `VITE_API_URL`).
2. Change the API URL from `http://localhost:8000` to your new live backend URL (e.g., `https://agriassist-backend.onrender.com`).
3. Commit your `frontend` updates to GitHub.
4. Go to **Vercel.com** and click **Import Project**. Select your GitHub repository.
5. Set the Framework Preset to **Vite**.
6. Click **Deploy**. Vercel will install dependencies, run `npm run build`, and provide you with a live, shareable URL for your React app.

By following these architecture and deployment instructions, your AgriAssist platform will be robust, scalable, and instantly accessible to farmers and shopkeepers across all devices.
