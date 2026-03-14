"""
routes/streak.py
POST /api/streak/checkin  → Record daily login, update streak
GET  /api/streak/me       → Get current user streak
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import date, timedelta
from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/streak", tags=["Streak"])


@router.post("/checkin")
async def checkin(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Call this on every login/app load.
    - If last_checkin was yesterday → streak += 1
    - If last_checkin was today     → no change
    - If last_checkin was older     → streak resets to 1
    """
    today = date.today()

    result = await db.execute(
        text("SELECT streak, last_checkin FROM users WHERE id = :id"),
        {"id": current_user.id}
    )
    row = result.fetchone()
    streak       = row.streak or 0
    last_checkin = row.last_checkin

    if last_checkin == today:
        return {"streak": streak, "message": "Already checked in today"}

    if last_checkin == today - timedelta(days=1):
        streak += 1
    else:
        streak = 1

    await db.execute(
        text("UPDATE users SET streak = :streak, last_checkin = :today WHERE id = :id"),
        {"streak": streak, "today": today, "id": current_user.id}
    )
    await db.commit()

    return {"streak": streak, "message": "Checked in!"}


@router.get("/me")
async def get_streak(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        text("SELECT streak, last_checkin FROM users WHERE id = :id"),
        {"id": current_user.id}
    )
    row = result.fetchone()
    return {
        "streak":       row.streak or 0,
        "last_checkin": str(row.last_checkin) if row.last_checkin else None,
    }
