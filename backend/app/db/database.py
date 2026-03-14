"""
db/database.py
Sets up the async database connection.

WHY async: FastAPI is async-first. Async DB means while one request
           waits for a DB query, the server handles other requests.
           Under load, this is 10x faster than synchronous DB calls.

WHY SQLAlchemy: Industry standard ORM. Write Python classes,
                SQLAlchemy translates to SQL. Prevents SQL injection
                by default. Handles connection pooling automatically.
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


# The engine is the core connection to the database
# pool_pre_ping=True: tests connection before using it (handles Neon's auto-sleep)
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.ENVIRONMENT == "development",  # print SQL in dev, silent in prod
    pool_pre_ping=True,
    pool_size=5,          # max 5 simultaneous DB connections (Neon free tier limit)
    max_overflow=10,
)

# Session factory — creates new DB sessions per request
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,  # don't expire objects after commit (safer for async)
)


# All models inherit from this Base
class Base(DeclarativeBase):
    pass


# ── DEPENDENCY ────────────────────────────────────────────────────
# FastAPI injects this into route functions via Depends(get_db)
# Guarantees the session is always closed after the request ends

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
