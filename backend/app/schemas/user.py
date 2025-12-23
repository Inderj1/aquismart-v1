from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr

from app.models.user import UserRole


class UserResponse(BaseModel):
    """Response schema for user data."""

    id: str
    email: EmailStr
    name: Optional[str] = None
    role: UserRole
    is_active: bool
    email_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    """Request schema for updating user profile."""

    name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    bio: Optional[str] = None
    preferences: Optional[dict] = None


class UserProfileResponse(BaseModel):
    """Extended user profile response."""

    id: str
    email: EmailStr
    name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    bio: Optional[str] = None
    role: UserRole
    is_active: bool
    email_verified: bool
    preferences: Optional[dict] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SavedListingResponse(BaseModel):
    """Response for saved/starred listing."""

    listing_id: str
    saved_at: datetime

    class Config:
        from_attributes = True


class BrowsingHistoryResponse(BaseModel):
    """Response for browsing history."""

    listing_id: str
    viewed_at: datetime

    class Config:
        from_attributes = True
