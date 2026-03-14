"""
app/routes/certificates.py
Tracks certificate generation — saves to DB when user downloads.
View all certificates in Neon SQL Editor:
  SELECT * FROM certificates ORDER BY issued_at DESC;
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from datetime import datetime

from app.core.dependencies import get_current_user
from app.db.database import AsyncSessionLocal
from app.models.user import User

router = APIRouter(prefix="/api/certificates", tags=["Certificates"])


# ── Auto-create table on first run ─────────────────────────────────

async def ensure_table():
    async with AsyncSessionLocal() as session:
        await session.execute(text("""
            CREATE TABLE IF NOT EXISTS certificates (
                id           SERIAL PRIMARY KEY,
                user_id      INTEGER NOT NULL,
                username     VARCHAR(100) NOT NULL,
                cert_id      VARCHAR(50) NOT NULL UNIQUE,
                issued_at    TIMESTAMP DEFAULT NOW(),
                downloaded   INTEGER DEFAULT 1
            )
        """))
        await session.commit()


# ── Models ─────────────────────────────────────────────────────────

class CertRequest(BaseModel):
    cert_id: str   # e.g. CWI-K8X2PM-2026


# ── Endpoints ──────────────────────────────────────────────────────

@router.post("/issue")
async def issue_certificate(
    payload: CertRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Called when user downloads certificate.
    Saves to DB if not already saved.
    If already saved, increments download count.
    """
    await ensure_table()

    async with AsyncSessionLocal() as session:

        # Check if already exists
        existing = await session.execute(
            text("SELECT id, downloaded FROM certificates WHERE cert_id = :cid"),
            {"cid": payload.cert_id}
        )
        row = existing.fetchone()

        if row:
            # Already exists — increment download count
            await session.execute(
                text("UPDATE certificates SET downloaded = downloaded + 1 WHERE cert_id = :cid"),
                {"cid": payload.cert_id}
            )
            await session.commit()
            return {
                "status": "updated",
                "cert_id": payload.cert_id,
                "message": f"Certificate downloaded {row[1] + 1} times"
            }

        else:
            # New certificate — insert
            await session.execute(
                text("""
                    INSERT INTO certificates (user_id, username, cert_id, issued_at, downloaded)
                    VALUES (:uid, :uname, :cid, :now, 1)
                """),
                {
                    "uid":   current_user.id,
                    "uname": current_user.username,
                    "cid":   payload.cert_id,
                    "now":   datetime.utcnow(),
                }
            )
            await session.commit()
            return {
                "status": "issued",
                "cert_id": payload.cert_id,
                "message": "Certificate issued successfully"
            }


@router.get("/mine")
async def my_certificate(
    current_user: User = Depends(get_current_user)
):
    """Check if current user has a certificate issued."""
    await ensure_table()

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            text("""
                SELECT cert_id, issued_at, downloaded
                FROM certificates
                WHERE user_id = :uid
                ORDER BY issued_at DESC
                LIMIT 1
            """),
            {"uid": current_user.id}
        )
        row = result.fetchone()

        if not row:
            return {"has_certificate": False}

        return {
            "has_certificate": True,
            "cert_id":    row[0],
            "issued_at":  row[1].isoformat() if row[1] else None,
            "downloaded": row[2],
        }
