from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

from app.models.listing import ListingStatus


class ListingCreate(BaseModel):
    """Request schema for creating a listing."""

    title: str = Field(..., min_length=5, max_length=255)
    description: str = Field(..., min_length=50)
    industry: str = Field(..., max_length=100)
    sub_industry: Optional[str] = None

    # Location
    location: str = Field(..., max_length=255)
    city: Optional[str] = None
    state: Optional[str] = None
    country: str = "USA"

    # Financial info
    asking_price: int = Field(..., gt=0)
    revenue: Optional[int] = None
    profit: Optional[int] = None
    cash_flow: Optional[int] = None
    ebitda: Optional[int] = None

    # Business details
    year_established: Optional[int] = None
    employees: Optional[int] = None
    reason_for_sale: Optional[str] = None
    business_highlights: Optional[List[str]] = None

    # Keywords for search/matching
    keywords: Optional[List[str]] = None


class ListingUpdate(BaseModel):
    """Request schema for updating a listing."""

    title: Optional[str] = Field(None, min_length=5, max_length=255)
    description: Optional[str] = Field(None, min_length=50)
    industry: Optional[str] = None
    sub_industry: Optional[str] = None

    # Location
    location: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None

    # Financial info
    asking_price: Optional[int] = Field(None, gt=0)
    revenue: Optional[int] = None
    profit: Optional[int] = None
    cash_flow: Optional[int] = None
    ebitda: Optional[int] = None

    # Business details
    year_established: Optional[int] = None
    employees: Optional[int] = None
    reason_for_sale: Optional[str] = None
    business_highlights: Optional[List[str]] = None

    # Keywords
    keywords: Optional[List[str]] = None

    # Status (seller can change)
    status: Optional[ListingStatus] = None


class ListingResponse(BaseModel):
    """Response schema for a listing."""

    id: int
    seller_id: int

    # Basic info
    title: str
    description: str
    industry: str
    sub_industry: Optional[str] = None

    # Location
    location: str
    city: Optional[str] = None
    state: Optional[str] = None
    country: str

    # Financial info (may be hidden for non-NDA users)
    asking_price: int
    revenue: Optional[int] = None
    profit: Optional[int] = None
    cash_flow: Optional[int] = None
    ebitda: Optional[int] = None

    # Business details
    year_established: Optional[int] = None
    employees: Optional[int] = None
    reason_for_sale: Optional[str] = None
    business_highlights: Optional[List[str]] = None

    # Status
    status: ListingStatus
    is_featured: bool

    # Keywords
    keywords: Optional[List[str]] = None

    # Timestamps
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ListingListResponse(BaseModel):
    """Response schema for listing list with pagination."""

    items: List[ListingResponse]
    total: int
    page: int
    size: int
    pages: int


class ListingSearchParams(BaseModel):
    """Query parameters for listing search."""

    q: Optional[str] = None  # Search query
    industry: Optional[str] = None
    state: Optional[str] = None
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    min_revenue: Optional[int] = None
    max_revenue: Optional[int] = None
    status: Optional[ListingStatus] = ListingStatus.ACTIVE
    page: int = Field(default=1, ge=1)
    size: int = Field(default=20, ge=1, le=100)
