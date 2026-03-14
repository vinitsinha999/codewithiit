"""
schemas/user.py
Pydantic schemas — define what data comes IN and goes OUT of the API.

WHY schemas separate from models:
  - models  = database shape  (what's stored)
  - schemas = API shape       (what's sent/received)
  - You NEVER want to accidentally return hashed_password in an API response
  - Pydantic validates and sanitises all input automatically

FLOW:
  Request JSON → Pydantic schema validates → Route handler → DB model → Response schema
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator
import re


# ── REGISTER ──────────────────────────────────────────────────────

class UserRegister(BaseModel):
    """What the frontend sends when creating an account."""
    username: str
    email: EmailStr          # Pydantic validates email format automatically
    password: str

    @field_validator("username")
    @classmethod
    def username_valid(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3:
            raise ValueError("Username must be at least 3 characters")
        if len(v) > 50:
            raise ValueError("Username must be under 50 characters")
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError("Username can only contain letters, numbers, underscores")
        return v

    @field_validator("password")
    @classmethod
    def password_strong(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


# ── LOGIN ─────────────────────────────────────────────────────────

class UserLogin(BaseModel):
    """What the frontend sends when logging in."""
    email: EmailStr
    password: str


# ── RESPONSE ──────────────────────────────────────────────────────

class UserResponse(BaseModel):
    """What the API returns about a user — NO password, NO internal fields."""
    id: int
    username: str
    email: str
    is_active: bool
    is_admin: bool
    created_at: datetime

    model_config = {"from_attributes": True}  # allows creating from SQLAlchemy model


# ── TOKEN ─────────────────────────────────────────────────────────

class TokenResponse(BaseModel):
    """Returned after successful login/register."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    """Decoded JWT payload."""
    user_id: Optional[str] = None
