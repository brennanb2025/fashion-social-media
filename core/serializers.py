#from django.contrib.auth.models import Group, User
from rest_framework import serializers

from .models import CustomUser, Post, Follow, Comment, Item, Media, MediaItem

class CustomUserSerializer(serializers.ModelSerializer):
    #followers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 
            'last_name', 'bio', 'height', 'weight', 'profile_picture', 'is_active']


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'caption', 'owner', 'timestamp', 'num_likes']

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'brand', 'item_type']

class MediaItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer()

    class Meta:
        model = MediaItem
        fields = ['id', 'item_position_percent_x', 'item_position_percent_y', 
                'colorway', 'link', 'item']

class MediaSerializer(serializers.ModelSerializer):
    mediaItems = MediaItemSerializer(many=True)

    class Meta:
        model = Media
        fields = ['id', 'bucket_key', 'index', 'mediaItems']

class PostSerializerFull(serializers.ModelSerializer):
    media = MediaSerializer(many=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'caption', 'owner', 'timestamp', 'num_likes', 'media']



class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'followed', 'timestamp']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        # TODO: may need nested serializer for post, parent_comment, user
        fields = ['id', 'post', 'parent_comment', 'user', 'timestamp', 'content', 'num_likes']

"""
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']
"""