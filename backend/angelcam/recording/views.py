from rest_framework.views import APIView
from rest_framework.response import Response
import requests

"""
si retention es null, no hay nada grabado. Si no es null, chequear que
recording_start y recording_end tampoco estén en null, si está alguno en null
hay que ver de usar el dato de retention para sacar la diferencia entre el dato que no está en null
y la retention y en base a eso calcular cual es el start o el fin
"""
class ListRecordingsView(APIView):
    recording_url = 'https://api.angelcam.com/v1/shared-cameras/{}/recording/'
    timeline_url = 'https://api.angelcam.com/v1/shared-cameras/{}/recording/timeline/?start={}&end={}'


