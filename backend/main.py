"""
main.py
FastAPI application entry point.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.db.database import engine, Base

from app.models import user, progress

from app.routes import auth
from app.routes import lessons
from app.routes import progress as progress_router
from app.routes import ai
from app.routes import leaderboard
from app.routes import streak
from app.routes import certificates


# ─────────────────────────────────────────
# DATABASE LIFECYCLE
# ─────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("✅ Database tables created/verified")
    print(f"✅ Running in {settings.ENVIRONMENT} mode")

    yield

    await engine.dispose()
    print("👋 Database connections closed")


# ─────────────────────────────────────────
# FASTAPI APP
# ─────────────────────────────────────────

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for Code with IIT",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# ─────────────────────────────────────────
# CORS CONFIG (FIXED)
# ─────────────────────────────────────────

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",

    # production frontend
    "https://codewithiit.vercel.app",
    "https://codewithiit-git-main-vinitsinha999s-projects.vercel.app",
]

# allow env frontend if defined
if settings.FRONTEND_URL and settings.FRONTEND_URL not in origins:
    origins.append(settings.FRONTEND_URL)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,

    # important for vercel
    allow_credentials=True,

    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
    ],

    allow_headers=["*"],
)


# ─────────────────────────────────────────
# RATE LIMITING
# ─────────────────────────────────────────

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["60/minute"]
)

app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)


# ─────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────

app.include_router(auth.router)
app.include_router(lessons.router)
app.include_router(progress_router.router)
app.include_router(ai.router)
app.include_router(leaderboard.router)
app.include_router(streak.router)
app.include_router(certificates.router)


# ─────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    return {
        "app": settings.APP_NAME,
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT
    }