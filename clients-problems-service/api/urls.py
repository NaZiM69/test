from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientProblemViewSet

router = DefaultRouter()
router.register(r'problems', ClientProblemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
