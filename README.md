# MaliAI – Intelligent Receipt Processing and Financial Insights

MaliAI is a web-based platform designed to automatically scan, analyze, and classify receipts using AI.  
It provides structured financial insights, automatic expense categorization, and an integrated AI financial assistant — all through a clean mobile-first interface.

The system consists of a **frontend** (HTML + React UMD + TailwindCSS) and a **Node.js backend** (Express + OpenAI proxy) to securely handle AI interactions.

---

## Features

### Receipt Scanning and Processing
- Full-screen, step-by-step scanning flow  
- AI-powered data extraction (receipt content, date, amount, vendor, VAT, categories)  
- Smart automatic expense categorization  
- “Ready to Export” summary view  
- Mobile-friendly modal workflow  
- Smooth, reactive UI animations  

### AI Financial Assistant
- Powered by OpenAI GPT-4o-mini through backend proxy  
- Provides business insights, spending analysis, and financial suggestions  
- Responds in natural language  
- Runs entirely through backend (API keys never exposed to the frontend)

### Dark/Light Mode
- Theme toggle available across the application  
- Stored in `localStorage`  
- Automatically restored after refresh  
- Both theme variants fully supported across UI components

### User Authentication (Basic)
- Simple login and registration screens (UI level only)  
- No real password or backend auth required  
- Smooth navigation using browser history + hash routing

### Deployment Ready
- **Frontend**: Netlify (static deploy, no build step)  
- **Backend**: Render (Node.js web service)  
- Automatic environment switching  
- Localhost and production API endpoints selected dynamically

---

## Project Structure

```
AI-STRIKERS/
│
├── frontend/
│   ├── index.html          # Main application (React UMD)
│   ├── assets/             # Static images/icons
│   └── styles/             # Custom CSS if needed
│
└── backend/
    ├── server.js           # Express server + OpenAI proxy
    ├── package.json
    ├── package-lock.json
    └── .env                # Environment variables (ignored by Git)
```

---

## Tech Stack

### Frontend
- HTML + React 18 (UMD)
- TailwindCSS
- Babel Standalone (client-side JSX transform)
- Vanilla JavaScript state handling
- Mobile-first responsive design

### Backend
- Node.js
- Express.js
- OpenAI API (via proxy)
- CORS configuration

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/justshfarida/AI-STRIKERS.git
cd AI-STRIKERS
```

---

## Frontend Setup

The frontend is static and requires no build step.

### Start a simple dev server

```bash
cd frontend
npx live-server
```

or:

```bash
python3 -m http.server
```

Application will be available at:

```
http://127.0.0.1:5500/frontend/index.html
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
OPENAI_API_KEY=your_key_here
```

Start the server:

```bash
node server.js
```

Backend runs on:

```
http://localhost:3000
```

---

## Frontend ↔ Backend Configuration

The frontend automatically chooses between localhost and production:

```js
const API_BASE_URL =
  window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://maliai-backend.onrender.com";
```

No manual switching required.

---

## Deployment

### Frontend (Netlify)

- **Publish directory:** `frontend`
- No build command needed
- Continuous deployment supported

### Backend (Render)

- Root directory: `backend`
- Build command: none
- Start command:

```
node server.js
```

---

## Security

- OpenAI API key is stored only on backend  
- Never sent to the browser  
- `.env` file fully ignored by Git  
- Express proxy prevents direct access to OpenAI API  
- CORS restrictions enforced  

---

## License

MIT License.
