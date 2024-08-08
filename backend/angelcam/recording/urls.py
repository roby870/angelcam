from django.urls import path
from .views import RecordingDaysView, RecordingClipsView, RecordingStreamView


urlpatterns = [
    path('shared-recording-days/<int:id>/', RecordingDaysView.as_view(), name='shared-recording-days'),
    path('shared-recording-clips/<int:id>/<str:start>/<str:end>/', RecordingClipsView.as_view(), name='shared-recording-clips'),
    path('shared-recording-stream/<int:id>/<str:start>/<str:end>/', RecordingStreamView.as_view(), name='shared-recording-stream'),
]