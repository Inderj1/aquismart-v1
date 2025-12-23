from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.api.deps import get_current_user
from app.services.payments import stripe_service, subscription_service
from app.schemas.payment import (
    CreateCheckoutRequest,
    ValuationCheckoutRequest,
    CheckoutResponse,
    BillingPortalRequest,
    BillingPortalResponse,
    SubscriptionResponse,
    SubscriptionStatusResponse,
    CancelSubscriptionRequest,
    ValuationAccessResponse,
)

router = APIRouter()


@router.get("/subscription", response_model=SubscriptionStatusResponse)
async def get_subscription_status(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Get current user's subscription status.

    Returns plan type and whether subscription is active.
    """
    result = await subscription_service.get_subscription(db, current_user.id)

    subscription = None
    if result.get("subscription"):
        subscription = SubscriptionResponse(**result["subscription"])

    return SubscriptionStatusResponse(
        plan=result.get("plan", "free"),
        is_active=result.get("is_active", False),
        subscription=subscription,
    )


@router.post("/subscribe", response_model=CheckoutResponse)
async def create_subscription_checkout(
    checkout_data: CreateCheckoutRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Create a Stripe checkout session for subscription.

    Returns a URL to redirect the user to Stripe's checkout page.
    """
    result = await subscription_service.create_checkout_session(
        db=db,
        user=current_user,
        success_url=checkout_data.success_url,
        cancel_url=checkout_data.cancel_url,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to create checkout session"),
        )

    return CheckoutResponse(
        checkout_url=result["checkout_url"],
        session_id=result["session_id"],
    )


@router.post("/valuation/{listing_id}", response_model=CheckoutResponse)
async def create_valuation_checkout(
    listing_id: int,
    checkout_data: CreateCheckoutRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Create a Stripe checkout session for one-time valuation purchase.

    Returns a URL to redirect the user to Stripe's checkout page.
    """
    result = await subscription_service.create_valuation_checkout(
        db=db,
        user=current_user,
        listing_id=listing_id,
        success_url=checkout_data.success_url,
        cancel_url=checkout_data.cancel_url,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to create checkout session"),
        )

    return CheckoutResponse(
        checkout_url=result["checkout_url"],
        session_id=result["session_id"],
    )


@router.post("/cancel")
async def cancel_subscription(
    cancel_data: CancelSubscriptionRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Cancel current subscription.

    By default, cancels at the end of the billing period.
    Set at_period_end=False to cancel immediately.
    """
    result = await subscription_service.cancel_subscription(
        db=db,
        user_id=current_user.id,
        at_period_end=cancel_data.at_period_end,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to cancel subscription"),
        )

    return {
        "message": result.get("message"),
        "subscription": result.get("subscription"),
    }


@router.post("/reactivate")
async def reactivate_subscription(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Reactivate a subscription that was set to cancel at period end.
    """
    result = await subscription_service.reactivate_subscription(
        db=db,
        user_id=current_user.id,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to reactivate subscription"),
        )

    return {
        "message": result.get("message"),
        "subscription": result.get("subscription"),
    }


@router.post("/billing-portal", response_model=BillingPortalResponse)
async def get_billing_portal(
    portal_data: BillingPortalRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Get Stripe billing portal URL for self-service management.

    Allows users to update payment method, view invoices, etc.
    """
    result = await subscription_service.get_billing_portal_url(
        db=db,
        user_id=current_user.id,
        return_url=portal_data.return_url,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to create billing portal session"),
        )

    return BillingPortalResponse(portal_url=result["portal_url"])


@router.get("/valuation/{listing_id}/access", response_model=ValuationAccessResponse)
async def check_valuation_access(
    listing_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Check if user has access to view a valuation.

    Access is granted if:
    - User has Premium/Enterprise subscription
    - User purchased this specific valuation
    """
    has_access = await subscription_service.has_valuation_access(
        db=db,
        user_id=current_user.id,
        listing_id=listing_id,
    )

    reason = None
    if not has_access:
        reason = "Purchase valuation or upgrade to Premium subscription"

    return ValuationAccessResponse(
        has_access=has_access,
        reason=reason,
    )
