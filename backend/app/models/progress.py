"""
models/progress.py
Tracks which chapters each user has completed and their score.

WHY separate table: One user can complete many chapters.
                    This is a classic one-to-many relationship.
                    users (1) ──── (many) progress
"""

from datetime import datetime
from sqlalchemy import Integer, String, Boolean, DateTime, ForeignKey, func, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base


class Progress(Base):
    __tablename__ = "progress"

    # Composite uniqueness — one record per user per chapter
    __table_args__ = (
        UniqueConstraint("user_id", "chapter_slug", name="uq_user_chapter"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Foreign key — links to users.id
    # ondelete CASCADE: if user is deleted, their progress is also deleted
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # Chapter identifier — e.g. "variables", "loops"
    chapter_slug: Mapped[str] = mapped_column(String(50), nullable=False)

    # XP earned on this chapter
    score: Mapped[int] = mapped_column(Integer, default=0)

    # Did they get it right on first try?
    completed: Mapped[bool] = mapped_column(Boolean, default=False)

    # How many attempts did they make?
    attempts: Mapped[int] = mapped_column(Integer, default=1)

    # When did they complete it?
    completed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationship — lets us do progress.user to get the User object
    user = relationship("User", backref="progress")

    def __repr__(self) -> str:
        return f"<Progress user={self.user_id} chapter={self.chapter_slug} score={self.score}>"
