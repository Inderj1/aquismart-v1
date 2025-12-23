from typing import Annotated, Optional, List
from datetime import datetime
import json
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.listing import Listing, ListingStatus, SavedListing
from app.models.analytics import BrowsingHistory
from app.api.deps import get_current_user, get_current_user_optional, get_current_active_seller
from app.schemas.listing import (
    ListingCreate,
    ListingUpdate,
    ListingResponse,
    ListingListResponse,
)

router = APIRouter()


@router.get("", response_model=ListingListResponse)
async def search_listings(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
    q: Optional[str] = Query(None, description="Search query"),
    industry: Optional[str] = Query(None, description="Filter by industry"),
    state: Optional[str] = Query(None, description="Filter by state"),
    min_price: Optional[int] = Query(None, ge=0, description="Minimum asking price"),
    max_price: Optional[int] = Query(None, ge=0, description="Maximum asking price"),
    min_revenue: Optional[int] = Query(None, ge=0, description="Minimum revenue"),
    max_revenue: Optional[int] = Query(None, ge=0, description="Maximum revenue"),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Items per page"),
):
    """
    Search and filter business listings.

    - Text search on title, description, industry
    - Filter by industry, state, price range, revenue range
    - Pagination support
    """
    # Base query for active listings
    query = select(Listing).where(Listing.status == ListingStatus.ACTIVE)

    # Apply filters
    if q:
        search_term = f"%{q}%"
        query = query.where(
            or_(
                Listing.title.ilike(search_term),
                Listing.description.ilike(search_term),
                Listing.industry.ilike(search_term),
                Listing.keywords.ilike(search_term),
            )
        )

    if industry:
        query = query.where(Listing.industry.ilike(f"%{industry}%"))

    if state:
        query = query.where(Listing.state == state)

    if min_price is not None:
        query = query.where(Listing.asking_price >= min_price)

    if max_price is not None:
        query = query.where(Listing.asking_price <= max_price)

    if min_revenue is not None:
        query = query.where(Listing.revenue >= min_revenue)

    if max_revenue is not None:
        query = query.where(Listing.revenue <= max_revenue)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Apply pagination and ordering
    offset = (page - 1) * size
    query = query.order_by(Listing.is_featured.desc(), Listing.created_at.desc())
    query = query.offset(offset).limit(size)

    # Execute query
    result = await db.execute(query)
    listings = result.scalars().all()

    # Calculate pages
    pages = (total + size - 1) // size if total > 0 else 1

    return ListingListResponse(
        items=listings,
        total=total,
        page=page,
        size=size,
        pages=pages,
    )


@router.get("/featured", response_model=List[ListingResponse])
async def get_featured_listings(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(6, ge=1, le=20, description="Number of featured listings"),
):
    """
    Get featured listings for landing page.
    """
    result = await db.execute(
        select(Listing)
        .where(
            Listing.status == ListingStatus.ACTIVE,
            Listing.is_featured == True,
        )
        .order_by(Listing.created_at.desc())
        .limit(limit)
    )
    listings = result.scalars().all()

    return listings


@router.get("/{listing_id}", response_model=ListingResponse)
async def get_listing(
    listing_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Get a single listing by ID.

    Tracks view in browsing history if user is authenticated.
    """
    result = await db.execute(select(Listing).where(Listing.id == listing_id))
    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    # Only show active listings to non-owners
    if listing.status != ListingStatus.ACTIVE:
        if not current_user or current_user.id != listing.seller_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found",
            )

    # Track view if user is authenticated
    if current_user and current_user.id != listing.seller_id:
        history = BrowsingHistory(
            user_id=current_user.id,
            listing_id=listing_id,
        )
        db.add(history)
        await db.commit()

    return listing


@router.post("", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
async def create_listing(
    listing_data: ListingCreate,
    current_user: Annotated[User, Depends(get_current_active_seller)],
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new listing (seller only).

    Listing is created in DRAFT status.
    """
    # Prepare data
    data = listing_data.model_dump()

    # Convert lists to JSON strings for storage
    if data.get("business_highlights"):
        data["business_highlights"] = json.dumps(data["business_highlights"])
    if data.get("keywords"):
        data["keywords"] = json.dumps(data["keywords"])

    # Create listing
    listing = Listing(
        **data,
        seller_id=current_user.id,
        status=ListingStatus.DRAFT,
    )
    db.add(listing)
    await db.commit()
    await db.refresh(listing)

    return listing


@router.put("/{listing_id}", response_model=ListingResponse)
async def update_listing(
    listing_id: int,
    update_data: ListingUpdate,
    current_user: Annotated[User, Depends(get_current_active_seller)],
    db: AsyncSession = Depends(get_db),
):
    """
    Update a listing (owner only).
    """
    result = await db.execute(select(Listing).where(Listing.id == listing_id))
    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    # Check ownership
    if listing.seller_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own listings",
        )

    # Apply updates
    update_dict = update_data.model_dump(exclude_unset=True)

    # Convert lists to JSON strings
    if "business_highlights" in update_dict and update_dict["business_highlights"]:
        update_dict["business_highlights"] = json.dumps(update_dict["business_highlights"])
    if "keywords" in update_dict and update_dict["keywords"]:
        update_dict["keywords"] = json.dumps(update_dict["keywords"])

    # Handle status change to ACTIVE (publish)
    if update_dict.get("status") == ListingStatus.ACTIVE and listing.status == ListingStatus.DRAFT:
        update_dict["published_at"] = datetime.utcnow()

    for field, value in update_dict.items():
        setattr(listing, field, value)

    await db.commit()
    await db.refresh(listing)

    return listing


@router.delete("/{listing_id}", status_code=status.HTTP_200_OK)
async def delete_listing(
    listing_id: int,
    current_user: Annotated[User, Depends(get_current_active_seller)],
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a listing (owner only).

    Sets status to WITHDRAWN rather than hard delete.
    """
    result = await db.execute(select(Listing).where(Listing.id == listing_id))
    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    # Check ownership
    if listing.seller_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own listings",
        )

    # Soft delete by changing status
    listing.status = ListingStatus.WITHDRAWN
    await db.commit()

    return {"message": "Listing withdrawn successfully"}


@router.post("/{listing_id}/publish", response_model=ListingResponse)
async def publish_listing(
    listing_id: int,
    current_user: Annotated[User, Depends(get_current_active_seller)],
    db: AsyncSession = Depends(get_db),
):
    """
    Publish a draft listing (owner only).
    """
    result = await db.execute(select(Listing).where(Listing.id == listing_id))
    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    # Check ownership
    if listing.seller_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only publish your own listings",
        )

    if listing.status != ListingStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft listings can be published",
        )

    listing.status = ListingStatus.ACTIVE
    listing.published_at = datetime.utcnow()
    await db.commit()
    await db.refresh(listing)

    return listing


@router.get("/seller/me", response_model=List[ListingResponse])
async def get_my_listings(
    current_user: Annotated[User, Depends(get_current_active_seller)],
    db: AsyncSession = Depends(get_db),
    status_filter: Optional[ListingStatus] = Query(None, description="Filter by status"),
):
    """
    Get all listings owned by the current seller.
    """
    query = select(Listing).where(Listing.seller_id == current_user.id)

    if status_filter:
        query = query.where(Listing.status == status_filter)

    query = query.order_by(Listing.created_at.desc())

    result = await db.execute(query)
    listings = result.scalars().all()

    return listings
