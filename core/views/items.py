
from .serializers import PostSerializer, ItemSerializer#, GroupSerializer
from django.http.response import JsonResponse
from rest_framework import status

from .models import CustomUser, Post, Follow, Item, Media, MediaItem, PostLike, Comment
from rest_framework.decorators import api_view

   
def get_item_by_id(id):
    try: 
        item = Item.objects.get(id=id) 
        return item
    except Item.DoesNotExist: 
        return None


@api_view(['GET'])
def items(request):
    # GET list of Items

    items = Item.objects.all()
    
    itemSerializer = ItemSerializer(items, many=True)
    return JsonResponse(itemSerializer.data, safe=False, status=status.HTTP_200_OK)

@api_view(['GET'])
def items_by_brand(request, brand):
    # GET list of Items

    items = Item.objects.filter(brand=brand)
    
    itemSerializer = ItemSerializer(items, many=True)
    return JsonResponse(itemSerializer.data, safe=False, status=status.HTTP_200_OK)


@api_view(['GET'])
def item_detail(request, id):
    # GET post by id

    item = get_item_by_id(id)
    
    if item is None:
        return JsonResponse({'message': 'The item does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    itemSerializer = ItemSerializer(post)
    return JsonResponse(itemSerializer.data, status=status.HTTP_200_OK)


# TODO: no limit on this one - for now.
@api_view(['GET'])
def item_posts(request, id):
    # gets the posts that contain this item

    item = get_item_by_id(id)
    if item is None:
        return JsonResponse({'message': 'The item does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    # item -> media (via item.media_set I think) -> posts
    # TODO: pretty sure this is wrong
    # may have to be: [m.post for m in item.media_set.all()]
    posts = item.media_set.all().posts.all()

    postSerializer = PostSerializer(posts, many=True)
    return JsonResponse(postSerializer.data, safe=False, status=status.HTTP_200_OK)