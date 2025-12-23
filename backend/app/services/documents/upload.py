from typing import Optional, Dict, Any, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

from app.models.listing import Listing, ListingDocument, DocumentType
from app.models.nda import NDA, NDAStatus
from app.models.user import User
from app.services.documents.s3 import s3_service

logger = logging.getLogger(__name__)

# Maximum file size: 50MB
MAX_FILE_SIZE = 50 * 1024 * 1024

# Allowed MIME types
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/tiff",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",  # xlsx
    "application/vnd.ms-excel",  # xls
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  # docx
    "application/msword",  # doc
    "text/csv",
}


class DocumentService:
    """Service for managing listing documents."""

    async def upload_document(
        self,
        db: AsyncSession,
        listing_id: int,
        user_id: int,
        file_content: bytes,
        filename: str,
        document_type: DocumentType,
        content_type: str,
        requires_nda: bool = True,
    ) -> Dict[str, Any]:
        """
        Upload a document for a listing.

        Args:
            db: Database session
            listing_id: ID of the listing
            user_id: ID of the user (must be seller/owner)
            file_content: File content as bytes
            filename: Original filename
            document_type: Type of document
            content_type: MIME type
            requires_nda: Whether NDA is required to view this document

        Returns:
            Dict with success status and document info or error
        """
        # Validate file size
        file_size = len(file_content)
        if file_size > MAX_FILE_SIZE:
            return {
                "success": False,
                "error": f"File size exceeds maximum allowed ({MAX_FILE_SIZE // (1024*1024)}MB)",
            }

        # Validate MIME type
        if content_type not in ALLOWED_MIME_TYPES:
            return {
                "success": False,
                "error": f"File type not allowed: {content_type}",
            }

        # Verify listing exists and user is owner
        result = await db.execute(select(Listing).where(Listing.id == listing_id))
        listing = result.scalar_one_or_none()

        if not listing:
            return {
                "success": False,
                "error": "Listing not found",
            }

        if listing.seller_id != user_id:
            return {
                "success": False,
                "error": "You don't have permission to upload documents to this listing",
            }

        # Generate S3 key
        s3_key = s3_service.generate_key(
            listing_id=listing_id,
            filename=filename,
            document_type=document_type.value,
        )

        # Upload to S3
        from io import BytesIO
        file_obj = BytesIO(file_content)

        upload_result = await s3_service.upload_file(
            file_obj=file_obj,
            s3_key=s3_key,
            content_type=content_type,
            metadata={
                "listing_id": str(listing_id),
                "document_type": document_type.value,
                "original_filename": filename,
            },
        )

        if not upload_result["success"]:
            return {
                "success": False,
                "error": f"Failed to upload file: {upload_result.get('error_message', 'Unknown error')}",
            }

        # Create document record in database
        document = ListingDocument(
            listing_id=listing_id,
            name=filename,
            document_type=document_type,
            s3_key=s3_key,
            file_size=file_size,
            mime_type=content_type,
            requires_nda=requires_nda,
            is_encrypted=True,  # S3 server-side encryption
        )
        db.add(document)
        await db.commit()
        await db.refresh(document)

        return {
            "success": True,
            "document": {
                "id": document.id,
                "name": document.name,
                "document_type": document.document_type.value,
                "file_size": document.file_size,
                "requires_nda": document.requires_nda,
                "created_at": document.created_at.isoformat(),
            },
        }

    async def get_document(
        self,
        db: AsyncSession,
        document_id: int,
        user: User,
    ) -> Dict[str, Any]:
        """
        Get a document with access control.

        Args:
            db: Database session
            document_id: ID of the document
            user: Current user requesting the document

        Returns:
            Dict with success status and presigned URL or error
        """
        # Get document
        result = await db.execute(
            select(ListingDocument).where(ListingDocument.id == document_id)
        )
        document = result.scalar_one_or_none()

        if not document:
            return {
                "success": False,
                "error": "Document not found",
            }

        # Get listing to check ownership
        result = await db.execute(
            select(Listing).where(Listing.id == document.listing_id)
        )
        listing = result.scalar_one_or_none()

        if not listing:
            return {
                "success": False,
                "error": "Listing not found",
            }

        # Check access permissions
        is_owner = listing.seller_id == user.id

        if not is_owner and document.requires_nda:
            # Check if user has signed NDA
            has_access = await self.check_nda_access(
                db=db,
                listing_id=listing.id,
                user_id=user.id,
            )
            if not has_access:
                return {
                    "success": False,
                    "error": "NDA required to access this document",
                    "requires_nda": True,
                }

        # Generate presigned URL
        url_result = await s3_service.generate_presigned_url(
            s3_key=document.s3_key,
            expiration=3600,  # 1 hour
        )

        if not url_result["success"]:
            return {
                "success": False,
                "error": "Failed to generate download URL",
            }

        return {
            "success": True,
            "document": {
                "id": document.id,
                "name": document.name,
                "document_type": document.document_type.value,
                "file_size": document.file_size,
                "mime_type": document.mime_type,
            },
            "download_url": url_result["url"],
            "expires_in": url_result["expires_in"],
        }

    async def delete_document(
        self,
        db: AsyncSession,
        document_id: int,
        user_id: int,
    ) -> Dict[str, Any]:
        """
        Delete a document (owner only).

        Args:
            db: Database session
            document_id: ID of the document
            user_id: ID of the user (must be owner)

        Returns:
            Dict with success status or error
        """
        # Get document
        result = await db.execute(
            select(ListingDocument).where(ListingDocument.id == document_id)
        )
        document = result.scalar_one_or_none()

        if not document:
            return {
                "success": False,
                "error": "Document not found",
            }

        # Get listing to check ownership
        result = await db.execute(
            select(Listing).where(Listing.id == document.listing_id)
        )
        listing = result.scalar_one_or_none()

        if not listing or listing.seller_id != user_id:
            return {
                "success": False,
                "error": "You don't have permission to delete this document",
            }

        # Delete from S3
        delete_result = await s3_service.delete_file(document.s3_key)
        if not delete_result["success"]:
            logger.warning(f"Failed to delete S3 object: {document.s3_key}")
            # Continue with database deletion anyway

        # Delete from database
        await db.delete(document)
        await db.commit()

        return {"success": True}

    async def list_documents(
        self,
        db: AsyncSession,
        listing_id: int,
        user: User,
    ) -> Dict[str, Any]:
        """
        List all documents for a listing.

        Args:
            db: Database session
            listing_id: ID of the listing
            user: Current user

        Returns:
            Dict with list of documents (some may be restricted)
        """
        # Get listing
        result = await db.execute(select(Listing).where(Listing.id == listing_id))
        listing = result.scalar_one_or_none()

        if not listing:
            return {
                "success": False,
                "error": "Listing not found",
            }

        # Get documents
        result = await db.execute(
            select(ListingDocument).where(ListingDocument.listing_id == listing_id)
        )
        documents = result.scalars().all()

        # Check NDA access
        is_owner = listing.seller_id == user.id
        has_nda_access = is_owner or await self.check_nda_access(
            db=db,
            listing_id=listing_id,
            user_id=user.id,
        )

        document_list = []
        for doc in documents:
            doc_info = {
                "id": doc.id,
                "name": doc.name,
                "document_type": doc.document_type.value,
                "file_size": doc.file_size,
                "requires_nda": doc.requires_nda,
                "created_at": doc.created_at.isoformat(),
            }

            # Mark as accessible or restricted
            if doc.requires_nda and not has_nda_access:
                doc_info["accessible"] = False
                doc_info["reason"] = "NDA required"
            else:
                doc_info["accessible"] = True

            document_list.append(doc_info)

        return {
            "success": True,
            "documents": document_list,
            "has_nda_access": has_nda_access,
        }

    async def check_nda_access(
        self,
        db: AsyncSession,
        listing_id: int,
        user_id: int,
    ) -> bool:
        """Check if user has signed NDA for a listing."""
        result = await db.execute(
            select(NDA).where(
                NDA.listing_id == listing_id,
                NDA.buyer_id == user_id,
                NDA.status == NDAStatus.SIGNED,
            )
        )
        nda = result.scalar_one_or_none()
        return nda is not None and nda.is_valid


# Singleton instance
document_service = DocumentService()
