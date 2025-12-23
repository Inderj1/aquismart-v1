from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

from app.models.nda import NDAStatus


class NDARequestCreate(BaseModel):
    """Request to initiate NDA."""

    listing_id: int


class NDASignRequest(BaseModel):
    """Request to sign NDA."""

    signed_document_url: Optional[str] = None


class NDASendRequest(BaseModel):
    """Request to send NDA document."""

    document_url: Optional[str] = None


class NDARejectRequest(BaseModel):
    """Request to reject NDA."""

    reason: Optional[str] = None


class NDAResponse(BaseModel):
    """Response with NDA details."""

    id: int
    listing_id: int
    buyer_id: int
    status: str
    document_url: Optional[str] = None
    signed_document_url: Optional[str] = None
    requested_at: Optional[str] = None
    sent_at: Optional[str] = None
    signed_at: Optional[str] = None
    expires_at: Optional[str] = None
    is_valid: bool


class NDAListResponse(BaseModel):
    """Response with list of NDAs."""

    ndas: List[NDAResponse]


class NDAStatusResponse(BaseModel):
    """Response with NDA status check."""

    has_access: bool
    nda: Optional[NDAResponse] = None


class FinancialDataResponse(BaseModel):
    """Response with financial data after NDA verification."""

    listing_id: int
    revenue: Optional[int] = None
    profit: Optional[int] = None
    cash_flow: Optional[int] = None
    ebitda: Optional[int] = None
    year_established: Optional[int] = None
    employees: Optional[int] = None
