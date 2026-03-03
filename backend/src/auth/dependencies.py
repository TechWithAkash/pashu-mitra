from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from src.auth.service import decode_token, get_user_by_id, is_token_blacklisted
from src.models.user import UserRole

security_scheme = HTTPBearer(auto_error=True)
optional_security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
) -> dict:
    """
    Mandatory auth dependency. Extracts Bearer token, validates it,
    checks blacklist, and returns the user document from MongoDB.
    """
    try:
        payload = decode_token(credentials.credentials)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type. Use an access token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if await is_token_blacklisted(credentials.credentials):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await get_user_by_id(payload["sub"])
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(
        optional_security_scheme
    ),
) -> Optional[dict]:
    """
    Optional auth dependency for public endpoints that optionally
    capture user identity (e.g. /predict for history tracking).
    Returns user dict or None.
    """
    if credentials is None:
        return None
    try:
        payload = decode_token(credentials.credentials)
        if payload.get("type") != "access":
            return None
        if await is_token_blacklisted(credentials.credentials):
            return None
        return await get_user_by_id(payload["sub"])
    except Exception:
        return None


def require_role(*allowed_roles: UserRole):
    """
    Factory returning a dependency that checks the user's role.

    Usage:
        @app.post("/train", dependencies=[Depends(require_role(UserRole.ADMIN))])
    """

    async def role_checker(
        current_user: dict = Depends(get_current_user),
    ) -> dict:
        user_role = current_user.get("role")
        if user_role not in [r.value for r in allowed_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Insufficient permissions. "
                    f"Required: {', '.join(r.value for r in allowed_roles)}"
                ),
            )
        return current_user

    return role_checker
