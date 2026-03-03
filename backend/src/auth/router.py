from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from src.auth.dependencies import get_current_user
from src.auth.service import (
    authenticate_user,
    blacklist_token,
    create_access_token,
    create_refresh_token,
    create_user,
    decode_token,
    delete_user,
    hash_password,
    is_token_blacklisted,
    update_user,
)
from src.logger import logger
from src.models.user import (
    LogoutRequest,
    RefreshTokenRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

security_scheme = HTTPBearer(auto_error=True)


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def register(user_data: UserCreate):
    """Register a new user account."""
    try:
        user_doc = await create_user(user_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    return UserResponse(
        id=str(user_doc["_id"]),
        name=user_doc["name"],
        email=user_doc["email"],
        role=user_doc["role"],
        created_at=user_doc["created_at"],
        updated_at=user_doc["updated_at"],
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Authenticate and receive JWT token pair."""
    user = await authenticate_user(credentials.email, credentials.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user_id = str(user["_id"])
    access_token = create_access_token(user_id, user["role"])
    refresh_token = create_refresh_token(user_id, user["role"])

    logger.info(f"User logged in: {user['email']}")
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(body: RefreshTokenRequest):
    """Exchange a valid refresh token for a new token pair."""
    try:
        payload = decode_token(body.refresh_token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type. Provide a refresh token.",
        )

    if await is_token_blacklisted(body.refresh_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked",
        )

    # Blacklist the old refresh token to prevent reuse
    await blacklist_token(body.refresh_token)

    new_access = create_access_token(payload["sub"], payload["role"])
    new_refresh = create_refresh_token(payload["sub"], payload["role"])

    return TokenResponse(access_token=new_access, refresh_token=new_refresh)


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    body: LogoutRequest = LogoutRequest(),
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
):
    """Logout by blacklisting the current access token and optional refresh token."""
    # Blacklist the access token
    await blacklist_token(credentials.credentials)

    # Blacklist the refresh token if provided
    if body.refresh_token:
        await blacklist_token(body.refresh_token)

    logger.info("User logged out")
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get the currently authenticated user's profile."""
    return UserResponse(
        id=str(current_user["_id"]),
        name=current_user["name"],
        email=current_user["email"],
        role=current_user["role"],
        created_at=current_user["created_at"],
        updated_at=current_user["updated_at"],
    )


@router.patch("/me", response_model=UserResponse)
async def update_me(
    update_data: UserUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update the currently authenticated user's profile."""
    fields_to_update = {}

    if update_data.name is not None:
        fields_to_update["name"] = update_data.name
    if update_data.password is not None:
        fields_to_update["password_hash"] = hash_password(update_data.password)

    if not fields_to_update:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update",
        )

    updated_user = await update_user(str(current_user["_id"]), fields_to_update)
    if updated_user is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user",
        )

    logger.info(f"User updated: {updated_user['email']}")
    return UserResponse(
        id=str(updated_user["_id"]),
        name=updated_user["name"],
        email=updated_user["email"],
        role=updated_user["role"],
        created_at=updated_user["created_at"],
        updated_at=updated_user["updated_at"],
    )


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_me(current_user: dict = Depends(get_current_user)):
    """Delete the currently authenticated user's account and prediction history."""
    user_id = str(current_user["_id"])
    await delete_user(user_id)
    logger.info(f"User deleted account: {current_user['email']}")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
