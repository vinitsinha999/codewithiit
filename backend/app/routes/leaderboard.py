"""
routes/leaderboard.py
GET /api/leaderboard  → Top 20 users by total XP
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/leaderboard", tags=["Leaderboard"])


@router.get("")
async def get_leaderboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(text("""
        SELECT
            u.username,
            u.id,
            COALESCE(SUM(p.score), 0) AS total_xp,
            COALESCE(COUNT(CASE WHEN p.completed THEN 1 END), 0) AS chapters_done,
            COALESCE(u.streak, 0) AS streak
        FROM users u
        LEFT JOIN progress p ON p.user_id = u.id
        GROUP BY u.id, u.username, u.streak
        ORDER BY total_xp DESC
        LIMIT 20
    """))

    rows = result.fetchall()
    board = []
    for i, row in enumerate(rows):
        board.append({
            "rank":          i + 1,
            "username":      row.username,
            "is_me":         row.id == current_user.id,
            "total_xp":      int(row.total_xp),
            "chapters_done": int(row.chapters_done),
            "streak":        int(row.streak),
        })

    return {"leaderboard": board}
