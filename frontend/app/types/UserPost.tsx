export type UserPost =  {
    id: number, 
    title: string, 
    caption: string, 
    owner: number,
    timestamp: string, 
    num_likes: number,
    media: Media[],
}
  
export interface UserPostProps {
    user: User,
    post: UserPost,
}

export type UserPostGridProps = {
    user: User,
};

export type Item = {
    id: number, 
    title: string,
    brand: string,
    item_type: string,
};

export type Media = {
    id: number, 
    bucket_key: string,
    index: number,
    mediaItems: MediaItem[]
};

export type MediaItem = {
    id: number, 
    item_position_percent_x: number,
    item_position_percent_y: number,
    colorway: string,
    link: string,
    size: string,
    item: Item,
    media: Media,
};

//TODO: must double check
export type PostComment = {
    id: number,
    post: number, 
    parent_comment: number, 
    user: number, 
    timestamp: string, 
    content: string, 
    num_likes: number,
    num_children: number,
}

export interface CommentProps {
    comment: PostComment,
    user: User,
}

export type PostNumLikes = {
    num_likes: number,
}

export type CommentNumChildren = {
    num_children: number,
}

export type PostLikedByUserStatus = {
    status: boolean,
}
export type CommentLikedByUserStatus = {
    status: boolean,
}


export interface ImageCarouselProps {
    post: UserPost;
}

export interface MarkerProps {
    x: number;
    y: number;
}

import { User } from './User';
export interface UserPostBarProps {
    post: UserPost;
    user: User;
}