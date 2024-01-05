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
    usePost: UserPost,
}

export type UserPostGridProps = {
    id: number
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
}

export type PostNumLikes = {
    num_likes: number,
}

export type PostLikedByUserStatus = {
    status: boolean,
}


export interface ImageCarouselProps {
    userPost: UserPost;
}

export interface MarkerProps {
    x: number;
    y: number;
}

export interface UserPostBarProps {
    post: UserPost;
    userid: number;
}