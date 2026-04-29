from django.urls import path
from .views import GenerateProgramView, GetProgramView

urlpatterns = [
    path('program/generate', GenerateProgramView.as_view(), name='generate-program'),
    path('program/get', GetProgramView.as_view(), name='get-program'),
]
