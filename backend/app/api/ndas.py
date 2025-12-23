from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.user import User
from app.models.listing import Listing
from app.api.deps import get_current_user, get_current_active_seller
from app.services.nda import nda_service
from app.schemas.nda import (
    NDARequestCreate,
    NDASignRequest,
    NDASendRequest,
    NDARejectRequest,
    NDAResponse,
    NDAListResponse,
    NDAStatusResponse,
    FinancialDataResponse,
)

router = APIRouter()


@router.post("/request", response_model=NDAResponse)
async def request_nda(
    request_data: NDARequestCreate,
    request: Request,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Request NDA access for a listing.

    Buyers must request NDA access to view financial documents.
    """
    result = await nda_service.request_nda(
        db=db,
        listing_id=request_data.listing_id,
        buyer_id=current_user.id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "NDA request failed"),
        )

    return NDAResponse(**result["nda"])


@router.post("/{nda_id}/send", response_model=NDAResponse)
async def send_nda(
    nda_id: int,
    send_data: NDASendRequest,
    current_user: Annotated[User, Depends(get_current_active_seller)],
    db: AsyncSession = Depends(get_db),
):
    """
    Send NDA document to buyer (seller only).

    Optionally include a URL to the NDA document.
    """
    result = await nda_service.send_nda(
        db=db,
        nda_id=nda_id,
        seller_id=current_user.id,
        document_url=send_data.document_url,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to send NDA"),
        )

    return NDAResponse(**result["nda"])


@router.post("/{nda_id}/sign", response_model=NDAResponse)
async def sign_nda(
    nda_id: int,
    sign_data: NDASignRequest,
    request: Request,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Sign an NDA (buyer only).

    After signing, the buyer gains access to financial documents.
    """
    result = await nda_service.sign_nda(
        db=db,
        nda_id=nda_id,
        buyer_id=current_user.id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        signed_document_url=sign_data.signed_document_url,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to sign NDA"),
        )

    return NDAResponse(**result["nda"])


@router.post("/{nda_id}/reject")
async def reject_nda(
    nda_id: int,
    reject_data: NDARejectRequest,
    current_user: Annotated[User, Depends(get_current_active_seller)],
    db: AsyncSession = Depends(get_db),
):
    """
    Reject an NDA request (seller only).
    """
    result = await nda_service.reject_nda(
        db=db,
        nda_id=nda_id,
        seller_id=current_user.id,
        reason=reject_data.reason,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to reject NDA"),
        )

    return {"message": result.get("message", "NDA rejected")}


@router.get("/{nda_id}", response_model=NDAResponse)
async def get_nda(
    nda_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Get NDA details.

    Both buyer and seller of the associated listing can view the NDA.
    """
    result = await nda_service.get_nda(
        db=db,
        nda_id=nda_id,
        user_id=current_user.id,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.get("error", "NDA not found"),
        )

    return NDAResponse(**result["nda"])


@router.get("", response_model=NDAListResponse)
async def list_ndas(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
    as_seller: bool = Query(False, description="List NDAs as seller (for your listings)"),
    listing_id: Optional[int] = Query(None, description="Filter by listing ID"),
):
    """
    List NDAs.

    - As buyer: Lists NDAs you have requested
    - As seller: Lists NDAs requested for your listings
    """
    result = await nda_service.list_ndas(
        db=db,
        user_id=current_user.id,
        as_seller=as_seller,
        listing_id=listing_id,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to list NDAs"),
        )

    return NDAListResponse(ndas=[NDAResponse(**nda) for nda in result["ndas"]])


@router.get("/listing/{listing_id}/status", response_model=NDAStatusResponse)
async def check_nda_status(
    listing_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Check NDA status for a listing.

    Returns whether the current user has valid NDA access.
    """
    # Check if listing exists
    result = await db.execute(select(Listing).where(Listing.id == listing_id))
    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    # Seller always has access
    if listing.seller_id == current_user.id:
        return NDAStatusResponse(has_access=True)

    # Check for existing NDA
    ndas_result = await nda_service.list_ndas(
        db=db,
        user_id=current_user.id,
        listing_id=listing_id,
    )

    ndas = ndas_result.get("ndas", [])
    if ndas:
        nda = ndas[0]  # Get the most recent NDA for this listing
        return NDAStatusResponse(
            has_access=nda.get("is_valid", False) and nda.get("status") == "signed",
            nda=NDAResponse(**nda),
        )

    return NDAStatusResponse(has_access=False)


@router.get("/listing/{listing_id}/financials", response_model=FinancialDataResponse)
async def get_listing_financials(
    listing_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Get financial data for a listing (requires signed NDA).

    Returns detailed financial information only accessible after NDA is signed.
    """
    # Check if listing exists
    result = await db.execute(select(Listing).where(Listing.id == listing_id))
    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    # Seller always has access
    is_owner = listing.seller_id == current_user.id

    if not is_owner:
        # Check NDA access
        has_access = await nda_service.check_access(
            db=db,
            listing_id=listing_id,
            user_id=current_user.id,
        )

        if not has_access:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="NDA required to access financial data",
            )

    return FinancialDataResponse(
        listing_id=listing.id,
        revenue=listing.revenue,
        profit=listing.profit,
        cash_flow=listing.cash_flow,
        ebitda=listing.ebitda,
        year_established=listing.year_established,
        employees=listing.employees,
    )
