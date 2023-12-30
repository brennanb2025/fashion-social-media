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
    item: Item,
    media: Media,
};