from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from datetime import datetime, timedelta


"""
si retention es null, no hay nada grabado. Si no es null, chequear que
recording_start y recording_end tampoco estén en null, si está alguno en null
hay que ver de usar el dato de retention para sacar la diferencia entre el dato que no está en null
y la retention y en base a eso calcular cual es el start o el fin
"""
class RecordingDaysView(APIView):
    
    angelcam_recording_url = 'https://api.angelcam.com/v1/shared-cameras/{}/recording/'


    def _split_up_by_days(self, data):
        recording_start = datetime.fromisoformat(data["recording_start"].replace('Z', '+00:00'))
        recording_end = datetime.fromisoformat(data["recording_end"].replace('Z', '+00:00'))
        one_day = timedelta(days=1)
        intervals = []
        current_start = recording_start
        while current_start < recording_end:
            current_end = current_start + one_day
            if current_end > recording_end:
                current_end = recording_end
            intervals.append({
                "recording_start": current_start.isoformat().replace('+00:00', '').replace('T', ' '),
                "recording_end": current_end.isoformat().replace('+00:00', '').replace('T', ' ')
            })
            current_start = current_end
        return intervals


    def get(self, request, id):
        auth_header = request.headers.get('Authorization')
        headers = {
            'Authorization': f'{auth_header}',
            'Accept': 'application/json'
        }  
        response = requests.get(self.angelcam_recording_url.format(id), headers=headers)
        intervals = self._split_up_by_days(response.json())
        return Response(intervals, status=200)
    

class RecordingClipsView(APIView):

    angelcam_timeline_url = 'https://api.angelcam.com/v1/shared-cameras/{}/recording/timeline/?start={}&end={}'
    
    
    def _format_segments(self, segments):
        formatted_segments = []
        for segment in segments:
            segment["start"] = segment["start"].replace('Z', '').replace('T', ' ')
            segment["end"] = segment["end"].replace('Z', '').replace('T', ' ')
            formatted_segments.append(segment)
        return formatted_segments


    def get(self, request, id, start, end):
        auth_header = request.headers.get('Authorization')
        headers = {
            'Authorization': f'{auth_header}',
            'Accept': 'application/json'
        }  
        response = requests.get(self.angelcam_timeline_url.format(id, start, end), headers=headers)
        formatted_segments = self._format_segments(response.json().get('segments', []))
        return Response(formatted_segments, status=200) 
    

class RecordingStreamView(APIView):

    angelcam_stream_url = 'https://api.angelcam.com/v1/shared-cameras/{}/recording/stream/?start={}&end={}'

    def get(self, request, id, start, end):
        auth_header = request.headers.get('Authorization')
        headers = {
            'Authorization': f'{auth_header}',
            'Accept': 'application/json'
        }  
        response = requests.get(self.angelcam_stream_url.format(id, start, end), headers=headers)
        return Response(response.json().get('url'), status=200) 