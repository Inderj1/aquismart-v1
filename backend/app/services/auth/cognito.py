from typing import Optional, Dict, Any
import boto3
from botocore.exceptions import ClientError
import hmac
import hashlib
import base64
import logging

from app.config import settings

logger = logging.getLogger(__name__)


class CognitoService:
    """Service for interacting with AWS Cognito."""

    def __init__(self):
        self.client = boto3.client(
            "cognito-idp",
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
        )
        self.user_pool_id = settings.cognito_user_pool_id
        self.client_id = settings.cognito_client_id
        self.client_secret = settings.cognito_client_secret

    def _get_secret_hash(self, username: str) -> str:
        """Calculate secret hash for Cognito requests."""
        if not self.client_secret:
            return ""

        message = username + self.client_id
        dig = hmac.new(
            self.client_secret.encode("utf-8"),
            msg=message.encode("utf-8"),
            digestmod=hashlib.sha256,
        ).digest()
        return base64.b64encode(dig).decode()

    async def sign_up(
        self,
        email: str,
        password: str,
        first_name: str,
        last_name: str,
    ) -> Dict[str, Any]:
        """Register a new user with Cognito."""
        try:
            full_name = f"{first_name} {last_name}"
            user_attributes = [
                {"Name": "email", "Value": email},
                {"Name": "name", "Value": full_name},
                {"Name": "given_name", "Value": first_name},
                {"Name": "family_name", "Value": last_name},
            ]

            params = {
                "ClientId": self.client_id,
                "Username": email,
                "Password": password,
                "UserAttributes": user_attributes,
            }

            if self.client_secret:
                params["SecretHash"] = self._get_secret_hash(email)

            response = self.client.sign_up(**params)

            return {
                "success": True,
                "user_sub": response.get("UserSub"),
                "user_confirmed": response.get("UserConfirmed", False),
            }

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]
            logger.error(f"Cognito sign_up error: {error_code} - {error_message}")

            return {
                "success": False,
                "error_code": error_code,
                "error_message": error_message,
            }

    async def confirm_sign_up(self, email: str, confirmation_code: str) -> Dict[str, Any]:
        """Confirm user registration with verification code."""
        try:
            params = {
                "ClientId": self.client_id,
                "Username": email,
                "ConfirmationCode": confirmation_code,
            }

            if self.client_secret:
                params["SecretHash"] = self._get_secret_hash(email)

            self.client.confirm_sign_up(**params)

            return {"success": True}

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]
            logger.error(f"Cognito confirm_sign_up error: {error_code} - {error_message}")

            return {
                "success": False,
                "error_code": error_code,
                "error_message": error_message,
            }

    async def sign_in(self, email: str, password: str) -> Dict[str, Any]:
        """Authenticate user and get tokens."""
        try:
            params = {
                "ClientId": self.client_id,
                "AuthFlow": "USER_PASSWORD_AUTH",
                "AuthParameters": {
                    "USERNAME": email,
                    "PASSWORD": password,
                },
            }

            if self.client_secret:
                params["AuthParameters"]["SECRET_HASH"] = self._get_secret_hash(email)

            response = self.client.initiate_auth(**params)
            auth_result = response.get("AuthenticationResult", {})

            return {
                "success": True,
                "access_token": auth_result.get("AccessToken"),
                "id_token": auth_result.get("IdToken"),
                "refresh_token": auth_result.get("RefreshToken"),
                "expires_in": auth_result.get("ExpiresIn"),
            }

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]
            logger.error(f"Cognito sign_in error: {error_code} - {error_message}")

            return {
                "success": False,
                "error_code": error_code,
                "error_message": error_message,
            }

    async def refresh_tokens(self, refresh_token: str, email: str) -> Dict[str, Any]:
        """Refresh access and ID tokens."""
        try:
            params = {
                "ClientId": self.client_id,
                "AuthFlow": "REFRESH_TOKEN_AUTH",
                "AuthParameters": {
                    "REFRESH_TOKEN": refresh_token,
                },
            }

            if self.client_secret:
                params["AuthParameters"]["SECRET_HASH"] = self._get_secret_hash(email)

            response = self.client.initiate_auth(**params)
            auth_result = response.get("AuthenticationResult", {})

            return {
                "success": True,
                "access_token": auth_result.get("AccessToken"),
                "id_token": auth_result.get("IdToken"),
                "expires_in": auth_result.get("ExpiresIn"),
            }

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]
            logger.error(f"Cognito refresh_tokens error: {error_code} - {error_message}")

            return {
                "success": False,
                "error_code": error_code,
                "error_message": error_message,
            }

    async def forgot_password(self, email: str) -> Dict[str, Any]:
        """Initiate forgot password flow."""
        try:
            params = {
                "ClientId": self.client_id,
                "Username": email,
            }

            if self.client_secret:
                params["SecretHash"] = self._get_secret_hash(email)

            self.client.forgot_password(**params)

            return {"success": True}

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]
            logger.error(f"Cognito forgot_password error: {error_code} - {error_message}")

            return {
                "success": False,
                "error_code": error_code,
                "error_message": error_message,
            }

    async def confirm_forgot_password(
        self, email: str, confirmation_code: str, new_password: str
    ) -> Dict[str, Any]:
        """Confirm forgot password with code and new password."""
        try:
            params = {
                "ClientId": self.client_id,
                "Username": email,
                "ConfirmationCode": confirmation_code,
                "Password": new_password,
            }

            if self.client_secret:
                params["SecretHash"] = self._get_secret_hash(email)

            self.client.confirm_forgot_password(**params)

            return {"success": True}

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]
            logger.error(f"Cognito confirm_forgot_password error: {error_code} - {error_message}")

            return {
                "success": False,
                "error_code": error_code,
                "error_message": error_message,
            }

    async def get_user(self, access_token: str) -> Dict[str, Any]:
        """Get user info from access token."""
        try:
            response = self.client.get_user(AccessToken=access_token)

            attributes = {}
            for attr in response.get("UserAttributes", []):
                attributes[attr["Name"]] = attr["Value"]

            return {
                "success": True,
                "username": response.get("Username"),
                "attributes": attributes,
            }

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]
            logger.error(f"Cognito get_user error: {error_code} - {error_message}")

            return {
                "success": False,
                "error_code": error_code,
                "error_message": error_message,
            }

    async def sign_out(self, access_token: str) -> Dict[str, Any]:
        """Sign out user (invalidate tokens)."""
        try:
            self.client.global_sign_out(AccessToken=access_token)
            return {"success": True}

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]
            logger.error(f"Cognito sign_out error: {error_code} - {error_message}")

            return {
                "success": False,
                "error_code": error_code,
                "error_message": error_message,
            }


# Singleton instance
cognito_service = CognitoService()
