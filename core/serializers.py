#from django.contrib.auth.models import Group, User
from rest_framework import serializers

from .models import CustomUser, Post, Follow, Comment, Item

class CustomUserSerializer(serializers.ModelSerializer):
    #followers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active']

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'caption', 'owner', 'timestamp', 'num_likes']

#TODO: make this have field:
# itemInformation: [Item, Item, Item]
# where Item has:
# - item_position_percent_x (from MediaItem)
# - item_position_percent_y (from MediaItem)
# - colorway (from MediaItem)
# - link (from MediaItem)
# - title (from Item)
# - brand (from Item)
# - item_type (from Item)
class PostSerializerFull(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'caption', 'owner', 'timestamp', 'num_likes']

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'brand', 'item_type']

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