"""
routes/auth.py
Authentication endpoints.

POST /api/auth/register  → create account, return JWT
POST /api/auth/login     → verify credentials, return JWT
GET  /api/auth/me        → return current user (requires JWT)

WHY return JWT on register: Better UX — user is logged in immediately
                            after creating their account.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, UserResponse, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ── REGISTER ──────────────────────────────────────────────────────

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister, db: AsyncSession = Depends(get_db)):
    """
    Create a new user account.
    Validates input, checks uniqueness, hashes password, returns JWT.
    """
    # Check email not already taken
    existing_email = await db.execute(
        select(User).where(User.email == payload.email.lower())
    )
    if existing_email.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    # Check username not already taken
    existing_username = await db.execute(
        select(User).where(User.username == payload.username)
    )
    if existing_username.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This username is already taken.",
        )

    # Create user — hash the password BEFORE storing
    new_user = User(
        username=payload.username,
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
    )
    db.add(new_user)
    await db.flush()   # flush to get the auto-generated id without full commit

    # Create JWT token for immediate login
    token = create_access_token(subject=str(new_user.id))

    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(new_user),
    )


# ── LOGIN ─────────────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    """
    Log in with email + password.
    Returns JWT on success, generic error on failure.

    SECURITY: We return the same error whether email or password is wrong.
              This prevents user enumeration attacks.
    """
    generic_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password.",
    )

    # Find user by email
    result = await db.execute(
        select(User).where(User.email == payload.email.lower())
    )
    user = result.scalar_one_or_none()

    # Verify password — use the same generic error for both cases
    if not user or not verify_password(payload.password, user.hashed_password):
        raise generic_error

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Contact support.",
        )

    token = create_access_token(subject=str(user.id))

    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


# ── ME ────────────────────────────────────────────────────────────

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns the currently logged in user.
    Frontend calls this on app load to restore session.
    """
    return UserResponse.model_validate(current_user)
