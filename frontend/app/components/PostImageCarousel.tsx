import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { UserPost, Media, MediaItem, Item, ImageCarouselProps } from '../types/UserPost';
import styles from '../styles/imageCarousel.module.css'
import { PostImageMarker } from './PostImageMarker';
import Link from 'next/link';

const ImageCarousel: React.FC<ImageCarouselProps> = ({ userPost }) => {

  const [isHovered, setIsHovered] = useState(false);
  const sortedMedia = userPost.media.slice().sort((a, b) => a.index - b.index);
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {sortedMedia.map((media: Media) => (
        // <div className={styles.mediaInfo}> 
            <div key={media.id} className={`${styles.imageContainer} ${(isHovered && styles.hovered)}`} >
                <div className={styles.mediaRow}>
                    <div className={styles.mediaCol}>
                        <div className={styles.mediaContainer}>
                            <img 
                                src={media.bucket_key} 
                                alt={String(media.index)} 
                                className={styles.carouselImage}
                                onMouseEnter={() => setIsHovered(true)} //Also set hovered true when inside marker
                                onMouseLeave={() => setIsHovered(false)}
                            />
                            {media.mediaItems.map((mediaItem: MediaItem) => (
                                <div key={mediaItem.id}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    <PostImageMarker 
                                        x={mediaItem.item_position_percent_x} 
                                        y={mediaItem.item_position_percent_y}
                                    />
                                    
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.itemsCol}>
                        <div className={styles.mediaItems}>
                            {media.mediaItems.map((mediaItem: MediaItem) => (
                                <div key={mediaItem.id} className={styles.itemRow}>
                                    <Link href={`/search?item=${mediaItem.link}`}>
                                        {mediaItem.item.brand} {mediaItem.item.title} in {mediaItem.colorway}<br/>
                                    </Link>
                                    {mediaItem.item.item_type}<br/>
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>
            </div>
        // </div>
      ))}
    </Slider>
  );
};

export default ImageCarousel;
