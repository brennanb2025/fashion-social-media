from django.urls import path
from core import views 

""" 
Users
/api/users/: GET, POST
/api/users/:id/: GET
/api/users/:id/followers/: GET
/api/users/:id/following/: GET
/api/users/:id/posts/: GET, POST
/api/users/:id/likedPosts/: GET
/api/users/:id1/follow/:id2/: POST
/api/users/:id1/unfollow/:id2/: DELETE
/api/users/:id/feed/: GET (startPost, pagesize query params)
/api/users/:id/main/: GET
/api/users/:id/follow-recommendations/: GET
/api/users/:id/set-profile-picture/: POST

Follows
/api/follows/: GET

Posts
/api/posts/: GET
/api/posts/:id/: GET
/api/posts/:id/likes/: GET
/api/posts/:id/like/:userid/: POST
/api/posts/:id/comment/:userid: POST
/api/posts/:id/comments/: GET
/api/posts/containing-item-brand/:brand/: GET

Items
/api/items/: GET
/api/items/:id/: GET
/api/items/:id/posts/: GET
/api/items/by-brand/:brand/: GET


Comments
/api/comments/: GET
/api/comments/:id/: GET
/api/comments/:id/comment/: POST
/api/comments/:id/like/: POST
/api/comments/:id/comments/: GET



"""

urlpatterns = [ 
    #users
    path('api/users/', views.users, name='users'),
    path('api/users/<int:id>/', views.user_detail, name='user_detail'),
    path('api/users/<int:id>/followers/', views.user_followers, name='user_followers'),
    path('api/users/<int:id>/following/', views.user_following, name='user_following'),
    path('api/users/<int:id>/posts/', views.user_posts, name='user_posts'),
    path('api/users/<int:id>/likedPosts/', views.user_liked_posts, name='user_liked_posts'),
    path(
            'api/users/<int:id1>/follow/<int:id2>/', 
            views.user_follow_another_user, 
            name='user_follow_another_user'
        ),
    path(
            'api/users/<int:id1>/unfollow/<int:id2>/',
            views.user_unfollow_another_user,
            name='user_unfollow_another_user'
        ),
    path(
            'api/users/<int:id>/feed/',
            views.feed,
            name='feed'
        ),
    path(
            'api/users/<int:id>/main/',
            views.main,
            name='main'
        ),
    path(
            'api/users/<int:id>/follow-recommendations/',
            views.follow_recommendations,
            name='follow-recommendations'
        ),
    path(
        '/api/users/<int:id>/set-profile-picture/',
        views.set_profile_picture,
        name='set-profile-picture'
    ),

    
    #follows
    path('api/follows/', views.follows, name='follows'),


    #posts
    path('api/posts/', views.posts, name='posts'),
    path('api/posts/<int:id>/', views.post_detail, name='post_detail'),
    path('api/posts/<int:id>/likes/', views.post_likes, name='post_likes'),
    path('api/posts/<int:id>/like/<int:userid>/', views.post_like, name='post_like'),
    path('api/posts/<int:id>/comment<int:userid>/', views.post_comment, name='post_comment'),
    path('api/posts/<int:id>/comments/', views.post_comments, name='post_comments'),
    path('api/posts/containing-item-brand/<string:brand>/', 
        views.posts_containing_item_brand,
        name='posts_containing_item_brand'
    ),


    #Items
    path('/api/items/', views.items, name='items'),
    path('/api/items/<int:id>/', views.item_detail, name='item_detail'),
    path('/api/items/<int:id>/posts/', views.item_posts, name='item_posts'),
    path('/api/items/by-brand/<string:brand>/', views.items_by_brand, name='items_by_brand'),


    #comments
    path('api/comments/', views.comments, name='comments'),
    path('api/comments/<int:id>/', views.comment_detail, name='comment_detail'),
    path('api/comments/<int:id>/comments/', views.comment_comments, name='comment_comments'),
    path('api/comments/<int:id>/like/<int:userid>/', views.comment_like, name='comment_like'),
    path('api/comments/<int:id>/comment/<int:userid>/<int:postid>/', 
        views.post_comment, 
        name='post_comment'
    ),
]