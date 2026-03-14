"""
routes/progress.py
Endpoints for saving and retrieving chapter progress.

POST /api/progress        → save/update chapter completion
GET  /api/progress/me     → get full progress summary for dashboard

All routes are protected — require valid JWT.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.models.user import User
from app.models.progress import Progress
from app.schemas.progress import ProgressSave, ProgressResponse, ProgressSummary
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/api/progress", tags=["Progress"])


# ── SAVE PROGRESS ─────────────────────────────────────────────────

@router.post("/", response_model=ProgressResponse)
async def save_progress(
    payload: ProgressSave,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Save or update chapter progress for the logged-in user.
    Uses upsert logic — if record exists, update it. Otherwise create it.
    Score is only updated if the new score is higher (no cheating by replaying).
    """
    # Check if progress record already exists for this user + chapter
    result = await db.execute(
        select(Progress).where(
            Progress.user_id == current_user.id,
            Progress.chapter_slug == payload.chapter_slug,
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        # Update — only improve score, never decrease it
        existing.score    = max(existing.score, payload.score)
        existing.completed = existing.completed or payload.completed
        existing.attempts += 1
        return ProgressResponse.model_validate(existing)
    else:
        # Create new progress record
        new_progress = Progress(
            user_id      = current_user.id,
            chapter_slug = payload.chapter_slug,
            score        = payload.score,
            completed    = payload.completed,
            attempts     = payload.attempts,
        )
        db.add(new_progress)
        await db.flush()
        return ProgressResponse.model_validate(new_progress)


# ── GET MY PROGRESS ───────────────────────────────────────────────

@router.get("/me", response_model=ProgressSummary)
async def get_my_progress(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns full progress summary for the dashboard.
    This is what the frontend calls instead of reading localStorage.
    """
    result = await db.execute(
        select(Progress).where(Progress.user_id == current_user.id)
    )
    all_progress = result.scalars().all()

    completed_chapters = [p.chapter_slug for p in all_progress if p.completed]
    scores             = {p.chapter_slug: p.score for p in all_progress}
    total_xp           = sum(scores.values())

    return ProgressSummary(
        total_xp           = total_xp,
        completed_chapters = completed_chapters,
        scores             = scores,
        chapters_detail    = [ProgressResponse.model_validate(p) for p in all_progress],
    )
