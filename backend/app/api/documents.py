from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.models.listing import DocumentType
from app.api.deps import get_current_user, get_current_active_seller
from app.services.documents import document_service
from app.schemas.document import (
    DocumentUploadResponse,
    DocumentDownloadResponse,
    DocumentListResponse,
)

router = APIRouter()


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    listing_id: int = Form(..., description="ID of the listing"),
    document_type: DocumentType = Form(..., description="Type of document"),
    requires_nda: bool = Form(True, description="Whether NDA is required to view"),
    file: UploadFile = File(..., description="Document file to upload"),
    current_user: User = Depends(get_current_active_seller),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload a document for a listing (seller only).

    Supported file types: PDF, JPEG, PNG, TIFF, Excel, Word, CSV.
    Maximum file size: 50MB.

    Documents are encrypted at rest in S3.
    """
    # Read file content
    file_content = await file.read()

    result = await document_service.upload_document(
        db=db,
        listing_id=listing_id,
        user_id=current_user.id,
        file_content=file_content,
        filename=file.filename or "document",
        document_type=document_type,
        content_type=file.content_type or "application/octet-stream",
        requires_nda=requires_nda,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Upload failed"),
        )

    doc = result["document"]
    return DocumentUploadResponse(
        id=doc["id"],
        name=doc["name"],
        document_type=doc["document_type"],
        file_size=doc["file_size"],
        requires_nda=doc["requires_nda"],
        created_at=doc["created_at"],
    )


@router.get("/{document_id}", response_model=DocumentDownloadResponse)
async def get_document(
    document_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    Get a document with download URL.

    Returns a presigned URL for downloading the document.
    If the document requires NDA, the user must have signed one.
    """
    result = await document_service.get_document(
        db=db,
        document_id=document_id,
        user=current_user,
    )

    if not result["success"]:
        if result.get("requires_nda"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="NDA required to access this document",
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.get("error", "Document not found"),
        )

    doc = result["document"]
    return DocumentDownloadResponse(
        id=doc["id"],
        name=doc["name"],
        document_type=doc["document_type"],
        file_size=doc["file_size"],
        mime_type=doc.get("mime_type"),
        download_url=result["download_url"],
        expires_in=result["expires_in"],
    )


@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user: Annotated[User, Depends(get_current_active_seller)],
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a document (owner only).
    """
    result = await document_service.delete_document(
        db=db,
        document_id=document_id,
        user_id=current_user.id,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Delete failed"),
        )

    return {"message": "Document deleted successfully"}


@router.get("/listing/{listing_id}", response_model=DocumentListResponse)
async def list_listing_documents(
    listing_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """
    List all documents for a listing.

    Returns document metadata with accessibility info.
    Documents requiring NDA will be marked as inaccessible if user hasn't signed.
    """
    result = await document_service.list_documents(
        db=db,
        listing_id=listing_id,
        user=current_user,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.get("error", "Listing not found"),
        )

    return DocumentListResponse(
        documents=result["documents"],
        has_nda_access=result["has_nda_access"],
    )
