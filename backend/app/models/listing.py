from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, Integer, Boolean, DateTime, ForeignKey, Enum as SQLEnum, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.db.base import Base


class ListingStatus(str, enum.Enum):
    """Listing status enumeration."""
    DRAFT = "draft"
    PENDING = "pending"
    ACTIVE = "active"
    UNDER_OFFER = "under_offer"
    SOLD = "sold"
    WITHDRAWN = "withdrawn"


class DocumentType(str, enum.Enum):
    """Document type enumeration."""
    FINANCIAL_STATEMENT = "financial_statement"
    TAX_RETURN = "tax_return"
    BANK_STATEMENT = "bank_statement"
    BUSINESS_PLAN = "business_plan"
    LEASE_AGREEMENT = "lease_agreement"
    INVENTORY_LIST = "inventory_list"
    EMPLOYEE_LIST = "employee_list"
    OTHER = "other"


class Listing(Base):
    """Business listing model."""

    __tablename__ = "listings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    seller_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)

    # Basic info
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    industry: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    sub_industry: Mapped[Optional[str]] = mapped_column(String(100))

    # Location
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[Optional[str]] = mapped_column(String(100))
    state: Mapped[Optional[str]] = mapped_column(String(100), index=True)
    country: Mapped[str] = mapped_column(String(100), default="USA")

    # Financial info
    asking_price: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    revenue: Mapped[Optional[int]] = mapped_column(Integer)
    profit: Mapped[Optional[int]] = mapped_column(Integer)
    cash_flow: Mapped[Optional[int]] = mapped_column(Integer)
    ebitda: Mapped[Optional[int]] = mapped_column(Integer)

    # Business details
    year_established: Mapped[Optional[int]] = mapped_column(Integer)
    employees: Mapped[Optional[int]] = mapped_column(Integer)
    reason_for_sale: Mapped[Optional[str]] = mapped_column(String(500))
    business_highlights: Mapped[Optional[str]] = mapped_column(Text)  # JSON array

    # Status and visibility
    status: Mapped[ListingStatus] = mapped_column(
        SQLEnum(ListingStatus), default=ListingStatus.DRAFT, index=True
    )
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    # Keywords for matching (stored as comma-separated or JSON)
    keywords: Mapped[Optional[str]] = mapped_column(Text)  # JSON array

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    # Relationships
    seller: Mapped["User"] = relationship("User", back_populates="listings")
    documents: Mapped[List["ListingDocument"]] = relationship(
        "ListingDocument", back_populates="listing", lazy="selectin"
    )
    saved_by: Mapped[List["SavedListing"]] = relationship(
        "SavedListing", back_populates="listing", lazy="selectin"
    )
    inquiries: Mapped[List["Inquiry"]] = relationship(
        "Inquiry", back_populates="listing", lazy="selectin"
    )
    ndas: Mapped[List["NDA"]] = relationship(
        "NDA", back_populates="listing", lazy="selectin"
    )
    valuations: Mapped[List["Valuation"]] = relationship(
        "Valuation", back_populates="listing", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Listing(id={self.id}, title={self.title}, status={self.status})>"


class ListingDocument(Base):
    """Documents attached to a listing."""

    __tablename__ = "listing_documents"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id"), nullable=False, index=True)

    # Document info
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    document_type: Mapped[DocumentType] = mapped_column(SQLEnum(DocumentType), nullable=False)
    s3_key: Mapped[str] = mapped_column(String(500), nullable=False)
    file_size: Mapped[Optional[int]] = mapped_column(Integer)
    mime_type: Mapped[Optional[str]] = mapped_column(String(100))

    # Access control
    requires_nda: Mapped[bool] = mapped_column(Boolean, default=True)
    is_encrypted: Mapped[bool] = mapped_column(Boolean, default=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    listing: Mapped["Listing"] = relationship("Listing", back_populates="documents")

    def __repr__(self) -> str:
        return f"<ListingDocument(id={self.id}, name={self.name}, type={self.document_type})>"


class SavedListing(Base):
    """User's saved/starred listings."""

    __tablename__ = "saved_listings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id"), nullable=False, index=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="saved_listings")
    listing: Mapped["Listing"] = relationship("Listing", back_populates="saved_by")

    def __repr__(self) -> str:
        return f"<SavedListing(user_id={self.user_id}, listing_id={self.listing_id})>"
