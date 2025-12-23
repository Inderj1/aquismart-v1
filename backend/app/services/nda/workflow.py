from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

from app.models.nda import NDA, NDAStatus
from app.models.listing import Listing
from app.models.user import User

logger = logging.getLogger(__name__)

# NDA validity period (days)
NDA_VALIDITY_DAYS = 365


class NDAService:
    """Service for managing NDA workflow."""

    async def request_nda(
        self,
        db: AsyncSession,
        listing_id: int,
        buyer_id: int,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Request NDA access for a listing.

        Args:
            db: Database session
            listing_id: ID of the listing
            buyer_id: ID of the buyer requesting NDA
            ip_address: Client IP address
            user_agent: Client user agent

        Returns:
            Dict with success status and NDA info or error
        """
        # Check if listing exists
        result = await db.execute(select(Listing).where(Listing.id == listing_id))
        listing = result.scalar_one_or_none()

        if not listing:
            return {
                "success": False,
                "error": "Listing not found",
            }

        # Check if buyer is not the seller
        if listing.seller_id == buyer_id:
            return {
                "success": False,
                "error": "Sellers cannot request NDA for their own listings",
            }

        # Check if NDA already exists
        result = await db.execute(
            select(NDA).where(
                NDA.listing_id == listing_id,
                NDA.buyer_id == buyer_id,
            )
        )
        existing_nda = result.scalar_one_or_none()

        if existing_nda:
            if existing_nda.status == NDAStatus.SIGNED and existing_nda.is_valid:
                return {
                    "success": True,
                    "nda": self._nda_to_dict(existing_nda),
                    "message": "NDA already signed and valid",
                }
            elif existing_nda.status in [NDAStatus.PENDING, NDAStatus.SENT]:
                return {
                    "success": True,
                    "nda": self._nda_to_dict(existing_nda),
                    "message": "NDA request already pending",
                }
            elif existing_nda.status == NDAStatus.EXPIRED:
                # Allow re-requesting if expired
                existing_nda.status = NDAStatus.PENDING
                existing_nda.requested_at = datetime.utcnow()
                existing_nda.ip_address = ip_address
                existing_nda.user_agent = user_agent
                await db.commit()
                await db.refresh(existing_nda)

                return {
                    "success": True,
                    "nda": self._nda_to_dict(existing_nda),
                    "message": "NDA request renewed",
                }
            elif existing_nda.status == NDAStatus.REJECTED:
                return {
                    "success": False,
                    "error": "Previous NDA request was rejected",
                }

        # Create new NDA request
        nda = NDA(
            listing_id=listing_id,
            buyer_id=buyer_id,
            status=NDAStatus.PENDING,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        db.add(nda)
        await db.commit()
        await db.refresh(nda)

        # TODO: Send notification to seller about NDA request

        return {
            "success": True,
            "nda": self._nda_to_dict(nda),
            "message": "NDA request submitted successfully",
        }

    async def send_nda(
        self,
        db: AsyncSession,
        nda_id: int,
        seller_id: int,
        document_url: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Seller sends NDA document to buyer.

        Args:
            db: Database session
            nda_id: ID of the NDA
            seller_id: ID of the seller (for authorization)
            document_url: Optional URL to NDA document

        Returns:
            Dict with success status and NDA info or error
        """
        # Get NDA
        result = await db.execute(select(NDA).where(NDA.id == nda_id))
        nda = result.scalar_one_or_none()

        if not nda:
            return {
                "success": False,
                "error": "NDA not found",
            }

        # Verify seller owns the listing
        result = await db.execute(select(Listing).where(Listing.id == nda.listing_id))
        listing = result.scalar_one_or_none()

        if not listing or listing.seller_id != seller_id:
            return {
                "success": False,
                "error": "You don't have permission to manage this NDA",
            }

        if nda.status != NDAStatus.PENDING:
            return {
                "success": False,
                "error": f"NDA is not in pending status (current: {nda.status.value})",
            }

        # Update NDA status
        nda.status = NDAStatus.SENT
        nda.sent_at = datetime.utcnow()
        if document_url:
            nda.document_url = document_url

        await db.commit()
        await db.refresh(nda)

        # TODO: Send email notification to buyer

        return {
            "success": True,
            "nda": self._nda_to_dict(nda),
            "message": "NDA sent to buyer",
        }

    async def sign_nda(
        self,
        db: AsyncSession,
        nda_id: int,
        buyer_id: int,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        signed_document_url: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Buyer signs the NDA.

        Args:
            db: Database session
            nda_id: ID of the NDA
            buyer_id: ID of the buyer (for authorization)
            ip_address: Client IP for audit
            user_agent: Client user agent for audit
            signed_document_url: Optional URL to signed document

        Returns:
            Dict with success status and NDA info or error
        """
        # Get NDA
        result = await db.execute(select(NDA).where(NDA.id == nda_id))
        nda = result.scalar_one_or_none()

        if not nda:
            return {
                "success": False,
                "error": "NDA not found",
            }

        if nda.buyer_id != buyer_id:
            return {
                "success": False,
                "error": "You don't have permission to sign this NDA",
            }

        if nda.status == NDAStatus.SIGNED and nda.is_valid:
            return {
                "success": True,
                "nda": self._nda_to_dict(nda),
                "message": "NDA already signed",
            }

        if nda.status not in [NDAStatus.PENDING, NDAStatus.SENT]:
            return {
                "success": False,
                "error": f"NDA cannot be signed in current status ({nda.status.value})",
            }

        # Sign the NDA
        nda.status = NDAStatus.SIGNED
        nda.signed_at = datetime.utcnow()
        nda.expires_at = datetime.utcnow() + timedelta(days=NDA_VALIDITY_DAYS)
        nda.ip_address = ip_address
        nda.user_agent = user_agent
        if signed_document_url:
            nda.signed_document_url = signed_document_url

        await db.commit()
        await db.refresh(nda)

        # TODO: Send email notification to seller

        return {
            "success": True,
            "nda": self._nda_to_dict(nda),
            "message": "NDA signed successfully. You now have access to financial documents.",
        }

    async def reject_nda(
        self,
        db: AsyncSession,
        nda_id: int,
        seller_id: int,
        reason: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Seller rejects NDA request.

        Args:
            db: Database session
            nda_id: ID of the NDA
            seller_id: ID of the seller (for authorization)
            reason: Optional rejection reason

        Returns:
            Dict with success status or error
        """
        # Get NDA
        result = await db.execute(select(NDA).where(NDA.id == nda_id))
        nda = result.scalar_one_or_none()

        if not nda:
            return {
                "success": False,
                "error": "NDA not found",
            }

        # Verify seller owns the listing
        result = await db.execute(select(Listing).where(Listing.id == nda.listing_id))
        listing = result.scalar_one_or_none()

        if not listing or listing.seller_id != seller_id:
            return {
                "success": False,
                "error": "You don't have permission to manage this NDA",
            }

        if nda.status not in [NDAStatus.PENDING, NDAStatus.SENT]:
            return {
                "success": False,
                "error": f"NDA cannot be rejected in current status ({nda.status.value})",
            }

        nda.status = NDAStatus.REJECTED

        await db.commit()

        # TODO: Send email notification to buyer with reason

        return {
            "success": True,
            "message": "NDA request rejected",
        }

    async def get_nda(
        self,
        db: AsyncSession,
        nda_id: int,
        user_id: int,
    ) -> Dict[str, Any]:
        """Get NDA details."""
        result = await db.execute(select(NDA).where(NDA.id == nda_id))
        nda = result.scalar_one_or_none()

        if not nda:
            return {
                "success": False,
                "error": "NDA not found",
            }

        # Check if user is buyer or seller
        result = await db.execute(select(Listing).where(Listing.id == nda.listing_id))
        listing = result.scalar_one_or_none()

        if nda.buyer_id != user_id and (not listing or listing.seller_id != user_id):
            return {
                "success": False,
                "error": "You don't have access to this NDA",
            }

        return {
            "success": True,
            "nda": self._nda_to_dict(nda),
        }

    async def list_ndas(
        self,
        db: AsyncSession,
        user_id: int,
        as_seller: bool = False,
        listing_id: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        List NDAs for a user.

        Args:
            db: Database session
            user_id: ID of the user
            as_seller: If True, list NDAs for listings owned by user
            listing_id: Optional filter by listing

        Returns:
            Dict with list of NDAs
        """
        if as_seller:
            # Get listings owned by user
            listings_result = await db.execute(
                select(Listing.id).where(Listing.seller_id == user_id)
            )
            listing_ids = [l[0] for l in listings_result.fetchall()]

            if not listing_ids:
                return {"success": True, "ndas": []}

            query = select(NDA).where(NDA.listing_id.in_(listing_ids))
            if listing_id and listing_id in listing_ids:
                query = select(NDA).where(NDA.listing_id == listing_id)
        else:
            query = select(NDA).where(NDA.buyer_id == user_id)
            if listing_id:
                query = query.where(NDA.listing_id == listing_id)

        result = await db.execute(query.order_by(NDA.requested_at.desc()))
        ndas = result.scalars().all()

        return {
            "success": True,
            "ndas": [self._nda_to_dict(nda) for nda in ndas],
        }

    async def check_access(
        self,
        db: AsyncSession,
        listing_id: int,
        user_id: int,
    ) -> bool:
        """Check if user has valid NDA access to a listing."""
        result = await db.execute(
            select(NDA).where(
                NDA.listing_id == listing_id,
                NDA.buyer_id == user_id,
                NDA.status == NDAStatus.SIGNED,
            )
        )
        nda = result.scalar_one_or_none()
        return nda is not None and nda.is_valid

    def _nda_to_dict(self, nda: NDA) -> Dict[str, Any]:
        """Convert NDA model to dictionary."""
        return {
            "id": nda.id,
            "listing_id": nda.listing_id,
            "buyer_id": nda.buyer_id,
            "status": nda.status.value,
            "document_url": nda.document_url,
            "signed_document_url": nda.signed_document_url,
            "requested_at": nda.requested_at.isoformat() if nda.requested_at else None,
            "sent_at": nda.sent_at.isoformat() if nda.sent_at else None,
            "signed_at": nda.signed_at.isoformat() if nda.signed_at else None,
            "expires_at": nda.expires_at.isoformat() if nda.expires_at else None,
            "is_valid": nda.is_valid,
        }


# Singleton instance
nda_service = NDAService()
