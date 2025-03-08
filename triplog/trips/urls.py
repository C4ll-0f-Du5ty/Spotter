from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, StopViewSet, LogSheetViewSet

router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'stops', StopViewSet)
router.register(r'logs', LogSheetViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
