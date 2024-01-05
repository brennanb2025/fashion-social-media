
from core.serializers import CustomUserSerializer, PostSerializer, PostSerializerFull, FollowSerializer, CommentSerializer#, GroupSerializer
from django.http.response import JsonResponse
from rest_framework import status

from core.models import CustomUser, Post, Follow, Item, Media, MediaItem, PostLike, Comment
from rest_framework.decorators import api_view

from .users import get_user_by_id

import json

   
def get_post_by_id(id):
    try: 
        post = Post.objects.get(id=id) 
        return post
    except Post.DoesNotExist: 
        return None


@api_view(['GET'])
def posts(request):
    # GET list of Posts

    posts = Post.objects.all().order_by('-timestamp')
    
    postSerializer = PostSerializer(posts, many=True)
    return JsonResponse(postSerializer.data, safe=False, status=status.HTTP_200_OK)

@api_view(['GET'])
def post_detail(request, id):
    # GET post by id

    post = get_post_by_id(id)
    
    if post is None:
        return JsonResponse({'message': 'The post does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    postSerializer = PostSerializer(post)
    return JsonResponse(postSerializer.data, status=status.HTTP_200_OK)


# TODO: limit + paginate this. Sort those users somehow.
@api_view(['GET'])
def post_likes(request, id):
    # gets the users who have liked this post

    post = get_post_by_id(id)
    if post is None:
        return JsonResponse({'message': 'The post does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    #pretty sure you can't do this
    #users = post.post_likes.order_by('-timestamp').user
    users = [p.user for p in post.post_likes.order_by('-timestamp')]

    userSerializer = UserSerializer(users, many=True)
    return JsonResponse(userSerializer.data, safe=False, status=status.HTTP_200_OK)

@api_view(['GET'])
def post_num_likes(request, id):
    # gets the post's number of likes

    post = get_post_by_id(id)
    if post is None:
        return JsonResponse({'message': 'The post does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    return JsonResponse({'num_likes': post.num_likes}, status=status.HTTP_200_OK)


@api_view(['GET','POST'])
def post_like(request, id, userid):
    # likes/unlikes a post by postid for userid

    post = get_post_by_id(id)
    if post is None:
        return JsonResponse({'message': 'The post does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    user = get_user_by_id(userid)
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    like = PostLike.objects.filter(post=post, user=user).first()

    if request.method == 'GET':
        return JsonResponse({'status': like is not None}, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        if like: #like already exists -> decrement it
            like.delete()
            post.decrement_likes()
        else:
            PostLike.objects.create(post=post, user=user)
            post.increment_likes()

        return JsonResponse({'message': 'success'}, status=status.HTTP_201_CREATED)


MAX_COMMENT_LENGTH = 500

@api_view(['POST'])
def post_comment(request, id):
    # comments a post by postid for userid

    data = json.loads(request.body)

    content = data.get("content")
    if not content or content == "" or len(content) > MAX_COMMENT_LENGTH:
        return JsonResponse({'message': 'Invalid comment'}, status=status.HTTP_400_BAD_REQUEST)

    post = get_post_by_id(id)
    if post is None:
        return JsonResponse({'message': 'The post does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    userid = data.get("user")
    if not userid:
        return JsonResponse({'message': 'Invalid comment'}, status=status.HTTP_400_BAD_REQUEST)
    user = get_user_by_id(userid)
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    Comment.objects.create(
        post=post,
        parent_comment=None,
        user=user,
        content=content
    )

    return JsonResponse({'message': 'success'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def post_comments(request, id):
    # gets the comments for post id
    # just the top level comments

    post = get_post_by_id(id)
    if post is None:
        return JsonResponse({'message': 'The post does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    # I'm afraid getting all and then filtering will be inefficient 
    # - unless django does cool sql stuff
    comments = post.comments.filter(parent_comment=None).order_by('-num_likes')

    commentSerializer = CommentSerializer(comments, many=True)
    return JsonResponse(commentSerializer.data, safe=False, status=status.HTTP_200_OK)



@api_view(['GET'])
def posts_containing_item_brand(request, brand):
    posts = Post.objects.filter(mediaItems__item__brand=brand).distinct()

    """
    order = request.params.get("order")
    if not order or order == "most recent":
        posts = posts.order_by('-timestamp')
    elif order == "likes":
        posts = posts.order_by('-num_likes')
    """

    postSerializer = PostSerializerFull(posts, many=True)
    return JsonResponse(postSerializer.data, safe=False, status=status.HTTP_200_OK)