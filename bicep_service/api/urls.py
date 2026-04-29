from django.urls import path
from .views import VideoAnalyzeView, FrameAnalyzeView

urlpatterns = [
    path('analyze/video/', VideoAnalyzeView.as_view(), name='analyze_video'),
    path('analyze/frame/', FrameAnalyzeView.as_view(), name='analyze_frame'),
]
