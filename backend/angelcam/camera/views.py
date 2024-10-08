from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from account import views as account_views

class SharedCamerasView(APIView):
    authentication_classes = [account_views.ExternalTokenAuthentication]
    angelcam_api_url = 'https://api.angelcam.com/v1/shared-cameras/' 


    """For performance reasons, we select a mjpeg format (a list of cameras
    rendered all together consume more CPU). If present, we also return hls format
    for an individual, more quality rendering."""
    def _process_data(self, data):
        selected_data = []
        for item in data.get('results', []):
            streams = item.get('streams', [])
            mjpeg_url = None
            hls_url = None
            for stream in streams:
                if stream.get('format') == 'mjpeg':
                    mjpeg_url = stream.get('url')
                elif stream.get('format') == 'hls':
                    hls_url = stream.get('url')
            selected_data.append({
                'name': item.get('name'),
                'id': item.get('id'),
                'mjpeg_url': mjpeg_url,
                'hls_url': hls_url,
                'type': item.get('type'),
                'has_recording': item.get('has_recording')
            })
        return selected_data


    def get(self, request, next_url = None):
        token = request.COOKIES.get('token')
        headers = {
            'Authorization': f'PersonalAccessToken {token}',
            'Accept': 'application/json'
        } 
        if(next_url):
            response = requests.get(next_url, headers=headers)
        else: 
            response = requests.get(self.angelcam_api_url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            selected_data = self._process_data(data)
            response_data = {"results": selected_data, "next": data.get('next')}
            return Response(response_data, status=200) 
        else:
            return Response(status=response.status_code)
