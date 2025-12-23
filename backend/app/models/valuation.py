from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.db.base import Base


class ValuationStatus(str, enum.Enum):
    """Valuation status enumeration."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class Valuation(Base):
    """Business valuation for a listing."""

    __tablename__ = "valuations"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id"), nullable=False, index=True)
    requested_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))

    # Status
    status: Mapped[ValuationStatus] = mapped_column(
        SQLEnum(ValuationStatus), default=ValuationStatus.PENDING, index=True
    )

    # Valuation results
    dcf_value: Mapped[Optional[int]] = mapped_column(Integer)  # DCF valuation in dollars
    comparable_value: Mapped[Optional[int]] = mapped_column(Integer)  # Comparable analysis value
    asset_value: Mapped[Optional[int]] = mapped_column(Integer)  # Asset-based valuation
    recommended_value: Mapped[Optional[int]] = mapped_column(Integer)  # Recommended asking price

    # Value ranges
    value_low: Mapped[Optional[int]] = mapped_column(Integer)
    value_high: Mapped[Optional[int]] = mapped_column(Integer)

    # AI Analysis
    ai_analysis: Mapped[Optional[str]] = mapped_column(Text)  # JSON with detailed analysis
    ai_memo: Mapped[Optional[str]] = mapped_column(Text)  # Generated valuation memo

    # Inputs used
    inputs_used: Mapped[Optional[str]] = mapped_column(Text)  # JSON with input data

    # Methodology notes
    methodology_notes: Mapped[Optional[str]] = mapped_column(Text)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    # Relationships
    listing: Mapped["Listing"] = relationship("Listing", back_populates="valuations")
    requester: Mapped[Optional["User"]] = relationship("User", foreign_keys=[requested_by])

    def __repr__(self) -> str:
        return f"<Valuation(id={self.id}, listing_id={self.listing_id}, status={self.status})>"
