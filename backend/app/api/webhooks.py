from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from app.db.session import get_db
from app.services.payments import stripe_service, subscription_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="Stripe-Signature"),
    db: AsyncSession = Depends(get_db),
):
    """
    Handle Stripe webhook events.

    Processes subscription and payment events from Stripe.
    """
    if not stripe_signature:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing Stripe-Signature header",
        )

    # Get raw body
    payload = await request.body()

    # Verify and construct event
    result = stripe_service.construct_webhook_event(
        payload=payload,
        sig_header=stripe_signature,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Invalid webhook"),
        )

    event = result["event"]
    event_type = event["type"]

    logger.info(f"Received Stripe webhook: {event_type}")

    try:
        # Handle different event types
        if event_type == "checkout.session.completed":
            session = event["data"]["object"]
            await handle_checkout_completed(db, session)

        elif event_type == "customer.subscription.created":
            subscription = event["data"]["object"]
            await subscription_service.handle_subscription_created(db, subscription)

        elif event_type == "customer.subscription.updated":
            subscription = event["data"]["object"]
            await subscription_service.handle_subscription_updated(db, subscription)

        elif event_type == "customer.subscription.deleted":
            subscription = event["data"]["object"]
            await subscription_service.handle_subscription_deleted(db, subscription)

        elif event_type == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]
            await subscription_service.handle_payment_succeeded(db, payment_intent)

        elif event_type == "payment_intent.payment_failed":
            payment_intent = event["data"]["object"]
            await handle_payment_failed(db, payment_intent)

        elif event_type == "invoice.payment_succeeded":
            invoice = event["data"]["object"]
            await handle_invoice_paid(db, invoice)

        elif event_type == "invoice.payment_failed":
            invoice = event["data"]["object"]
            await handle_invoice_failed(db, invoice)

        else:
            logger.info(f"Unhandled webhook event type: {event_type}")

    except Exception as e:
        logger.error(f"Error handling webhook {event_type}: {e}")
        # Return 200 anyway to prevent Stripe from retrying
        # Log the error for investigation

    return {"received": True}


async def handle_checkout_completed(db: AsyncSession, session: dict):
    """Handle checkout.session.completed event."""
    mode = session.get("mode")
    metadata = session.get("metadata", {})

    logger.info(f"Checkout completed: mode={mode}, metadata={metadata}")

    if mode == "subscription":
        # Subscription checkout - handled by subscription.created event
        pass
    elif mode == "payment":
        # One-time payment - handled by payment_intent.succeeded
        pass


async def handle_payment_failed(db: AsyncSession, payment_intent: dict):
    """Handle payment_intent.payment_failed event."""
    metadata = payment_intent.get("metadata", {})
    logger.warning(f"Payment failed: {payment_intent.get('id')}, metadata={metadata}")
    # TODO: Send notification to user about failed payment


async def handle_invoice_paid(db: AsyncSession, invoice: dict):
    """Handle invoice.payment_succeeded event."""
    subscription_id = invoice.get("subscription")
    logger.info(f"Invoice paid for subscription: {subscription_id}")
    # Subscription status is updated via subscription.updated event


async def handle_invoice_failed(db: AsyncSession, invoice: dict):
    """Handle invoice.payment_failed event."""
    subscription_id = invoice.get("subscription")
    customer_email = invoice.get("customer_email")
    logger.warning(f"Invoice failed for subscription: {subscription_id}")
    # TODO: Send notification to user about failed invoice
