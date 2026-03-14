"""
core/dependencies.py
FastAPI dependencies — reusable functions injected into routes.

WHY dependencies: Instead of repeating "get user from token" in every
                  protected route, we write it once here and inject it.

USAGE in a route:
    @router.get("/me")
    async def get_me(current_user: User = Depends(get_current_user)):
        return current_user
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.security import decode_access_token
from app.db.database import get_db
from app.models.user import User

# Extracts "Bearer <token>" from the Authorization header
bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Dependency that:
    1. Reads the JWT from Authorization header
    2. Decodes and validates it
    3. Fetches the user from DB
    4. Returns the User object

    If anything fails → 401 Unauthorized
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Decode JWT → get user_id
    user_id = decode_access_token(credentials.credentials)
    if user_id is None:
        raise credentials_exception

    # Fetch user from DB
    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()

    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated.",
        )

    return user


async def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Extra dependency — only allows admin users through."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )
    return current_user
