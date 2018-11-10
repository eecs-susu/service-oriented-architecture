from .models import Location, Message, Player
from .serializers import (LocationSerializer,
                          MessageSerializer,
                          PlayerSerializer)
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework import permissions
from django.http import HttpResponse
from rest_framework.response import Response


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated()]


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated()]


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated()]


@api_view(['GET'])
def current_user(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
    })
