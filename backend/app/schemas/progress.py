"""
schemas/progress.py
Schemas for saving and retrieving chapter progress.
"""

from datetime import datetime
from pydantic import BaseModel


class ProgressSave(BaseModel):
    """Frontend sends this when a user completes a chapter."""
    chapter_slug: str
    score: int
    completed: bool
    attempts: int = 1


class ProgressResponse(BaseModel):
    """What the API returns for a single chapter's progress."""
    chapter_slug: str
    score: int
    completed: bool
    attempts: int
    completed_at: datetime

    model_config = {"from_attributes": True}


class ProgressSummary(BaseModel):
    """Full progress summary for the dashboard."""
    total_xp: int
    completed_chapters: list[str]   # list of slugs
    scores: dict[str, int]          # { "variables": 100, "loops": 80 }
    chapters_detail: list[ProgressResponse]
