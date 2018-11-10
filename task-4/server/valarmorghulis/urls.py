from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from . import views

router = routers.DefaultRouter()
router.register(r'locations', views.LocationViewSet)
router.register(r'messages', views.MessageViewSet)
router.register(r'players', views.PlayerViewSet)

urlpatterns = [
    path(r'', include(router.urls)),
    path(r'api-auth/', include('rest_framework.urls',
                               namespace='rest_framework')),
    path(r'api-token-auth/', obtain_auth_token),
    path(r'user/', views.current_user),
]
