from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.user import User
from app.models.listing import SavedListing, Listing
from app.models.analytics import BrowsingHistory
from app.api.deps import get_current_user
from app.schemas.user import (
    UserResponse,
    UserUpdate,
    UserProfileResponse,
    SavedListingResponse,
    BrowsingHistoryResponse,
)
from app.schemas.listing import ListingResponse

router = APIRouter()


@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_profile(
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Get current authenticated user's profile.
    """
    return current_user


@router.put("/me", response_model=UserProfileResponse)
async def update_current_user_profile(
    update_data: UserUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Update current user's profile.
    """
    update_dict = update_data.model_dump(exclude_unset=True)

    for field, value in update_dict.items():
        setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)

    return current_user


@router.get("/me/saved", response_model=List[ListingResponse])
async def get_saved_listings(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Get current user's saved/starred listings.
    """
    result = await db.execute(
        select(Listing)
        .join(SavedListing, SavedListing.listing_id == Listing.id)
        .where(SavedListing.user_id == current_user.id)
        .order_by(SavedListing.created_at.desc())
    )
    listings = result.scalars().all()

    return listings


@router.post("/me/saved/{listing_id}", status_code=status.HTTP_201_CREATED)
async def save_listing(
    listing_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Save/star a listing.
    """
    # Check if listing exists
    result = await db.execute(select(Listing).where(Listing.id == listing_id))
    listing = result.scalar_one_or_none()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    # Check if already saved
    result = await db.execute(
        select(SavedListing).where(
            SavedListing.user_id == current_user.id,
            SavedListing.listing_id == listing_id,
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        return {"message": "Listing already saved"}

    # Save the listing
    saved = SavedListing(user_id=current_user.id, listing_id=listing_id)
    db.add(saved)
    await db.commit()

    return {"message": "Listing saved successfully"}


@router.delete("/me/saved/{listing_id}", status_code=status.HTTP_200_OK)
async def unsave_listing(
    listing_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Remove a listing from saved/starred list.
    """
    result = await db.execute(
        select(SavedListing).where(
            SavedListing.user_id == current_user.id,
            SavedListing.listing_id == listing_id,
        )
    )
    saved = result.scalar_one_or_none()

    if not saved:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved listing not found",
        )

    await db.delete(saved)
    await db.commit()

    return {"message": "Listing removed from saved"}


@router.get("/me/history", response_model=List[BrowsingHistoryResponse])
async def get_browsing_history(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
    limit: int = 50,
):
    """
    Get current user's browsing history.
    """
    result = await db.execute(
        select(BrowsingHistory)
        .where(BrowsingHistory.user_id == current_user.id)
        .order_by(BrowsingHistory.viewed_at.desc())
        .limit(limit)
    )
    history = result.scalars().all()

    return history


@router.get("/me/recommendations", response_model=List[ListingResponse])
async def get_recommendations(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
    limit: int = 10,
):
    """
    Get AI-powered listing recommendations for current user.

    Based on:
    - Browsing history
    - Saved listings
    - Search history
    - User preferences
    """
    # TODO: Implement AI recommendation engine
    # For now, return featured active listings as placeholder
    from app.models.listing import ListingStatus

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
