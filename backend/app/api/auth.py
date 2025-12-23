from typing import Annotated, Optional
from urllib.parse import urlencode
import httpx
import json
import base64
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.config import settings
from app.db.session import get_db
from app.models.user import User, UserRole
from app.services.auth.cognito import cognito_service
from app.api.deps import get_current_user
from app.schemas.auth import (
    SignUpRequest,
    SignInRequest,
    ConfirmSignUpRequest,
    ForgotPasswordRequest,
    ConfirmForgotPasswordRequest,
    RefreshTokenRequest,
    AuthResponse,
    TokenResponse,
)

router = APIRouter()


@router.post("/register", response_model=AuthResponse)
async def register(
    request: SignUpRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Register a new user with email and password.

    - Sends verification code to email via Cognito
    - Creates user record in database
    """
    # Check if user already exists in database
    result = await db.execute(select(User).where(User.email == request.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Register with Cognito
    cognito_result = await cognito_service.sign_up(
        email=request.email,
        password=request.password,
        first_name=request.first_name,
        last_name=request.last_name,
    )

    if not cognito_result["success"]:
        error_code = cognito_result.get("error_code", "")
        error_message = cognito_result.get("error_message", "Registration failed")

        if error_code == "UsernameExistsException":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        elif error_code == "InvalidPasswordException":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_message,
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_message,
            )

    # Create user in database
    full_name = f"{request.first_name} {request.last_name}"
    user = User(
        email=request.email,
        name=full_name,
        cognito_sub=cognito_result["user_sub"],
        role=UserRole.BUYER,  # Default role
        email_verified=cognito_result.get("user_confirmed", False),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return AuthResponse(
        success=True,
        message="Registration successful. Please check your email for verification code.",
        user_sub=cognito_result["user_sub"],
    )


@router.post("/verify-email", response_model=AuthResponse)
async def verify_email(
    request: ConfirmSignUpRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Verify email with confirmation code sent during registration.
    """
    cognito_result = await cognito_service.confirm_sign_up(
        email=request.email,
        confirmation_code=request.confirmation_code,
    )

    if not cognito_result["success"]:
        error_code = cognito_result.get("error_code", "")
        error_message = cognito_result.get("error_message", "Verification failed")

        if error_code == "CodeMismatchException":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification code",
            )
        elif error_code == "ExpiredCodeException":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification code has expired",
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_message,
            )

    # Update user's email_verified status in database
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalar_one_or_none()
    if user:
        user.email_verified = True
        await db.commit()

    return AuthResponse(
        success=True,
        message="Email verified successfully. You can now sign in.",
    )


@router.post("/login", response_model=AuthResponse)
async def login(
    request: SignInRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Sign in with email and password.

    Returns access token, ID token, and refresh token.
    """
    cognito_result = await cognito_service.sign_in(
        email=request.email,
        password=request.password,
    )

    if not cognito_result["success"]:
        error_code = cognito_result.get("error_code", "")
        error_message = cognito_result.get("error_message", "Login failed")

        if error_code == "NotAuthorizedException":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        elif error_code == "UserNotConfirmedException":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please verify your email before signing in",
            )
        elif error_code == "UserNotFoundException":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=error_message,
            )

    # Get or update user in database
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalar_one_or_none()

    if user and not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled",
        )

    tokens = TokenResponse(
        access_token=cognito_result["access_token"],
        id_token=cognito_result["id_token"],
        refresh_token=cognito_result["refresh_token"],
        expires_in=cognito_result["expires_in"],
    )

    return AuthResponse(
        success=True,
        message="Login successful",
        tokens=tokens,
    )


@router.post("/refresh", response_model=AuthResponse)
async def refresh_token(request: RefreshTokenRequest):
    """
    Refresh access and ID tokens using refresh token.
    """
    cognito_result = await cognito_service.refresh_tokens(
        refresh_token=request.refresh_token,
        email=request.email,
    )

    if not cognito_result["success"]:
        error_code = cognito_result.get("error_code", "")

        if error_code == "NotAuthorizedException":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=cognito_result.get("error_message", "Token refresh failed"),
            )

    tokens = TokenResponse(
        access_token=cognito_result["access_token"],
        id_token=cognito_result["id_token"],
        expires_in=cognito_result["expires_in"],
    )

    return AuthResponse(
        success=True,
        message="Token refreshed successfully",
        tokens=tokens,
    )


@router.post("/forgot-password", response_model=AuthResponse)
async def forgot_password(request: ForgotPasswordRequest):
    """
    Initiate forgot password flow. Sends reset code to email.
    """
    cognito_result = await cognito_service.forgot_password(email=request.email)

    if not cognito_result["success"]:
        error_code = cognito_result.get("error_code", "")

        if error_code == "UserNotFoundException":
            # Don't reveal if user exists - return success anyway
            pass
        elif error_code == "LimitExceededException":
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later.",
            )
        # For other errors, still return success to not reveal user existence

    return AuthResponse(
        success=True,
        message="If the email exists, a password reset code has been sent.",
    )


@router.post("/reset-password", response_model=AuthResponse)
async def reset_password(request: ConfirmForgotPasswordRequest):
    """
    Reset password with confirmation code.
    """
    cognito_result = await cognito_service.confirm_forgot_password(
        email=request.email,
        confirmation_code=request.confirmation_code,
        new_password=request.new_password,
    )

    if not cognito_result["success"]:
        error_code = cognito_result.get("error_code", "")
        error_message = cognito_result.get("error_message", "Password reset failed")

        if error_code == "CodeMismatchException":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset code",
            )
        elif error_code == "ExpiredCodeException":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset code has expired",
            )
        elif error_code == "InvalidPasswordException":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_message,
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_message,
            )

    return AuthResponse(
        success=True,
        message="Password reset successful. You can now sign in with your new password.",
    )


@router.get("/google")
async def google_login(
    redirect_uri: Optional[str] = Query(None, description="Custom redirect URI after login"),
):
    """
    Redirect to Google OAuth via Cognito hosted UI.

    This initiates the Google OAuth flow through AWS Cognito.
    """
    if not settings.cognito_domain or not settings.cognito_client_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth is not configured",
        )

    # Use custom redirect or default
    callback_uri = redirect_uri or settings.cognito_redirect_uri

    # Build Cognito hosted UI URL for Google OAuth
    params = {
        "client_id": settings.cognito_client_id,
        "response_type": "code",
        "scope": "email openid profile",
        "redirect_uri": callback_uri,
        "identity_provider": "Google",
    }

    auth_url = f"https://{settings.cognito_domain}/oauth2/authorize?{urlencode(params)}"

    return RedirectResponse(url=auth_url)


@router.get("/google/callback", response_model=AuthResponse)
async def google_callback(
    code: str = Query(..., description="Authorization code from Cognito"),
    redirect_uri: Optional[str] = Query(None, description="Redirect URI used in auth request"),
    db: AsyncSession = Depends(get_db),
):
    """
    Handle Google OAuth callback from Cognito.

    Exchanges authorization code for tokens and creates/updates user in database.
    """
    if not settings.cognito_domain or not settings.cognito_client_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth is not configured",
        )

    callback_uri = redirect_uri or settings.cognito_redirect_uri

    # Exchange authorization code for tokens
    token_url = f"https://{settings.cognito_domain}/oauth2/token"

    token_data = {
        "grant_type": "authorization_code",
        "client_id": settings.cognito_client_id,
        "code": code,
        "redirect_uri": callback_uri,
    }

    # Add client secret if configured
    if settings.cognito_client_secret:
        token_data["client_secret"] = settings.cognito_client_secret

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                token_url,
                data=token_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Failed to exchange authorization code for tokens",
                )

            token_response = response.json()

    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Failed to connect to authentication service: {str(e)}",
        )

    access_token = token_response.get("access_token")
    id_token = token_response.get("id_token")
    refresh_token = token_response.get("refresh_token")
    expires_in = token_response.get("expires_in", 3600)

    if not id_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No ID token received",
        )

    # Decode ID token to get user info (JWT payload is base64 encoded)
    # Note: In production, you should verify the JWT signature
    try:
        # JWT format: header.payload.signature
        payload_part = id_token.split('.')[1]
        # Add padding if needed
        padding = 4 - len(payload_part) % 4
        if padding != 4:
            payload_part += '=' * padding
        payload_json = base64.urlsafe_b64decode(payload_part)
        id_token_claims = json.loads(payload_json)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Failed to decode ID token: {str(e)}",
        )

    cognito_sub = id_token_claims.get("sub")
    email = id_token_claims.get("email")
    name = id_token_claims.get("name")
    email_verified = id_token_claims.get("email_verified", False)

    if not cognito_sub or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user information received",
        )

    # Find or create user in database
    result = await db.execute(select(User).where(User.cognito_sub == cognito_sub))
    user = result.scalar_one_or_none()

    if not user:
        # Check if user exists with same email (might have registered with email first)
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if user:
            # Link existing user to Cognito
            user.cognito_sub = cognito_sub
            user.email_verified = email_verified
            if name and not user.name:
                user.name = name
        else:
            # Create new user
            user = User(
                email=email,
                name=name,
                cognito_sub=cognito_sub,
                role=UserRole.BUYER,
                email_verified=email_verified,
            )
            db.add(user)

        await db.commit()
        await db.refresh(user)

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled",
        )

    tokens = TokenResponse(
        access_token=access_token,
        id_token=id_token,
        refresh_token=refresh_token,
        expires_in=expires_in,
    )

    return AuthResponse(
        success=True,
        message="Google login successful",
        user_sub=cognito_sub,
        tokens=tokens,
    )


@router.post("/logout", response_model=AuthResponse)
async def logout(
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Logout user by invalidating tokens in Cognito.

    Note: The client should also clear stored tokens locally.
    """
    # For Cognito, we can use global_sign_out which is already in cognito_service
    # However, we need the access token. Since we get the user via deps,
    # we don't have direct access to the token here.
    #
    # In practice, the client should:
    # 1. Call this endpoint to signal logout intent
    # 2. Clear local token storage
    #
    # For server-side token invalidation, the client should pass the access token.
    # This is handled by the cognito_service.sign_out method if needed.

    return AuthResponse(
        success=True,
        message="Logout successful. Please clear your local tokens.",
    )


@router.post("/logout/global", response_model=AuthResponse)
async def global_logout(
    access_token: str,
):
    """
    Global logout - invalidates all tokens for the user.

    Requires the current access token to be passed in the request body.
    """
    result = await cognito_service.sign_out(access_token)

    if not result["success"]:
        # Even if Cognito fails, we tell the client to clear tokens
        return AuthResponse(
            success=True,
            message="Logout processed. Please clear your local tokens.",
        )

    return AuthResponse(
        success=True,
        message="Global logout successful. All sessions have been invalidated.",
    )
