from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class BrowsingHistory(Base):
    """Track user's listing views."""

    __tablename__ = "browsing_history"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id"), nullable=False, index=True)

    # Session info
    session_id: Mapped[Optional[str]] = mapped_column(String(255))

    # Timestamps
    viewed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    listing: Mapped["Listing"] = relationship("Listing", foreign_keys=[listing_id])

    def __repr__(self) -> str:
        return f"<BrowsingHistory(user_id={self.user_id}, listing_id={self.listing_id})>"


class SearchHistory(Base):
    """Track user's search queries for demand analysis."""

    __tablename__ = "search_history"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), index=True)

    # Search details
    query: Mapped[Optional[str]] = mapped_column(String(500))
    filters: Mapped[Optional[str]] = mapped_column(Text)  # JSON with applied filters

    # Results info
    results_count: Mapped[Optional[int]] = mapped_column()

    # Session info
    session_id: Mapped[Optional[str]] = mapped_column(String(255))

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", foreign_keys=[user_id])

    def __repr__(self) -> str:
        return f"<SearchHistory(id={self.id}, query={self.query})>"


class AnalyticsEvent(Base):
    """Generic analytics events for tracking user actions."""

    __tablename__ = "analytics_events"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), index=True)

    # Event info
    event_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    event_data: Mapped[Optional[str]] = mapped_column(Text)  # JSON with event-specific data

    # Context
    page_url: Mapped[Optional[str]] = mapped_column(String(500))
    referrer: Mapped[Optional[str]] = mapped_column(String(500))
    user_agent: Mapped[Optional[str]] = mapped_column(String(500))
    ip_address: Mapped[Optional[str]] = mapped_column(String(50))
    session_id: Mapped[Optional[str]] = mapped_column(String(255))

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", foreign_keys=[user_id])

    def __repr__(self) -> str:
        return f"<AnalyticsEvent(id={self.id}, type={self.event_type})>"
