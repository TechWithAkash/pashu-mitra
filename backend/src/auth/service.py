from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import uuid4

import bcrypt
from bson import ObjectId
from jose import jwt

from src.config import settings
from src.database import get_database
from src.logger import logger
from src.models.user import UserCreate


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


def create_access_token(user_id: str, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {
        "sub": user_id,
        "role": role,
        "type": "access",
        "jti": uuid4().hex,
        "exp": expire,
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(user_id: str, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    payload = {
        "sub": user_id,
        "role": role,
        "type": "refresh",
        "jti": uuid4().hex,
        "exp": expire,
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and validate JWT. Raises on failure."""
    return jwt.decode(
        token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
    )


# ---------------------------------------------------------------------------
# Token Blacklist
# ---------------------------------------------------------------------------

async def blacklist_token(token: str):
    """Add a token to the blacklist collection (auto-expires via TTL index)."""
    try:
        payload = decode_token(token)
        jti = payload.get("jti")
        exp = payload.get("exp")
        if jti and exp:
            db = get_database()
            await db.blacklisted_tokens.insert_one({
                "jti": jti,
                "exp": datetime.fromtimestamp(exp, tz=timezone.utc),
            })
    except Exception as e:
        logger.warning(f"Failed to blacklist token: {e}")


async def is_token_blacklisted(token: str) -> bool:
    """Check if a token's JTI is in the blacklist."""
    try:
        payload = decode_token(token)
        jti = payload.get("jti")
        if not jti:
            return False
        db = get_database()
        entry = await db.blacklisted_tokens.find_one({"jti": jti})
        return entry is not None
    except Exception:
        return False


# ---------------------------------------------------------------------------
# User CRUD
# ---------------------------------------------------------------------------

async def create_user(user_data: UserCreate) -> dict:
    """Register a new user. Returns the created MongoDB document."""
    db = get_database()

    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise ValueError("A user with this email already exists")

    now = datetime.now(timezone.utc)
    user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "role": user_data.role.value,
        "created_at": now,
        "updated_at": now,
    }

    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    logger.info(f"User registered: {user_data.email} (role: {user_data.role.value})")
    return user_doc


async def authenticate_user(email: str, password: str) -> Optional[dict]:
    """Verify credentials. Returns user document or None."""
    db = get_database()
    user = await db.users.find_one({"email": email})
    if user is None:
        return None
    if not verify_password(password, user["password_hash"]):
        return None
    return user


async def get_user_by_id(user_id: str) -> Optional[dict]:
    """Fetch user by ObjectId string."""
    db = get_database()
    try:
        return await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return None


async def update_user(user_id: str, update_data: dict) -> Optional[dict]:
    """Update user fields. Returns updated user document or None."""
    db = get_database()
    try:
        update_data["updated_at"] = datetime.now(timezone.utc)
        result = await db.users.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {"$set": update_data},
            return_document=True,
        )
        return result
    except Exception:
        return None


async def delete_user(user_id: str):
    """Delete user and their prediction history."""
    db = get_database()
    await db.users.delete_one({"_id": ObjectId(user_id)})
    await db.predictions.delete_many({"user_id": user_id})
    logger.info(f"User deleted: {user_id}")
