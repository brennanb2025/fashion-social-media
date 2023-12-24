
from .serializers import CustomUserSerializer, PostSerializer, FollowsSerializer, CommentSerializer#, GroupSerializer
from django.http.response import JsonResponse
from rest_framework import status

from .models import CustomUser, Post, Follow, Item, Media, MediaItem, PostLike, Comment, CommentLike
from rest_framework.decorators import api_view

from .users import get_user_by_id
from .posts import get_post_by_id


def get_comment_by_id(id):
    try: 
        comment = Comment.objects.get(id=id) 
        return comment
    except Comment.DoesNotExist: 
        return None

@api_view(['GET'])
def comments(request):
    # GET list of Comments

    comments = Comments.objects.all().order_by('-timestamp')
    
    commentSerializer = CommentSerializer(comments, many=True)
    return JsonResponse(commentSerializer.data, safe=False, status=status.HTTP_200_OK)

@api_view(['GET'])
def comment_detail(request, id):
    # GET post by id

    comment = get_comment_by_id(id)
    
    if comment is None:
        return JsonResponse({'message': 'The comment does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    commentSerializer = CommentSerializer(comment)
    return JsonResponse(commentSerializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def comment_like(request, id, userid):
    # likes/unlikes a comment by id for userid

    comment = get_comment_by_id(id)
    if comment is None:
        return JsonResponse({'message': 'The comment does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    user = get_user_by_id(userid)
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    like = CommentLike.objects.filter(comment=comment, user=user)
    if like: #like already exists -> decrement it
        like.delete()
        comment.decrement_likes()
    else:
        CommentLike.create(comment=comment, user=user)
        comment.increment_likes()

    return JsonResponse({'message': 'success'}, status=status.HTTP_201_CREATED)


MAX_COMMENT_LENGTH = 500

# I could do a bunch of work to get the top-level post id, or I could just force the 
# client to supply it.
@api_view(['POST'])
def post_comment(request, id, userid, postid):
    # comments a post under comment id for userid, (under post postid)

    content = request.POST.get("data")
    if not data or data == "" or len(data) > MAX_COMMENT_LENGTH:
        return JsonResponse({'message': 'Invalid comment'}, status=status.HTTP_400_BAD_REQUEST)

    comment = get_comment_by_id(id)
    if comment is None:
        return JsonResponse({'message': 'The comment does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    user = get_user_by_id(userid)
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    post = get_post_by_id(userid)
    if post is None:
        return JsonResponse({'message': 'The post does not exist'}, status=status.HTTP_404_NOT_FOUND) 


    Comment.create(
        post=post,
        parent_comment=comment,
        user=user,
        content=content
    )

    return JsonResponse({'message': 'success'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def comment_comments(request, id):
    # gets the comments for comment id
    # just the top level comments

    comment = get_comment_by_id(id)
    if comment is None:
        return JsonResponse({'message': 'The comment does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    comments = comment.comments.order_by('-num_likes')

    commentSerializer = CommentSerializer(comments, many=True)
    return JsonResponse(commentSerializer.data, safe=False, status=status.HTTP_200_OK)