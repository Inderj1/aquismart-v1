from typing import Optional, Dict, Any, List
import stripe
import logging

from app.config import settings

logger = logging.getLogger(__name__)

# Configure Stripe
stripe.api_key = settings.stripe_secret_key


class StripeService:
    """Service for interacting with Stripe API."""

    def __init__(self):
        self.webhook_secret = settings.stripe_webhook_secret
        self.subscription_price_id = settings.stripe_price_subscription
        self.valuation_price_id = settings.stripe_price_valuation

    async def create_customer(
        self,
        email: str,
        name: Optional[str] = None,
        metadata: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Create a Stripe customer.

        Args:
            email: Customer email
            name: Customer name
            metadata: Additional metadata

        Returns:
            Dict with customer info or error
        """
        try:
            customer = stripe.Customer.create(
                email=email,
                name=name,
                metadata=metadata or {},
            )

            return {
                "success": True,
                "customer_id": customer.id,
                "customer": customer,
            }

        except stripe.error.StripeError as e:
            logger.error(f"Stripe create_customer error: {e}")
            return {
                "success": False,
                "error": str(e),
            }

    async def get_or_create_customer(
        self,
        email: str,
        name: Optional[str] = None,
        user_id: Optional[int] = None,
    ) -> Dict[str, Any]:
        """Get existing customer by email or create new one."""
        try:
            # Search for existing customer
            customers = stripe.Customer.list(email=email, limit=1)

            if customers.data:
                return {
                    "success": True,
                    "customer_id": customers.data[0].id,
                    "customer": customers.data[0],
                    "created": False,
                }

            # Create new customer
            metadata = {}
            if user_id:
                metadata["user_id"] = str(user_id)

            return await self.create_customer(
                email=email,
                name=name,
                metadata=metadata,
            )

        except stripe.error.StripeError as e:
            logger.error(f"Stripe get_or_create_customer error: {e}")
            return {
                "success": False,
                "error": str(e),
            }

    async def create_checkout_session(
        self,
        customer_id: str,
        price_id: str,
        success_url: str,
        cancel_url: str,
        mode: str = "subscription",
        metadata: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Create a Stripe Checkout session.

        Args:
            customer_id: Stripe customer ID
            price_id: Stripe price ID
            success_url: URL to redirect on success
            cancel_url: URL to redirect on cancel
            mode: "subscription" or "payment"
            metadata: Additional metadata

        Returns:
            Dict with checkout session URL or error
        """
        try:
            session = stripe.checkout.Session.create(
                customer=customer_id,
                payment_method_types=["card"],
                line_items=[
                    {
                        "price": price_id,
                        "quantity": 1,
                    }
                ],
                mode=mode,
                success_url=success_url,
                cancel_url=cancel_url,
                metadata=metadata or {},
            )

            return {
                "success": True,
                "session_id": session.id,
                "checkout_url": session.url,
            }

        except stripe.error.StripeError as e:
            logger.error(f"Stripe create_checkout_session error: {e}")
            return {
                "success": False,
                "error": str(e),
            }

    async def create_subscription_checkout(
        self,
        customer_id: str,
        success_url: str,
        cancel_url: str,
        user_id: int,
    ) -> Dict[str, Any]:
        """Create checkout session for subscription."""
        if not self.subscription_price_id:
            return {
                "success": False,
                "error": "Subscription price not configured",
            }

        return await self.create_checkout_session(
            customer_id=customer_id,
            price_id=self.subscription_price_id,
            success_url=success_url,
            cancel_url=cancel_url,
            mode="subscription",
            metadata={"user_id": str(user_id)},
        )

    async def create_valuation_checkout(
        self,
        customer_id: str,
        listing_id: int,
        success_url: str,
        cancel_url: str,
        user_id: int,
    ) -> Dict[str, Any]:
        """Create checkout session for one-time valuation purchase."""
        if not self.valuation_price_id:
            return {
                "success": False,
                "error": "Valuation price not configured",
            }

        return await self.create_checkout_session(
            customer_id=customer_id,
            price_id=self.valuation_price_id,
            success_url=success_url,
            cancel_url=cancel_url,
            mode="payment",
            metadata={
                "user_id": str(user_id),
                "listing_id": str(listing_id),
                "type": "valuation",
            },
        )

    async def get_subscription(self, subscription_id: str) -> Dict[str, Any]:
        """Get subscription details."""
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            return {
                "success": True,
                "subscription": subscription,
            }

        except stripe.error.StripeError as e:
            logger.error(f"Stripe get_subscription error: {e}")
            return {
                "success": False,
                "error": str(e),
            }

    async def cancel_subscription(
        self,
        subscription_id: str,
        at_period_end: bool = True,
    ) -> Dict[str, Any]:
        """
        Cancel a subscription.

        Args:
            subscription_id: Stripe subscription ID
            at_period_end: If True, cancel at end of billing period

        Returns:
            Dict with updated subscription or error
        """
        try:
            if at_period_end:
                subscription = stripe.Subscription.modify(
                    subscription_id,
                    cancel_at_period_end=True,
                )
            else:
                subscription = stripe.Subscription.delete(subscription_id)

            return {
                "success": True,
                "subscription": subscription,
            }

        except stripe.error.StripeError as e:
            logger.error(f"Stripe cancel_subscription error: {e}")
            return {
                "success": False,
                "error": str(e),
            }

    async def reactivate_subscription(self, subscription_id: str) -> Dict[str, Any]:
        """Reactivate a subscription that was set to cancel at period end."""
        try:
            subscription = stripe.Subscription.modify(
                subscription_id,
                cancel_at_period_end=False,
            )

            return {
                "success": True,
                "subscription": subscription,
            }

        except stripe.error.StripeError as e:
            logger.error(f"Stripe reactivate_subscription error: {e}")
            return {
                "success": False,
                "error": str(e),
            }

    async def get_payment_intent(self, payment_intent_id: str) -> Dict[str, Any]:
        """Get payment intent details."""
        try:
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            return {
                "success": True,
                "payment_intent": payment_intent,
            }

        except stripe.error.StripeError as e:
            logger.error(f"Stripe get_payment_intent error: {e}")
            return {
                "success": False,
                "error": str(e),
            }

    def construct_webhook_event(
        self,
        payload: bytes,
        sig_header: str,
    ) -> Dict[str, Any]:
        """
        Construct and verify a webhook event.

        Args:
            payload: Raw request body
            sig_header: Stripe-Signature header

        Returns:
            Dict with event or error
        """
        if not self.webhook_secret:
            return {
                "success": False,
                "error": "Webhook secret not configured",
            }

        try:
            event = stripe.Webhook.construct_event(
                payload,
                sig_header,
                self.webhook_secret,
            )

            return {
                "success": True,
                "event": event,
            }

        except ValueError as e:
            logger.error(f"Invalid webhook payload: {e}")
            return {
                "success": False,
                "error": "Invalid payload",
            }
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Invalid webhook signature: {e}")
            return {
                "success": False,
                "error": "Invalid signature",
            }

    async def create_billing_portal_session(
        self,
        customer_id: str,
        return_url: str,
    ) -> Dict[str, Any]:
        """Create a billing portal session for customer self-service."""
        try:
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=return_url,
            )

            return {
                "success": True,
                "portal_url": session.url,
            }

        except stripe.error.StripeError as e:
            logger.error(f"Stripe create_billing_portal_session error: {e}")
            return {
                "success": False,
                "error": str(e),
            }


# Singleton instance
stripe_service = StripeService()
