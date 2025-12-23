from typing import Optional, Dict, Any
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

from app.models.user import User
from app.models.subscription import (
    Subscription,
    SubscriptionPlan,
    SubscriptionStatus,
    ValuationPurchase,
)
from app.services.payments.stripe_service import stripe_service

logger = logging.getLogger(__name__)


class SubscriptionService:
    """Service for managing user subscriptions."""

    async def get_subscription(
        self,
        db: AsyncSession,
        user_id: int,
    ) -> Dict[str, Any]:
        """Get user's current subscription."""
        result = await db.execute(
            select(Subscription).where(Subscription.user_id == user_id)
        )
        subscription = result.scalar_one_or_none()

        if not subscription:
            return {
                "success": True,
                "subscription": None,
                "plan": SubscriptionPlan.FREE.value,
                "is_active": False,
            }

        return {
            "success": True,
            "subscription": self._subscription_to_dict(subscription),
            "plan": subscription.plan.value,
            "is_active": subscription.is_active,
        }

    async def create_checkout_session(
        self,
        db: AsyncSession,
        user: User,
        success_url: str,
        cancel_url: str,
    ) -> Dict[str, Any]:
        """
        Create a Stripe checkout session for subscription.

        Args:
            db: Database session
            user: User object
            success_url: URL to redirect on success
            cancel_url: URL to redirect on cancel

        Returns:
            Dict with checkout URL or error
        """
        # Check if user already has active subscription
        result = await db.execute(
            select(Subscription).where(
                Subscription.user_id == user.id,
                Subscription.status == SubscriptionStatus.ACTIVE,
            )
        )
        existing = result.scalar_one_or_none()

        if existing and existing.is_active:
            return {
                "success": False,
                "error": "You already have an active subscription",
            }

        # Get or create Stripe customer
        customer_result = await stripe_service.get_or_create_customer(
            email=user.email,
            name=user.name,
            user_id=user.id,
        )

        if not customer_result["success"]:
            return customer_result

        customer_id = customer_result["customer_id"]

        # Update user's Stripe customer ID if we have a subscription record
        if existing:
            existing.stripe_customer_id = customer_id
            await db.commit()

        # Create checkout session
        return await stripe_service.create_subscription_checkout(
            customer_id=customer_id,
            success_url=success_url,
            cancel_url=cancel_url,
            user_id=user.id,
        )

    async def create_valuation_checkout(
        self,
        db: AsyncSession,
        user: User,
        listing_id: int,
        success_url: str,
        cancel_url: str,
    ) -> Dict[str, Any]:
        """
        Create a Stripe checkout session for one-time valuation purchase.

        Args:
            db: Database session
            user: User object
            listing_id: ID of the listing for valuation
            success_url: URL to redirect on success
            cancel_url: URL to redirect on cancel

        Returns:
            Dict with checkout URL or error
        """
        # Check if user already purchased this valuation
        result = await db.execute(
            select(ValuationPurchase).where(
                ValuationPurchase.user_id == user.id,
                ValuationPurchase.listing_id == listing_id,
                ValuationPurchase.status == "completed",
            )
        )
        existing = result.scalar_one_or_none()

        if existing:
            return {
                "success": False,
                "error": "You already purchased this valuation",
            }

        # Check if user has premium subscription (includes valuations)
        sub_result = await self.get_subscription(db, user.id)
        if sub_result.get("plan") in [
            SubscriptionPlan.PREMIUM.value,
            SubscriptionPlan.ENTERPRISE.value,
        ]:
            return {
                "success": False,
                "error": "Your subscription includes unlimited valuations",
            }

        # Get or create Stripe customer
        customer_result = await stripe_service.get_or_create_customer(
            email=user.email,
            name=user.name,
            user_id=user.id,
        )

        if not customer_result["success"]:
            return customer_result

        # Create checkout session
        return await stripe_service.create_valuation_checkout(
            customer_id=customer_result["customer_id"],
            listing_id=listing_id,
            success_url=success_url,
            cancel_url=cancel_url,
            user_id=user.id,
        )

    async def cancel_subscription(
        self,
        db: AsyncSession,
        user_id: int,
        at_period_end: bool = True,
    ) -> Dict[str, Any]:
        """
        Cancel user's subscription.

        Args:
            db: Database session
            user_id: User ID
            at_period_end: If True, cancel at end of billing period

        Returns:
            Dict with result or error
        """
        result = await db.execute(
            select(Subscription).where(Subscription.user_id == user_id)
        )
        subscription = result.scalar_one_or_none()

        if not subscription:
            return {
                "success": False,
                "error": "No subscription found",
            }

        if subscription.status == SubscriptionStatus.CANCELED:
            return {
                "success": False,
                "error": "Subscription is already canceled",
            }

        if not subscription.stripe_subscription_id:
            return {
                "success": False,
                "error": "No Stripe subscription ID found",
            }

        # Cancel in Stripe
        stripe_result = await stripe_service.cancel_subscription(
            subscription.stripe_subscription_id,
            at_period_end=at_period_end,
        )

        if not stripe_result["success"]:
            return stripe_result

        # Update local record
        if at_period_end:
            subscription.cancel_at_period_end = True
        else:
            subscription.status = SubscriptionStatus.CANCELED

        await db.commit()
        await db.refresh(subscription)

        return {
            "success": True,
            "subscription": self._subscription_to_dict(subscription),
            "message": "Subscription will be canceled at the end of the billing period"
            if at_period_end
            else "Subscription canceled immediately",
        }

    async def reactivate_subscription(
        self,
        db: AsyncSession,
        user_id: int,
    ) -> Dict[str, Any]:
        """Reactivate a subscription that was set to cancel."""
        result = await db.execute(
            select(Subscription).where(Subscription.user_id == user_id)
        )
        subscription = result.scalar_one_or_none()

        if not subscription:
            return {
                "success": False,
                "error": "No subscription found",
            }

        if not subscription.cancel_at_period_end:
            return {
                "success": False,
                "error": "Subscription is not set to cancel",
            }

        if not subscription.stripe_subscription_id:
            return {
                "success": False,
                "error": "No Stripe subscription ID found",
            }

        # Reactivate in Stripe
        stripe_result = await stripe_service.reactivate_subscription(
            subscription.stripe_subscription_id
        )

        if not stripe_result["success"]:
            return stripe_result

        # Update local record
        subscription.cancel_at_period_end = False
        await db.commit()
        await db.refresh(subscription)

        return {
            "success": True,
            "subscription": self._subscription_to_dict(subscription),
            "message": "Subscription reactivated",
        }

    async def get_billing_portal_url(
        self,
        db: AsyncSession,
        user_id: int,
        return_url: str,
    ) -> Dict[str, Any]:
        """Get Stripe billing portal URL for self-service management."""
        result = await db.execute(
            select(Subscription).where(Subscription.user_id == user_id)
        )
        subscription = result.scalar_one_or_none()

        if not subscription or not subscription.stripe_customer_id:
            return {
                "success": False,
                "error": "No subscription found",
            }

        return await stripe_service.create_billing_portal_session(
            customer_id=subscription.stripe_customer_id,
            return_url=return_url,
        )

    async def handle_subscription_created(
        self,
        db: AsyncSession,
        stripe_subscription: Any,
    ) -> Dict[str, Any]:
        """Handle subscription.created webhook event."""
        customer_id = stripe_subscription.customer
        subscription_id = stripe_subscription.id

        # Get user ID from metadata
        metadata = stripe_subscription.metadata or {}
        user_id = metadata.get("user_id")

        if not user_id:
            # Try to find user by customer email
            customer = await stripe_service.get_or_create_customer(
                email=stripe_subscription.customer_email or "",
            )
            # This is a fallback - ideally user_id should be in metadata
            logger.warning(f"No user_id in subscription metadata: {subscription_id}")
            return {"success": False, "error": "No user_id in metadata"}

        user_id = int(user_id)

        # Check if subscription record exists
        result = await db.execute(
            select(Subscription).where(Subscription.user_id == user_id)
        )
        subscription = result.scalar_one_or_none()

        current_period_start = datetime.fromtimestamp(
            stripe_subscription.current_period_start
        )
        current_period_end = datetime.fromtimestamp(
            stripe_subscription.current_period_end
        )

        if subscription:
            # Update existing
            subscription.stripe_subscription_id = subscription_id
            subscription.stripe_customer_id = customer_id
            subscription.plan = SubscriptionPlan.PREMIUM  # Default to premium
            subscription.status = SubscriptionStatus.ACTIVE
            subscription.current_period_start = current_period_start
            subscription.current_period_end = current_period_end
            subscription.cancel_at_period_end = False
        else:
            # Create new
            subscription = Subscription(
                user_id=user_id,
                stripe_subscription_id=subscription_id,
                stripe_customer_id=customer_id,
                plan=SubscriptionPlan.PREMIUM,
                status=SubscriptionStatus.ACTIVE,
                current_period_start=current_period_start,
                current_period_end=current_period_end,
            )
            db.add(subscription)

        await db.commit()

        return {"success": True}

    async def handle_subscription_updated(
        self,
        db: AsyncSession,
        stripe_subscription: Any,
    ) -> Dict[str, Any]:
        """Handle subscription.updated webhook event."""
        subscription_id = stripe_subscription.id

        result = await db.execute(
            select(Subscription).where(
                Subscription.stripe_subscription_id == subscription_id
            )
        )
        subscription = result.scalar_one_or_none()

        if not subscription:
            logger.warning(f"Subscription not found for update: {subscription_id}")
            return {"success": False, "error": "Subscription not found"}

        # Update status
        status_map = {
            "active": SubscriptionStatus.ACTIVE,
            "past_due": SubscriptionStatus.PAST_DUE,
            "canceled": SubscriptionStatus.CANCELED,
            "unpaid": SubscriptionStatus.UNPAID,
            "trialing": SubscriptionStatus.TRIALING,
        }

        stripe_status = stripe_subscription.status
        if stripe_status in status_map:
            subscription.status = status_map[stripe_status]

        subscription.current_period_start = datetime.fromtimestamp(
            stripe_subscription.current_period_start
        )
        subscription.current_period_end = datetime.fromtimestamp(
            stripe_subscription.current_period_end
        )
        subscription.cancel_at_period_end = stripe_subscription.cancel_at_period_end

        await db.commit()

        return {"success": True}

    async def handle_subscription_deleted(
        self,
        db: AsyncSession,
        stripe_subscription: Any,
    ) -> Dict[str, Any]:
        """Handle subscription.deleted webhook event."""
        subscription_id = stripe_subscription.id

        result = await db.execute(
            select(Subscription).where(
                Subscription.stripe_subscription_id == subscription_id
            )
        )
        subscription = result.scalar_one_or_none()

        if not subscription:
            logger.warning(f"Subscription not found for delete: {subscription_id}")
            return {"success": False, "error": "Subscription not found"}

        subscription.status = SubscriptionStatus.CANCELED
        await db.commit()

        return {"success": True}

    async def handle_payment_succeeded(
        self,
        db: AsyncSession,
        payment_intent: Any,
    ) -> Dict[str, Any]:
        """Handle payment_intent.succeeded webhook for one-time payments."""
        metadata = payment_intent.metadata or {}

        if metadata.get("type") != "valuation":
            return {"success": True}  # Not a valuation payment

        user_id = metadata.get("user_id")
        listing_id = metadata.get("listing_id")

        if not user_id or not listing_id:
            logger.warning("Missing user_id or listing_id in payment metadata")
            return {"success": False, "error": "Missing metadata"}

        user_id = int(user_id)
        listing_id = int(listing_id)

        # Create valuation purchase record
        purchase = ValuationPurchase(
            user_id=user_id,
            listing_id=listing_id,
            stripe_payment_intent_id=payment_intent.id,
            amount=payment_intent.amount,
            currency=payment_intent.currency,
            status="completed",
        )
        db.add(purchase)
        await db.commit()

        return {"success": True}

    async def has_valuation_access(
        self,
        db: AsyncSession,
        user_id: int,
        listing_id: int,
    ) -> bool:
        """Check if user has access to a valuation."""
        # Check if user has premium subscription
        sub_result = await self.get_subscription(db, user_id)
        if sub_result.get("plan") in [
            SubscriptionPlan.PREMIUM.value,
            SubscriptionPlan.ENTERPRISE.value,
        ]:
            return True

        # Check if user purchased this specific valuation
        result = await db.execute(
            select(ValuationPurchase).where(
                ValuationPurchase.user_id == user_id,
                ValuationPurchase.listing_id == listing_id,
                ValuationPurchase.status == "completed",
            )
        )
        purchase = result.scalar_one_or_none()

        return purchase is not None

    def _subscription_to_dict(self, subscription: Subscription) -> Dict[str, Any]:
        """Convert subscription model to dictionary."""
        return {
            "id": subscription.id,
            "user_id": subscription.user_id,
            "plan": subscription.plan.value,
            "status": subscription.status.value,
            "stripe_subscription_id": subscription.stripe_subscription_id,
            "current_period_start": subscription.current_period_start.isoformat()
            if subscription.current_period_start
            else None,
            "current_period_end": subscription.current_period_end.isoformat()
            if subscription.current_period_end
            else None,
            "cancel_at_period_end": subscription.cancel_at_period_end,
            "is_active": subscription.is_active,
            "created_at": subscription.created_at.isoformat(),
        }


# Singleton instance
subscription_service = SubscriptionService()
