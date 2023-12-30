
from core.serializers import CustomUserSerializer, PostSerializer, FollowSerializer, CommentSerializer#, GroupSerializer
from django.http.response import JsonResponse
from rest_framework import status

from core.models import CustomUser, Post, Follow, Item, Media, MediaItem, PostLike, Comment
from rest_framework.decorators import api_view

from .users import get_user_by_id

   
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


# TODO: no limit on this one - for now.
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


@api_view(['POST'])
def post_like(request, id, userid):
    # likes/unlikes a post by postid for userid

    post = get_post_by_id(id)
    if post is None:
        return JsonResponse({'message': 'The post does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    user = get_user_by_id(userid)
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    like = PostLike.objects.filter(post=post, user=user)
    if like: #like already exists -> decrement it
        like.delete()
        post.decrement_likes()
    else:
        PostLike.create(post=post, user=user)
        post.increment_likes()

    return JsonResponse({'message': 'success'}, status=status.HTTP_201_CREATED)


MAX_COMMENT_LENGTH = 500

@api_view(['POST'])
def post_comment(request, id, userid):
    # comments a post by postid for userid

    content = request.POST.get("data")
    if not data or data == "" or len(data) > MAX_COMMENT_LENGTH:
        return JsonResponse({'message': 'Invalid comment'}, status=status.HTTP_400_BAD_REQUEST)

    post = get_post_by_id(id)
    if post is None:
        return JsonResponse({'message': 'The post does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    user = get_user_by_id(userid)
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    Comment.create(
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
    # may have to do: [i.mediaItems for i in Item.objects.filter...]
    # and then mediaItem.post for mediaItem in that ^
    # TODO: yeah this is wrong v
    # item filter -> mediaItems -> media -> post
    # or item filter -> media (via media_set I think)
    posts = Item.objects.filter(brand=brand).media_set.all().post.all()

    order = request.params.get("order")
    if not order or order == "most recent":
        posts = posts.order_by('-timestamp')
    elif order == "likes":
        posts = posts.order_by('-num_likes')

    postSerializer = PostSerializer(posts, many=True)
    return JsonResponse(postSerializer.data, safe=False, status=status.HTTP_200_OK)