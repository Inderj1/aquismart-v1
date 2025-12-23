from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.db.base import Base


class UserRole(str, enum.Enum):
    """User role enumeration."""
    BUYER = "buyer"
    SELLER = "seller"
    ADMIN = "admin"


class User(Base):
    """User model for buyers, sellers, and admins."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    cognito_sub: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[Optional[str]] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole, values_callable=lambda x: [e.value for e in x]),
        default=UserRole.BUYER
    )
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Profile fields
    phone: Mapped[Optional[str]] = mapped_column(String(50))
    company: Mapped[Optional[str]] = mapped_column(String(255))
    bio: Mapped[Optional[str]] = mapped_column(String(1000))
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500))

    # Buyer-specific fields
    industries_of_interest: Mapped[Optional[str]] = mapped_column(String(500))  # JSON array
    location_preferences: Mapped[Optional[str]] = mapped_column(String(500))  # JSON array
    budget_min: Mapped[Optional[int]] = mapped_column()
    budget_max: Mapped[Optional[int]] = mapped_column()

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    # Relationships
    listings: Mapped[List["Listing"]] = relationship(
        "Listing", back_populates="seller", lazy="selectin"
    )
    saved_listings: Mapped[List["SavedListing"]] = relationship(
        "SavedListing", back_populates="user", lazy="selectin"
    )
    subscriptions: Mapped[List["Subscription"]] = relationship(
        "Subscription", back_populates="user", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
