from rest_framework.views import APIView
from rest_framework.response import Response
import requests


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
                request.session['personal_access_token'] = token
                return Response({'message': 'Login successful'}, status=200)
            else: 
                return Response({'message': 'Missing or invalid authorization.'}, status=401)
        elif response.status_code == 401:
            return Response({'message': 'Missing or invalid authorization.'}, status=401)
        else: 
            return Response({'message': 'Missing permission.'}, status=403)
