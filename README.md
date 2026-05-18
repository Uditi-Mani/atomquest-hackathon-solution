# AtomQuest Hackathon 2026 Solution – Smart Engineering Innovation Portal

A hackathon-ready full-stack portal for engineering innovation programs. Teams can sign up, submit innovation reports, track project metrics, and review analytics from one clean dashboard.

## 🚀 Features
- Modern responsive UI with glassmorphism design (React + Tailwind)
- Landing page (problem + solution story)
- Login / signup flow
- Innovation report submission form
- Analytics dashboard with Chart.js (bar + pie)
- Admin panel for user visibility
- Flask REST API backend
- SQLite database
- Seed script with sample test data
- Production deployment starter files (`Procfile`, `.env.example`, `gunicorn`)

## 🧱 Tech Stack
- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Flask + Flask-CORS
- **Database:** SQLite
- **Charts:** Chart.js + react-chartjs-2

## 📁 Folder Structure
```
atomquest-hackathon-solution/
├─ backend/
│  ├─ app.py
│  ├─ seed_data.py
│  ├─ wsgi.py
│  └─ innovation_portal.db (generated)
├─ frontend/
│  ├─ src/
│  │  ├─ pages/
│  │  ├─ services/
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  └─ index.css
│  ├─ package.json
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ requirements.txt
├─ Procfile
└─ .env.example
```

## ⚙️ Step-by-Step Setup

### 1) Clone and enter project
```bash
git clone <your-repo-url>
cd atomquest-hackathon-solution
```

### 2) Backend setup (Flask)
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python backend/seed_data.py
python backend/app.py
```
Backend runs on: `http://localhost:5000`

### 3) Frontend setup (React)
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 4) Demo accounts
- Admin: `admin@atomquest.dev` / `admin123`
- User: `maya@atomquest.dev` / `maya1234`
- User: `leo@atomquest.dev` / `leo12345`

## 🔌 API Endpoints (REST)
- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/reports`
- `POST /api/reports`
- `GET /api/analytics/overview`
- `GET /api/admin/users`

## 🧪 Sample Test Data
Use `python backend/seed_data.py` to load users + reports with categories and statuses for charts.

## 🌍 Deployment Notes
- `Procfile` is included for platforms like Render / Railway / Heroku-style deploys.
- Set environment vars (`SECRET_KEY`) in production.
- Build frontend separately and serve via static hosting or reverse proxy.

## 👩‍💻 Hackathon Style Notes
This project intentionally keeps architecture lightweight and beginner-friendly, while still feeling real-world and demo-ready.
