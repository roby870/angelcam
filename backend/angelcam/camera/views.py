from rest_framework.views import APIView
from rest_framework.response import Response
import requests

class SharedCamerasView(APIView):
    
    angelcam_api_url = 'https://api.angelcam.com/v1/shared-cameras/' 


    def _process_data(self, data):
        selected_data = []
        for item in data.get('results', []):
            name = item.get('name')
            item_id = item.get('id')
            streams = item.get('streams', [])
            mjpeg_url = None
            for stream in streams:
                if stream.get('format') == 'mjpeg':
                    mjpeg_url = stream.get('url')
                    break
            if name and item_id and mjpeg_url:
                selected_data.append({
                    'name': name,
                    'id': item_id,
                    'mjpeg_url': mjpeg_url,
                })
        return selected_data


    def get(self, request):
        auth_header = request.headers.get('Authorization')
        headers = {
            'Authorization': f'{auth_header}',
            'Accept': 'application/json'
        }  
        response = requests.get(self.angelcam_api_url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            selected_data = self._process_data(data)
            return Response(selected_data, status=200)
        elif response.status_code == 400:
            return Response({'message': 'Invalid.'}, status=400)
        elif response.status_code == 401:
            return Response({'message': 'Not authenticated.'}, status=401)
        elif response.status_code == 403:
            return Response({'message': 'Permission denied.'}, status=403)
        else:
            return Response({'message': 'Not found.'}, status=404)
