from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
#from datetime import datetime

from core.models.database import Base


#------------------ user table ------------------

"""
followers = Table('followers',
    follower_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    followed_id = Column(Integer, ForeignKey("users.id"), primary_key=True))
"""
#what if I want to use Followers as a class? Just going to define that.
class Followers(Base): 
    __tablename__ = "followers"

    follower_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    followed_id = Column(Integer, ForeignKey("users.id"), primary_key=True)

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    timestamp = Column(DateTime(timezone=True), index=True, server_default=func.now())

    following = relationship(
        "Users",
        secondary=Followers, 
        primaryjoin=(Followers.follower_id == id),
        secondaryjoin=(Followers.followed_id == id),
        back_populates='followers')

    posts = relationship("Posts", back_populates="owner")



#------------------ Posts + items ------------------

#1 post --> multiple media (pictures) --> each media has multiple items


class Posts(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime(timezone=True), index=True, server_default=func.now())
    caption = Column(String)
    num_likes = Column(Integer)

    owner = relationship("users", back_populates="posts")
    media = relationship("media", back_populates="posts")
    comments = relationship("comments", back_populates="posts")


class MediaItems(Base):
    __tablename__ = "mediaItems"

    id = Column(Integer, primary_key=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    item_id = Column(Integer, ForeignKey('items.id'))
    item_position_percent_x = Column(Integer)
    item_position_percent_y = Column(Integer)


class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)
    bucket_key = Column(String)

class Items(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    link = Column(String)
    item_type = Column(String) #for pants, shirts, shoes, etc.

    posts = relationship('media', secondary=MediaItems, backref='media')


#------------------ user comments and likes ------------------

class Comments(Base): 
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey('posts.id'))
    parent_comment_id = Column(Integer, ForeignKey('comments.id')) #will be null if top-level comment
    user_id = Column(Integer, ForeignKey('users.id'))
    timestamp = Column(DateTime(timezone=True), index=True, server_default=func.now())
    content = Column(String)
    num_likes = Column(Integer)

class CommentLikes(Base):
    __tablename__ = "commentLikes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey('posts.id'))
    user_id = Column(Integer, ForeignKey('users.id'))

class PostLikes(Base):
    __tablename__ = "postLikes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey('posts.id'))
    user_id = Column(Integer, ForeignKey('users.id'))