"""
Login and authentication views.
"""

import requests
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import BaseAuthentication
from angelcam.settings import SECURE_COOKIE
from .models import CustomUser


class ExternalTokenAuthentication(BaseAuthentication):
    """
    Manages the user authentication validating the user token with the angelcam API.

    Attributes:
        angelcam_api_url (str): URL of the angelcam API endpoint to check the user token.
    Methods:
        authenticate (request): Uses the token cookie to check the user token is still valid.
    """

    angelcam_api_url = "https://api.angelcam.com/v1/me"

    def authenticate(self, request):
        token = request.COOKIES.get("token")
        if not token:
            return None
        headers = {
            "Authorization": f"PersonalAccessToken {token}",
            "Accept": "application/json",
        }
        response = requests.get(self.angelcam_api_url, headers=headers, timeout=10)
        if response.status_code == 200:
            user = CustomUser(email=response.json().get("email"))
            return (user, token)
        response = Response(status=response.status_code)
        return response


class LoginView(APIView):
    """
    Manages the user login validating the user token with the angelcam API.

    Attributes:
        angelcam_api_url (str): URL of the angelcam API endpoint to check the user token.
    Methods:
        post(request): logs in the user and stores the user token on a cookie.
    """

    angelcam_api_url = "https://api.angelcam.com/v1/me"

    def post(self, request):
        """
        Login user or rejects the login attempt with an error message.
        Args:
            request: the user request.
        Returns:
            (response | jsonresponse): response with message.
        """
        token = request.data.get("token")
        headers = {
            "Authorization": f"PersonalAccessToken {token}",
            "Accept": "application/json",
        }
        response = requests.get(self.angelcam_api_url, headers=headers, timeout=10)
        if response.status_code == 200:
            email = request.data.get("email")
            if email == response.json().get("email"):
                try:
                    user = CustomUser.objects.get(email=response.json().get("email"))
                except ObjectDoesNotExist:  # regist user
                    user = CustomUser(email=response.json().get("email"))
                    user.save()
                response = JsonResponse({"message": "Login successful"}, status=200)
                response.set_cookie(
                    key="token",
                    value=token,
                    httponly=True,
                    secure=SECURE_COOKIE,  # Developent mode with HTTP
                    samesite="None",
                )
                return response
            return Response(
                {"message": "Missing or invalid authorization."}, status=401
            )
        return Response(status=response.status_code)
