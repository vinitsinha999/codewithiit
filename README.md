# ⚔️ Code with IIT — Gamified Python Learning Platform

> *"Learn Python through the ancient art of storytelling"*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-codewithiit.vercel.app-7c3aed?style=for-the-badge&logo=vercel)](https://codewithiit.vercel.app)
[![Made with](https://img.shields.io/badge/Made%20with-React%20%2B%20FastAPI-blue?style=for-the-badge)](https://github.com/vinitsinha999/codewithiit)

---

## 🌟 About the Project

**Code with IIT** is a full-stack gamified Python learning platform built with a fantasy storytelling narrative. Instead of dry tutorials, learners embark on an epic quest through the realm of *Codoria* — mastering Python concepts chapter by chapter, earning XP, climbing leaderboards, and earning a certificate of completion.

Built by **Vinit Kumar**, Undergraduate Student at **IIT Patna** (Cybersecurity & AI).

---

## 🎮 Features

| Feature | Description |
|---|---|
| 📖 **Storytelling Chapters** | 12 fantasy-themed chapters with narrative story, concept slides, and code examples |
| 🤖 **AI-Powered Hints** | Ask CodeWithIIT AI for hints during quizzes — Groq LLaMA 3.3 with Gemini fallback |
| ⚡ **XP & Ranking System** | Earn XP for correct answers, rank up from Curious Novice to Python Master |
| 🏆 **Leaderboard** | Compete with other learners globally |
| 🔥 **Streak System** | Daily learning streaks to build consistency |
| 📊 **Progress Dashboard** | Track chapter scores, total XP, and quest progress |
| 🎓 **Completion Certificate** | Royal/Fantasy style downloadable PNG certificate on completing all 12 chapters |
| 🔊 **8-bit Sound Effects** | Duolingo-style game sounds — correct, wrong, victory fanfare |
| 🔐 **JWT Authentication** | Secure register/login with JWT tokens |
| 📱 **Fully Responsive** | Works on mobile, tablet, and desktop |

---

## 🐍 Python Chapters

| # | Chapter | Concept |
|---|---|---|
| 1 | The Origin of Magic | What is Python? |
| 2 | The Kingdom of Varindel | Variables & Data Types |
| 3 | The Scrolls of Language | Strings |
| 4 | The Archive of Collections | Lists & Tuples |
| 5 | The Map of Many Keys | Dictionaries & Sets |
| 6 | The Whispering Forest | Conditionals |
| 7 | The Dragon's Hoard | Loops |
| 8 | The Wizard's Tower | Functions |
| 9 | The Hall of Records | File I/O |
| 10 | The Forge of Classes | OOP Basics |
| 11 | The Dynasty of Classes | Inheritance & Polymorphism |
| 12 | The Grand Archives | Advanced Python |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Smooth animations
- **Web Audio API** — 8-bit game sounds (zero external files)
- **HTML Canvas** — Certificate generation

### Backend
- **FastAPI** — High-performance async Python API
- **SQLAlchemy (Async)** — ORM with async support
- **PostgreSQL** — Production database (Neon serverless)
- **JWT** — Secure authentication
- **Groq API** — LLaMA 3.3 70B for AI hints
- **Google Gemini** — Fallback AI model

### Infrastructure
- **Vercel** — Frontend hosting
- **Render** — Backend hosting
- **Neon** — Serverless PostgreSQL
- **UptimeRobot** — Backend health monitoring

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL or Neon account

### Clone
```bash
git clone https://github.com/vinitsinha999/codewithiit.git
cd codewithiit
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
```

Create `backend/.env`:
```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
ENVIRONMENT=development
FRONTEND_URL=http://localhost:5173
```

```bash
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

---

## 📁 Project Structure

```
codewithiit/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── app/
│       ├── core/          # Config, auth, dependencies
│       ├── db/            # Database connection
│       ├── models/        # SQLAlchemy models
│       └── routes/        # API endpoints
│           ├── auth.py
│           ├── ai.py
│           ├── progress.py
│           ├── leaderboard.py
│           ├── streak.py
│           └── certificates.py
│
└── frontend/
    └── src/
        ├── api/           # Axios client
        ├── components/    # UI components
        ├── context/       # Auth context
        ├── data/          # Chapter content + questions
        ├── hooks/         # Custom React hooks
        └── pages/         # Route pages
```

---

## 🌐 Live Demo

🔗 [codewithiit.vercel.app](https://codewithiit.vercel.app)

---

## 👨‍💻 Author

**Vinit Kumar**
- 🎓 Undergraduate Student — **IIT Patna** (Cybersecurity & AI)
- 💼 [LinkedIn](https://linkedin.com/in/vinit-kumar-iitp)
- 🐙 [GitHub](https://github.com/vinitsinha999)

---

## 📄 License

MIT License — feel free to use and modify.

---

<div align="center">
  <p>Built with ❤️ at IIT Patna</p>
  <p>⚔️ <i>"Every great wizard today knows Python"</i> ⚔️</p>
</div>
