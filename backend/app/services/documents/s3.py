from typing import Optional, Dict, Any, BinaryIO
import uuid
import boto3
from botocore.exceptions import ClientError
import logging

from app.config import settings

logger = logging.getLogger(__name__)


class S3Service:
    """Service for interacting with AWS S3."""

    def __init__(self):
        self.client = boto3.client(
            "s3",
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
        )
        self.bucket = settings.s3_bucket

    def generate_key(
        self,
        listing_id: int,
        filename: str,
        document_type: str,
    ) -> str:
        """Generate a unique S3 key for a document."""
        unique_id = uuid.uuid4().hex[:8]
        # Sanitize filename
        safe_filename = "".join(c for c in filename if c.isalnum() or c in ".-_")
        return f"listings/{listing_id}/{document_type}/{unique_id}_{safe_filename}"

    async def upload_file(
        self,
        file_obj: BinaryIO,
        s3_key: str,
        content_type: Optional[str] = None,
        metadata: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Upload a file to S3.

        Args:
            file_obj: File-like object to upload
            s3_key: The S3 key (path) for the file
            content_type: MIME type of the file
            metadata: Optional metadata to attach to the file

        Returns:
            Dict with success status and file URL or error
        """
        try:
            extra_args = {}
            if content_type:
                extra_args["ContentType"] = content_type
            if metadata:
                extra_args["Metadata"] = metadata

            # Enable server-side encryption
            extra_args["ServerSideEncryption"] = "AES256"

            self.client.upload_fileobj(
                file_obj,
                self.bucket,
                s3_key,
                ExtraArgs=extra_args,
            )

            return {
                "success": True,
                "s3_key": s3_key,
                "bucket": self.bucket,
            }

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]
            logger.error(f"S3 upload error: {error_code} - {error_message}")

            return {
                "success": False,
                "error_code": error_code,
                "error_message": error_message,
            }

    async def download_file(self, s3_key: str) -> Dict[str, Any]:
        """
        Download a file from S3.

        Returns:
            Dict with success status and file bytes or error
        """
        try:
            response = self.client.get_object(Bucket=self.bucket, Key=s3_key)
            body = response["Body"].read()

            return {
                "success": True,
                "body": body,
                "content_type": response.get("ContentType"),
                "metadata": response.get("Metadata", {}),
            }

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]
            logger.error(f"S3 download error: {error_code} - {error_message}")

            return {
                "success": False,
                "error_code": error_code,
                "error_message": error_message,
            }

    async def delete_file(self, s3_key: str) -> Dict[str, Any]:
        """Delete a file from S3."""
        try:
            self.client.delete_object(Bucket=self.bucket, Key=s3_key)
            return {"success": True}

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]
            logger.error(f"S3 delete error: {error_code} - {error_message}")

            return {
                "success": False,
                "error_code": error_code,
                "error_message": error_message,
            }

    async def generate_presigned_url(
        self,
        s3_key: str,
        expiration: int = 3600,
        http_method: str = "GET",
    ) -> Dict[str, Any]:
        """
        Generate a presigned URL for accessing a file.

        Args:
            s3_key: The S3 key of the file
            expiration: URL expiration time in seconds (default 1 hour)
            http_method: GET for download, PUT for upload

        Returns:
            Dict with success status and presigned URL or error
        """
        try:
            client_method = "get_object" if http_method == "GET" else "put_object"

            url = self.client.generate_presigned_url(
                ClientMethod=client_method,
                Params={"Bucket": self.bucket, "Key": s3_key},
                ExpiresIn=expiration,
            )

            return {
                "success": True,
                "url": url,
                "expires_in": expiration,
            }

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]
            logger.error(f"S3 presigned URL error: {error_code} - {error_message}")

            return {
                "success": False,
                "error_code": error_code,
                "error_message": error_message,
            }

    async def file_exists(self, s3_key: str) -> bool:
        """Check if a file exists in S3."""
        try:
            self.client.head_object(Bucket=self.bucket, Key=s3_key)
            return True
        except ClientError:
            return False


# Singleton instance
s3_service = S3Service()
