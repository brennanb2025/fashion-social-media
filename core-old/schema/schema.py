#pydantic models
from pydantic import BaseModel
from typing import List, Optional

#------------------ user table ------------------

#This is a base model that defines the common attributes of a user 
#without including sensitive information like the password.

#It is used as the base class for other Pydantic models (e.g., UserCreate and User) 
#to reuse the common attributes.

#email and username: These are common attributes for all users, 
#and they are defined as required fields in the base model.

class UserBase(BaseModel):
    email: str
    username: str

#This model is used for creating a new user. 
#It includes the sensitive information needed to create a user (e.g., password).
class UserCreate(UserBase):
    hashed_password: str

#This model is used to represent a user when retrieving data from the database 
#or when returning data to the client. 
#It excludes sensitive information like the password.
#It is used in scenarios where you want to provide information about a user, excluding sensitive data.

#Config: Sets orm_mode = True to enable seamless conversion between Pydantic and SQLAlchemy models.
class User(UserBase):
    id: int
    is_active: bool
    following: list[User] = [] #added
    #I don't think we need to load all the posts just yet? Not sure.

    class Config:
        orm_mode = True



#------------------ Posts + items ------------------

#1 post --> multiple media (pictures) --> each media has multiple items


class PostBase(BaseModel):
    title: str
    description: str
    caption: Optional[str] = None

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: int
    owner: User
    timestamp: datetime
    num_likes: int
    media: List[Media] = [] #load all the media related to this post

    class Config:
        orm_mode = True

class MediaItemBase(BaseModel):
    item_position_percent_x: int
    item_position_percent_y: int

class MediaItemCreate(MediaItemBase):
    pass

class MediaItem(MediaItemBase):
    id: int
    item: Item

    class Config:
        orm_mode = True

class MediaBase(BaseModel):
    bucket_key: str

class MediaCreate(MediaBase):
    pass

class Media(MediaBase):
    id: int
    items: List[MediaItem] = [] #load all the items featured in this media

    class Config:
        orm_mode = True

class ItemBase(BaseModel):
    title: str
    link: str
    item_type: str

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    #media: List[MediaItem] = [] #load all the media featuring this item
    #maybe we don't want to do that by default.

    class Config:
        orm_mode = True



#------------------ user comments and likes ------------------


class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    post: Post
    user: User
    timestamp: datetime
    num_likes: int

    class Config:
        orm_mode = True

class CommentLikeBase(BaseModel):
    pass

class CommentLikeCreate(CommentLikeBase):
    pass

class CommentLike(CommentLikeBase):
    id: int
    post: Post
    user: User

    class Config:
        orm_mode = True

class PostLikeBase(BaseModel):
    pass

class PostLikeCreate(PostLikeBase):
    pass

class PostLike(PostLikeBase):
    id: int
    post: Post
    user: User

    class Config:
        orm_mode = True
