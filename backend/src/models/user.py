import re
from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserRole(str, Enum):
    FARMER = "farmer"
    VETERINARIAN = "veterinarian"
    ADMIN = "admin"


def _validate_password_complexity(password: str) -> str:
    """Enforce password complexity: uppercase, lowercase, digit, special char."""
    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", password):
        raise ValueError("Password must contain at least one lowercase letter")
    if not re.search(r"\d", password):
        raise ValueError("Password must contain at least one digit")
    if not re.search(r"[^A-Za-z0-9]", password):
        raise ValueError("Password must contain at least one special character")
    return password


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    role: UserRole = UserRole.FARMER

    @field_validator("password")
    @classmethod
    def check_password_complexity(cls, v: str) -> str:
        return _validate_password_complexity(v)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    password: Optional[str] = Field(None, min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def check_password_complexity(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return _validate_password_complexity(v)
        return v


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    created_at: datetime
    updated_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: Optional[str] = None
