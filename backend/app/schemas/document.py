from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

from app.models.listing import DocumentType


class DocumentUploadResponse(BaseModel):
    """Response for document upload."""

    id: int
    name: str
    document_type: str
    file_size: int
    requires_nda: bool
    created_at: str


class DocumentResponse(BaseModel):
    """Response for document details."""

    id: int
    name: str
    document_type: str
    file_size: int
    mime_type: Optional[str] = None
    requires_nda: bool
    accessible: bool = True
    reason: Optional[str] = None
    created_at: str

    class Config:
        from_attributes = True


class DocumentDownloadResponse(BaseModel):
    """Response for document download request."""

    id: int
    name: str
    document_type: str
    file_size: int
    mime_type: Optional[str] = None
    download_url: str
    expires_in: int


class DocumentListResponse(BaseModel):
    """Response for listing documents."""

    documents: List[DocumentResponse]
    has_nda_access: bool
