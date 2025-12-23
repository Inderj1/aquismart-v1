from typing import Optional
from datetime import datetime
from pydantic import BaseModel, HttpUrl


class CreateCheckoutRequest(BaseModel):
    """Request to create a checkout session."""

    success_url: str
    cancel_url: str


class ValuationCheckoutRequest(BaseModel):
    """Request to create a valuation checkout session."""

    listing_id: int
    success_url: str
    cancel_url: str


class CheckoutResponse(BaseModel):
    """Response with checkout session URL."""

    checkout_url: str
    session_id: str


class BillingPortalRequest(BaseModel):
    """Request to create billing portal session."""

    return_url: str


class BillingPortalResponse(BaseModel):
    """Response with billing portal URL."""

    portal_url: str


class SubscriptionResponse(BaseModel):
    """Response with subscription details."""

    id: int
    user_id: int
    plan: str
    status: str
    stripe_subscription_id: Optional[str] = None
    current_period_start: Optional[str] = None
    current_period_end: Optional[str] = None
    cancel_at_period_end: bool = False
    is_active: bool
    created_at: str


class SubscriptionStatusResponse(BaseModel):
    """Response with subscription status."""

    plan: str
    is_active: bool
    subscription: Optional[SubscriptionResponse] = None


class CancelSubscriptionRequest(BaseModel):
    """Request to cancel subscription."""

    at_period_end: bool = True


class ValuationAccessResponse(BaseModel):
    """Response for valuation access check."""

    has_access: bool
    reason: Optional[str] = None
