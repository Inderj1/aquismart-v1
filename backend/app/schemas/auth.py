from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class SignUpRequest(BaseModel):
    """Request schema for user registration."""

    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)


class SignInRequest(BaseModel):
    """Request schema for user login."""

    email: EmailStr
    password: str


class ConfirmSignUpRequest(BaseModel):
    """Request schema for email verification."""

    email: EmailStr
    confirmation_code: str = Field(..., min_length=6, max_length=6)


class ForgotPasswordRequest(BaseModel):
    """Request schema for forgot password."""

    email: EmailStr


class ConfirmForgotPasswordRequest(BaseModel):
    """Request schema for password reset."""

    email: EmailStr
    confirmation_code: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=8)


class RefreshTokenRequest(BaseModel):
    """Request schema for token refresh."""

    refresh_token: str
    email: EmailStr


class TokenResponse(BaseModel):
    """Response schema for authentication tokens."""

    access_token: str
    id_token: str
    refresh_token: Optional[str] = None
    expires_in: int
    token_type: str = "Bearer"


class AuthResponse(BaseModel):
    """Generic auth response."""

    success: bool
    message: str
    user_sub: Optional[str] = None
    tokens: Optional[TokenResponse] = None
