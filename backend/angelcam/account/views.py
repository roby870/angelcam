from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from rest_framework.authentication import BaseAuthentication
from .models import CustomUser
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from angelcam.settings import SECURE_COOKIE


class ExternalTokenAuthentication(BaseAuthentication):
    
    angelcam_api_url = 'https://api.angelcam.com/v1/me'

    def authenticate(self, request):
        token = request.COOKIES.get('token')
        if not token:
            return None
        headers = {
            'Authorization': f'PersonalAccessToken {token}',
            'Accept': 'application/json'
        }  
        response = requests.get(self.angelcam_api_url, headers=headers)
        if response.status_code == 200:
            user = CustomUser(email=response.json().get('email'))
            return (user, token)
        else:
            response = Response(status=response.status_code)
            return response
    

class LoginView(APIView):
    
    angelcam_api_url = 'https://api.angelcam.com/v1/me'  

    def post(self, request):
        token = request.data.get('token')
        headers = {
            'Authorization': f'PersonalAccessToken {token}',
            'Accept': 'application/json'
        }  
        response = requests.get(self.angelcam_api_url, headers=headers)
        if response.status_code == 200:
            email = request.data.get('email')
            if(email == response.json().get('email')):
                try:
                    user = CustomUser.objects.get(email=response.json().get('email'))
                except ObjectDoesNotExist: #regist user
                    user = CustomUser(email = response.json().get('email'))
                    user.save()
                response = JsonResponse({'message': 'Login successful'}, status=200)
                response.set_cookie(
                key = 'token',
                value = token,
                httponly = True,
                secure = SECURE_COOKIE,  #Developent mode with HTTP
                samesite = 'None'
                )
                return response
            else: 
                return Response({'message': 'Missing or invalid authorization.'}, status=401)
        else:
            return Response(status=response.status_code)
        
