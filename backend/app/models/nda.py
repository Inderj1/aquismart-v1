from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.db.base import Base


class NDAStatus(str, enum.Enum):
    """NDA status enumeration."""
    PENDING = "pending"
    SENT = "sent"
    SIGNED = "signed"
    REJECTED = "rejected"
    EXPIRED = "expired"


class NDA(Base):
    """Non-Disclosure Agreement between buyer and listing."""

    __tablename__ = "ndas"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id"), nullable=False, index=True)
    buyer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)

    # NDA info
    status: Mapped[NDAStatus] = mapped_column(
        SQLEnum(NDAStatus), default=NDAStatus.PENDING, index=True
    )

    # Document URLs
    document_url: Mapped[Optional[str]] = mapped_column(String(500))
    signed_document_url: Mapped[Optional[str]] = mapped_column(String(500))

    # Buyer info at time of signing
    buyer_name: Mapped[Optional[str]] = mapped_column(String(255))
    buyer_company: Mapped[Optional[str]] = mapped_column(String(255))
    buyer_email: Mapped[Optional[str]] = mapped_column(String(255))

    # IP and audit trail
    signed_ip: Mapped[Optional[str]] = mapped_column(String(50))

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    signed_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    # Relationships
    listing: Mapped["Listing"] = relationship("Listing", back_populates="ndas")
    buyer: Mapped["User"] = relationship("User", foreign_keys=[buyer_id])

    def __repr__(self) -> str:
        return f"<NDA(id={self.id}, listing_id={self.listing_id}, status={self.status})>"

    @property
    def is_valid(self) -> bool:
        """Check if NDA is currently valid (signed and not expired)."""
        if self.status != NDAStatus.SIGNED:
            return False
        if self.expires_at and datetime.utcnow() > self.expires_at:
            return False
        return True
