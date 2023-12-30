from django.db import models

# Create your models here.
# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

"""class CustomUser(AbstractUser):
    pass
    # add additional fields in here

    def __str__(self):
        return self.username"""

#------------------ user table ------------------

"""
followers = Table('followers',
    follower_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    followed_id = Column(Integer, ForeignKey("users.id"), primary_key=True))
"""

class Follow(models.Model): 
    #__tablename__ = "followers"

    follower = models.ForeignKey(
            "CustomUser", 
            related_name="following",  
            on_delete=models.CASCADE) #CASCADE means delete this row when user is deleted.
    # a user is following another user --> that user is in the follower field.
    # so the backref for the follower field - the users  this user is following - would be "following".


    followed = models.ForeignKey(
            "CustomUser", 
            related_name="followers",
            on_delete=models.CASCADE)

    timestamp = models.DateTimeField(auto_now_add=True)


def file_generate_upload_path_profile_picture(instance, filename): #instance = actual image
    #instance.id = the user's id
    return f"profile_pictures/{instance.id}/{filename}" 

class CustomUser(AbstractUser):
    email = models.EmailField(max_length=70,blank=True,unique=True)
    bio = models.CharField(max_length=200, blank=True, default='')
    height = models.CharField(max_length=10, null=True) #optional
    weight = models.PositiveSmallIntegerField(null=True) #optional

    #posts = relationship("Posts", back_populates="owner")

    profile_picture = models.FileField(
        upload_to=file_generate_upload_path_profile_picture, 
        null=True #optional
    )

    liked_posts = models.ManyToManyField("Post", through="PostLike")

    def get_followers(self):
        return CustomUser.objects.filter(following__followed=self)

    def get_following(self):
        return CustomUser.objects.filter(followers__follower=self)



#------------------ Posts + items ------------------

#1 post --> multiple media (pictures) --> each media has multiple items


#post --> media (multiple) 
#media --> mediaItem (multiple) 
#mediaItem --> item

def file_generate_upload_path_media(instance, filename): #instance = actual image
    #instance.post.owner.id = the user's id
    return f"post_media/{instance.post.owner.id}/{filename}" 

class Media(models.Model):

    bucket_key = models.FileField(upload_to=file_generate_upload_path_media)
    index = models.PositiveSmallIntegerField()
    post = models.ForeignKey(
        "Post", 
        related_name="media",
        on_delete=models.CASCADE
    )

    #for ease of use
    items = models.ManyToManyField("Item", through="MediaItem")

class Item(models.Model):

    title = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)

    #I don't want different Item entries for every different colorway... put that in MediaItem
    #user submits a different link? I think link should be specific to user. Put that in MediaItem
    #title and item_type should stay.

    item_type = models.CharField(max_length=50) #for pants, shirts, shoes, etc.

    #posts = relationship('media', secondary=MediaItems, backref='media')


class MediaItem(models.Model):

    post = models.ForeignKey(
            "Post", 
            related_name="mediaItems",
            on_delete=models.CASCADE) #CASCADE means delete this row when post is deleted.
    media = models.ForeignKey(
            "Media", 
            related_name="mediaItems",
            on_delete=models.CASCADE) #CASCADE means delete this row when media is deleted.
    item = models.ForeignKey(
            "Item", 
            related_name="mediaItems",
            on_delete=models.CASCADE) #CASCADE means delete this row when item is deleted.

    item_position_percent_x = models.PositiveSmallIntegerField()
    item_position_percent_y = models.PositiveSmallIntegerField()

    colorway = models.CharField(max_length=100, null=True) #optional
    link = models.URLField(null=True) #optional


class Post(models.Model):
    title = models.CharField(max_length=100)
    caption = models.CharField(max_length=1000)
    owner = models.ForeignKey(
            "CustomUser", 
            related_name="posts",
            on_delete=models.CASCADE) 
            #CASCADE means delete this row when user is deleted.

    timestamp = models.DateTimeField(auto_now_add=True)
    num_likes = models.IntegerField(default=0)

    #I want to get the timestamps of each PostLike - so maybe I don't need this?
    #if I have to get the PostLike objects anyway?
    #user_likes = models.ManyToManyField("User", through="PostLike")

    def increment_likes(self):
        self.num_likes += 1
    
    def decrement_likes(self):
        self.num_likes -= 1

#------------------ user comments and likes ------------------

class Comment(models.Model): 

    post = models.ForeignKey(
            "Post", 
            related_name="comments",
            on_delete=models.CASCADE)
    parent_comment = models.ForeignKey(
            "Comment", 
            related_name="comments",  #will be null if top-level comment
            on_delete=models.CASCADE)
            #parent comment is deleted --> this one is deleted too.
            #in the future we should just set the parent comment's text to null to "delete" it.
    user = models.ForeignKey(
            "CustomUser", 
            related_name="comments",
            null=True,
            on_delete=models.SET_NULL) 
            #null=True: 
            #user is deleted --> comment should still exist, just have the user_id set to null.
            #SET_NULL means set the reference (owner) to null when the user is deleted. 
            #The comment will remain even if the poster is deleted.
    
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=500)
    num_likes = models.IntegerField(default=0)

    def increment_likes(self):
        self.num_likes += 1
    
    def decrement_likes(self):
        self.num_likes -= 1


class CommentLike(models.Model):

    comment = models.ForeignKey( #probably don't need relation field from users?
            "Comment",
            related_name="likes",
            on_delete=models.CASCADE) #delete likes if comment gets deleted.
    user = models.ForeignKey( #probably don't need related name?
            "CustomUser",
            related_name="comment_likes",
            on_delete=models.CASCADE)
            #null=True,
            #on_delete=models.SET_NULL) #don't delete likes if user gets deleted
            
            #idea: user is deleted --> 
            #I actually do delete this, and I just don't decrement the comment's num_likes.
            #These are just for making sure one user doesn't like stuff multiple times.
            #If the user gets deleted, what's the point.

    timestamp = models.DateTimeField(auto_now_add=True)


class PostLike(models.Model):

    post = models.ForeignKey(
            "Post", 
            related_name="likes",
            on_delete=models.CASCADE) #post gets deleted = likes get deleted.
    user = models.ForeignKey(
            "CustomUser",
            related_name="post_likes",
            on_delete=models.CASCADE)
            #on_delete=models.SET_NULL) #user gets deleted --> their likes don't.

            #idea: user is deleted --> 
            #I actually do delete this, and I just don't decrement the post's num_likes.
            #These are just for making sure one user doesn't like stuff multiple times.
            #If the user gets deleted, what's the point.

    timestamp = models.DateTimeField(auto_now_add=True)


#TODO: Item attributes