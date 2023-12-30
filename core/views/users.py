from rest_framework import status#, permissions, viewsets

from core.serializers import CustomUserSerializer, PostSerializer, PostSerializerFull
from rest_framework.decorators import api_view


from django.http.response import JsonResponse
#from rest_framework.parsers import JSONParser 
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile

import json
import base64
import uuid

from django.core.files import File

from core.models import CustomUser, Post, Follow, Item, Media, MediaItem

@api_view(['GET', 'POST'])
def users(request):
    # GET list of users, POST a new user

    if request.method == 'GET':
        users = CustomUser.objects.all().order_by('-date_joined')

        userSerializer = CustomUserSerializer(users, many=True)
        return JsonResponse(userSerializer.data, safe=False, status=status.HTTP_200_OK)
        # 'safe=False' for objects serialization

    elif request.method == 'POST':
        first = request.POST.get('first')
        last = request.POST.get('last')
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')


        if first is None:
            return JsonResponse({'message': 'First name query parameter unset'}, status=status.HTTP_400_BAD_REQUEST)
        if last is None:
            return JsonResponse({'message': 'Last name query parameter unset'}, status=status.HTTP_400_BAD_REQUEST)
        if username is None:
            return JsonResponse({'message': 'Username query parameter unset'}, status=status.HTTP_400_BAD_REQUEST)
        if email is None:
            return JsonResponse({'message': 'Email query parameter unset'}, status=status.HTTP_400_BAD_REQUEST)
        if password1 is None:
            return JsonResponse({'message': 'Password query parameter unset'}, status=status.HTTP_400_BAD_REQUEST)
        if password2 is None:
            return JsonResponse({'message': 'Password repeat query parameter unset'}, status=status.HTTP_400_BAD_REQUEST)
        if password1 != password2:
            return JsonResponse({'message': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
        if CustomUser.objects.filter(username=username).exists():
            return JsonResponse({'message': 'Username taken'}, status=status.HTTP_409_CONFLICT)
        if CustomUser.objects.filter(email=email).exists():
            return JsonResponse({'message': 'Email taken'}, status=status.HTTP_409_CONFLICT)

        user = create_user(
                email=email, 
                username=username, 
                password=password1, 
                first=first,
                last=last)

        return JsonResponse({'message': str(user.id)}, status=status.HTTP_201_CREATED)
        
def create_user(email, username, password, first, last):
    user = get_user_model().objects.create_user(
            email=email, 
            username=username, 
            password=password,
            first_name=first,
            last_name=last)
    return user

 
def get_user_by_id(id):
    try: 
        user = CustomUser.objects.get(id=id) 
        return user
    except CustomUser.DoesNotExist: 
        return None

def get_user_by_username(username):
    try: 
        user = CustomUser.objects.get(username=username) 
        return user
    except CustomUser.DoesNotExist: 
        return None
 
@api_view(['GET'])
def user_detail(request, id):
    # find user by id 
    # GET / PUT / DELETE user
    user = get_user_by_id(id)
    
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    if request.method == 'GET': 
        userSerializer = CustomUserSerializer(user) 
        return JsonResponse(userSerializer.data, status=status.HTTP_200_OK) 

@api_view(['GET'])
def user_detail_by_username(request, username):
    # GET user by username 
    user = get_user_by_username(username)
    
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    if request.method == 'GET': 
        userSerializer = CustomUserSerializer(user) 
        return JsonResponse(userSerializer.data, status=status.HTTP_200_OK) 
        
@api_view(['GET'])
def user_followers(request, id):
    # GET user's followers

    user = get_user_by_id(id)
    
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND)

    userSerializer = CustomUserSerializer(user.get_followers(), many=True)
    return JsonResponse(userSerializer.data, safe=False, status=status.HTTP_200_OK)
    

@api_view(['GET'])
def user_following(request, id):
    # GET users id is following

    user = get_user_by_id(id)
    
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    userSerializer = CustomUserSerializer(user.get_following(), many=True)
    return JsonResponse(userSerializer.data, safe=False, status=status.HTTP_200_OK)


@api_view(['POST'])
def user_follow_another_user(request, id1, id2):
    if id1 == id2:
        return JsonResponse({'message': 'User cannot follow themself'}, status=status.HTTP_400_BAD_REQUEST)
    # POST user 1 follows user 2
    if request.method == 'POST':
        user1 = get_user_by_id(id1)
        user2 = get_user_by_id(id2)
        if not user1 or not user2:
            return JsonResponse({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        if Follow.objects.filter(follower=user1, followed=user2).first() != None:
            return JsonResponse({'message': 'Follow already exists'}, status=status.HTTP_409_CONFLICT)
        
        Follow.objects.create(follower=user1, followed=user2)
        return JsonResponse({'success':True}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
def user_unfollow_another_user(request, id1, id2):
    # POST user 1 follows user 2
    if request.method == 'DELETE':
        user1 = get_user_by_id(id1)
        user2 = get_user_by_id(id2)
        if not user1 or not user2:
            return JsonResponse({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        followToDelete = Follow.objects.filter(follower=user1, followed=user2).first()
        if followToDelete == None:
            return JsonResponse({'message': 'Follow does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        followToDelete.delete()
        return JsonResponse({'success':True}, status=status.HTTP_200_OK)
        


"""
DATA:
{
    "title": "Uniqlo items",
    "caption": "Here are some cool uniqlo items.",
    "media": {
        "0": {
            "img": "base64img",
            "items": [
                {
                    "title": "U AIRism cotton oversized crew neck half-sleeve t-shirt",
                    "link": "https://www.uniqlo.com/us/en/products/E455359-000/00?colorDisplayCode=00&sizeDisplayCode=003",
                    "colorway": "White",
                    "brand": "Uniqlo",
                    "item_type": "T-shirt",
                    "x_percent_pos": 50,
                    "y_percent_pos": 50
                },
                {
                    "title": "Uniqlo Wide-Fit Pleated Pants",
                    "link": "https://www.uniqlo.com/us/en/products/E462197-000/00?colorDisplayCode=57&sizeDisplayCode=004&gad_source=1&gclid=CjwKCAiAvoqsBhB9EiwA9XTWGUiKM4i1KGiFUeWwDoi3rF6fA0byeph3qOjEY1Dz3WQUAw4RWT3ZYxoCmnYQAvD_BwE",
                    "colorway": "Olive",
                    "brand": "Uniqlo",
                    "item_type": "Pants",
                    "x_percent_pos": 50,
                    "y_percent_pos": 80
                }
            ]
        },
        "1": {
            "img": "base64img",
            "items": [
                {
                    "title": "Smart Ankle Pants (2-Way Stretch, Cotton, Tall)",
                    "link": "https://www.uniqlo.com/us/en/products/E463952-000/00?colorDisplayCode=01&sizeDisplayCode=004",
                    "colorway": "Off White",
                    "brand": "Uniqlo",
                    "item_type": "Pants",
                    "x_percent_pos": 50,
                    "y_percent_pos": 80
                },
                {
                    "title": "CURVED-HEM LINEN SHIRT",
                    "link": "https://www.cos.com/en_usd/men/menswear/shirts/product.curved-hem-linen-shirt-white.1146543003.html",
                    "colorway": "White",
                    "item_type": "Shirt",
                    "brand": "Cos",
                    "x_percent_pos": 50,
                    "y_percent_pos": 30
                }
            ]
        }
    }
}
"""


# This is a multipart file upload.

# Alternatively, I could give the post submission a unique id and 
# give all of the image data uploads the same unique id, and submit each image as a separate POST request.
# Submitting the POST request for the post, then separately submitting POST requests for each image
# (linking them by the same unique id) would allow for concurrent uploads, 
# but would result in users hitting the image POST request 
# avoiding premature optimization for now. Just doing multipart form data.

#TODO: make this validate that the images are base64-decodable

def validate_post_json_data(data):

    #top-level post checks
    if ('title' not in data or 
            'caption' not in data or 
            'media' not in data or
            len(data['media']) == 0):
        return False

    media = data['media']

    #go through slides
    for k in media.keys(): #keys will be "0", "1", "2", etc.

        if not k.isdigit(): #must be a digit for indexing images
            return False

        imgAndItems = media[k]

        if "img" not in imgAndItems or "items" not in imgAndItems:
            return False

        items = imgAndItems["items"]

        #slide: list of items
        if len(items) == 0:
            return False

        #go through items
        for item in items:
            if 'title' not in item or 'link' not in item or \
                    'colorway' not in item or 'item_type' not in item or \
                    'x_percent_pos' not in item or 'y_percent_pos' not in item or \
                    'brand' not in item:
                return False
            
            if not isinstance(item['x_percent_pos'], int) or \
                    item['x_percent_pos'] < 0 or item['x_percent_pos'] > 100 or \
                    not isinstance(item['y_percent_pos'], int) or \
                    item['y_percent_pos'] < 0 or item['y_percent_pos'] > 100:
                return False

    return True


@api_view(['GET', 'POST'])
def user_posts(request, id):
    # GET posts id has posted, POST a post under user id

    user = get_user_by_id(id)
        
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    if request.method == 'GET':
        postSerializer = PostSerializer(user.posts.all().order_by('-timestamp'), many=True)
        return JsonResponse(postSerializer.data, safe=False, status=status.HTTP_200_OK)


    elif request.method == 'POST':

        data = json.loads(request.body)

        if not validate_post_json_data(data):
            return JsonResponse({'message': 'JSON data is malformed'}, status=status.HTTP_400_BAD_REQUEST)

        title = data['title']
        caption = data['caption'] #allow null
        media = data['media']
        
        #create the post so we have the id
        newPost = Post.objects.create(
            title=data['title'], 
            caption=data['caption'],
            owner=user
        )

        #go through slides
        for k in media.keys(): #keys will be "0", "1", "2", etc.
            
            imgAndItems = media[k]

            #could set the filename to id/uuid here but setting to id using table in the bucket_key.
            imgFile = ContentFile(base64.b64decode(imgAndItems["img"]), name=str(uuid.uuid4()))

            #create the media here
            newMedia = Media.objects.create(
                bucket_key=imgFile, 
                index=int(k),
                post=newPost
            )
            image_url = newMedia.bucket_key.url

            for item in imgAndItems["items"]:
                thisItem = None
                thisItem = Item.objects.filter(title=item['title'], brand=item['brand']).first()
                if not thisItem: #make a new one if it doesn't exist
                    thisItem = Item.objects.create(
                        title=item['title'], 
                        brand=item['brand'],
                        item_type=item['item_type']
                    )

                #create media item here
                newMediaItem = MediaItem.objects.create(
                    post=newPost,
                    media=newMedia,
                    item=thisItem,
                    item_position_percent_x=int(item['x_percent_pos']),
                    item_position_percent_y=int(item['y_percent_pos']),
                    colorway=(item['colorway'] if item['colorway'] != "" else None), #optional
                    link=(item['link'] if item['link'] != "" else None) #optional
                )

        return JsonResponse(data={'message': 'success'}, status=status.HTTP_201_CREATED)
        

@api_view(['GET'])
def user_posts_full(request, id):
    # GET posts id has posted

    user = get_user_by_id(id)
        
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    if request.method == 'GET':
        print("user posts:", user.posts.all())
        postSerializer = PostSerializerFull(user.posts.all().order_by('-timestamp'), many=True)
        return JsonResponse(postSerializer.data, safe=False, status=status.HTTP_200_OK)


@api_view(['GET'])
def user_liked_posts(request, id):
    # GET posts id has liked

    user = get_user_by_id(id)
    
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    posts = user.liked_posts.all().order_by('-timestamp')
    postSerializer = PostSerializer(posts, many=True)
    return JsonResponse(postSerializer.data, safe=False, status=status.HTTP_200_OK)


FEED_POST_LIMIT = 20 # get next 20 posts

@api_view(['GET'])
def feed(request, id):
    # GET feed for id

    #TODO: wrong syntax
    startPost = request.params.get("startPost")

    user = get_user_by_id(id)
    
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    #user posts + user's following posts
    #TODO: this is probably illegal
    #TODO: check pagination - check if I can do it with startPosts or if I have to skip+limit.
    #Also make sure to pass the startPost to the client in json format
    posts = (
        user + user.get_following()
    ).posts.order_by(
        '-timestamp'
    ).after(
        startPost
    ).limit(
        FEED_POST_LIMIT
    )

    postSerializer = PostSerializer(posts, many=True)
    return JsonResponse(postSerializer.data, safe=False, status=status.HTTP_200_OK)


MAIN_POST_LIMIT = 20 # get next 20 posts

@api_view(['GET'])
def main(request, id):
    # GET main (recommended posts) for id
    # for now, just show the most popular posts
    # in the future, find some combination of 
    # - popularity 
    # - user's followers follow 
    # - recency

    #TODO: wrong syntax
    startPost = request.params.get("startPost")

    user = get_user_by_id(id)
    
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    
    #TODO: check pagination - check if I can do it with startPosts or if I have to skip+limit.
    #Also make sure to pass the startPost to the client in json format
    posts = Post.objects.all().order_by(
        '-num_likes'
    ).after(
        startPost
    ).limit(
        MAIN_POST_LIMIT
    )

    postSerializer = PostSerializer(posts, many=True)
    return JsonResponse(postSerializer.data, safe=False, status=status.HTTP_200_OK)



RECOMMENDED_USER_LIMIT = 100 # get next 100 recommended users

@api_view(['GET'])
def follow_recommendations(request, id):
    # GET recommended followers for id
    # this is a network problem - but for now simplify it by only going 1 layer down.
    # should mainly be the users who are followed by the users id is following.
    # could also factor in the users who are followed by the users who follow id - do this later.
    # filter out users id is already following

    user = get_user_by_id(id)
    
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    
    #TODO: fix - or maybe just turn into a raw SQL query
    userFollowing = user.get_following()
    users = userFollowing.get_following().filter(
        id not in userFollowing #this is wrong
    ).order_by(
        "-count" #count is wrong - figure out how to count # times user appears
    ).limit(RECOMMENDED_USER_LIMIT)

    userSerializer = UserSerializer(users, many=True)
    return JsonResponse(userSerializer.data, safe=False, status=status.HTTP_200_OK)






# profile picture data
"""
{
    "data": "base64img"
}
... yeah, that's it.
"""

@api_view(['POST'])
def set_profile_picture(request, id):
    #POST a profile picture for userid

    user = get_user_by_id(id)
        
    if user is None:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    if request.method == 'POST':

        data = json.loads(request.body)

        if 'data' not in data:
            return JsonResponse({'message': 'JSON data is malformed'}, status=status.HTTP_400_BAD_REQUEST)
    
        #could set the filename to id/uuid here but setting to id using table in the bucket_key.
        imgFile = ContentFile(base64.b64decode(data["data"]), name=str(uuid.uuid4()))

        #TODO: update the picture here... this is probably wrong
        user.profile_picture = imgFile

        return JsonResponse(data={'message': 'success'}, status=status.HTTP_201_CREATED)
