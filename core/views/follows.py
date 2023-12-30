from core.serializers import CustomUserSerializer, PostSerializer, FollowSerializer#, GroupSerializer
from django.http.response import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view

from core.models import CustomUser, Post, Follow, Item, Media, MediaItem


@api_view(['GET'])
def follows(request):

    follows = Follow.objects.all().order_by('-timestamp')
    
    followsSerializer = FollowSerializer(follows, many=True)
    return JsonResponse(followSerializer.data, safe=False, status=status.HTTP_200_OK)

