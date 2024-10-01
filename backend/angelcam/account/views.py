from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import CustomUser
from django.core.exceptions import ObjectDoesNotExist



class ExternalTokenAuthentication(BaseAuthentication):
    
    angelcam_api_url = 'https://api.angelcam.com/v1/me'

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        try:
            token_type, token = auth_header.split(' ')
        except ValueError:
            raise AuthenticationFailed('Invalid token header. No credentials provided.')
        if token_type.lower() != 'personalaccesstoken':
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
            return Response(status=response.status_code)

    

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
                return Response({'message': 'Login successful'}, status=200)
            else: 
                return Response({'message': 'Missing or invalid authorization.'}, status=401)
        else:
            return Response(status=response.status_code)
