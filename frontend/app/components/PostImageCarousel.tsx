import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { UserPost, Media, MediaItem, Item } from '../types/UserPost';
import styles from '../styles/imageCarousel.module.css'

interface ImageCarouselProps {
  userPost: UserPost;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ userPost }) => {

  const sortedMedia = userPost.media.slice().sort((a, b) => a.index - b.index);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {sortedMedia.map((media: Media) => (
        <div key={media.id}>
          <img 
            src={media.bucket_key} 
            alt={String(media.index)} 
            className={styles.carouselImage}
          />
          <div>
            {media.mediaItems.map((mediaItem: MediaItem) => (
                <div key={mediaItem.id}>
                    {mediaItem.item_position_percent_x}<br/>
                    {mediaItem.item_position_percent_y}<br/>
                    {mediaItem.colorway}<br/>
                    {mediaItem.link}<br/>
                    {mediaItem.item.id}<br/>
                    {mediaItem.item.title}<br/>
                    {mediaItem.item.brand}<br/>
                    {mediaItem.item.item_type}<br/>
                </div>
            ))}
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default ImageCarousel;
