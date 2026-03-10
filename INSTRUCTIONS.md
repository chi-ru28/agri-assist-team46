# AgriAssist: Smart Fertilizer, Soil and Farm Tool Recommendation Platform
## Implementation & Deployment Guide

This guide provides step-by-step instructions to set up, run, and deploy the AgriAssist project.

---

### 1. Prerequisites
- **Node.js**: v18 or higher
- **PostgreSQL**: Local or Cloud instance (e.g., Supabase, Neon)
- **API Keys**:
  - `GEMINI_API_KEY`: From Google AI Studio
  - `OPENAI_API_KEY`: (Optional, for higher quality TTS)

---

### 2. Backend Setup
1. **Navigate to backend folder**:
   ```bash
   cd backend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=8000
   DB_URL=postgres://user:password@localhost:5432/agriassist
   JWT_SECRET=your_secret_key
   GEMINI_API_KEY=your_gemini_key
   OPENAI_API_KEY=your_openai_key
   ```
4. **Run Database Migrations**:
   The project uses Sequelize. Run the following to sync models:
   ```bash
   npm run sync-db
   ```
5. **Start the Server**:
   ```bash
   npm run dev
   ```

---

### 3. Frontend Setup
1. **Navigate to frontend folder**:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

---

### 4. Role-Specific Features
- **Farmer**: 
  - Login/Register as a Farmer.
  - Access Chat for soil detection, fertilizer advice, and tools.
  - **Voice Interaction**: Enabled by default. Click the Mic button to speak.
  - **Reports**: Use the "Generate Report" action in the sidebar to download your chat summary.
- **Shopkeeper**:
  - Login/Register as a Shopkeeper.
  - Manage Inventory: Toggle availability, tag as Organic/Chemical, and update stock.
  - Chat for business advisory.

---

### 5. Multi-Language Support
- The website supports **English**, **Hindi**, and **Gujarati**.
- Use the language switcher in the header to change the UI language.
- The AI will automatically respond in the language you speak or type in.

---

### 6. Deployment
#### Backend (Render/Heroku/Vercel)
1. Push your code to GitHub.
2. Connect your repository to your hosting provider.
3. Set the `Environment Variables` in the hosting dashboard.
4. Set the build command: `npm install`
5. Set the start command: `npm start`

#### Frontend (Netlify/Vercel)
1. Connect your GitHub repository.
2. Set the build command: `npm run build`
3. Set the publish directory: `dist`
4. Set the Proxy/Rewrite for `/api` to point to your deployed Backend URL.

---

*For any issues, please refer to the project documentation in the `docs` folder.*
