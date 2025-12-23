from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.db.base import Base


class InquiryStatus(str, enum.Enum):
    """Inquiry status enumeration."""
    OPEN = "open"
    RESPONDED = "responded"
    CLOSED = "closed"


class Inquiry(Base):
    """Inquiry/conversation between buyer and seller."""

    __tablename__ = "inquiries"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id"), nullable=False, index=True)
    buyer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)

    # Inquiry info
    subject: Mapped[Optional[str]] = mapped_column(String(255))
    status: Mapped[InquiryStatus] = mapped_column(
        SQLEnum(InquiryStatus), default=InquiryStatus.OPEN, index=True
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    last_message_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    # Relationships
    listing: Mapped["Listing"] = relationship("Listing", back_populates="inquiries")
    buyer: Mapped["User"] = relationship("User", foreign_keys=[buyer_id])
    messages: Mapped[List["InquiryMessage"]] = relationship(
        "InquiryMessage", back_populates="inquiry", lazy="selectin", order_by="InquiryMessage.created_at"
    )

    def __repr__(self) -> str:
        return f"<Inquiry(id={self.id}, listing_id={self.listing_id}, status={self.status})>"


class InquiryMessage(Base):
    """Individual message in an inquiry thread."""

    __tablename__ = "inquiry_messages"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    inquiry_id: Mapped[int] = mapped_column(ForeignKey("inquiries.id"), nullable=False, index=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    # Message content
    message: Mapped[str] = mapped_column(Text, nullable=False)

    # Read status
    is_read: Mapped[bool] = mapped_column(default=False)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    inquiry: Mapped["Inquiry"] = relationship("Inquiry", back_populates="messages")
    sender: Mapped["User"] = relationship("User", foreign_keys=[sender_id])

    def __repr__(self) -> str:
        return f"<InquiryMessage(id={self.id}, inquiry_id={self.inquiry_id})>"
