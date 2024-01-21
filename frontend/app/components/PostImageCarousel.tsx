import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { UserPost, Media, MediaItem, Item, ImageCarouselProps } from '../types/UserPost';
import styles from '../styles/imageCarousel.module.css'
import '../styles/imageCarousel.module.css';
import { PostImageMarker } from './PostImageMarker';
import Link from 'next/link';
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";

const PostImageCarousel: React.FC<ImageCarouselProps> = ({ post }) => {

  const [isHovered, setIsHovered] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);

  // must be more than 0.3 seconds for image to stop moving before showing markers.
  const timeoutTime = 301; 
  
  const sortedMedia = post.media.slice().sort((a, b) => a.index - b.index);
  const settings = {
    dots: true,
    swipeToSlide: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const itemInfoRef = useRef<Array<HTMLDivElement | null>>([]);
  
  useEffect(() => { //proc on sortedMedia
    const totalLength = sortedMedia.reduce( //get total length - all mediaItems
        (sum,m) => sum+=m.mediaItems.length,
        0
    );
    itemInfoRef.current = itemInfoRef.current.slice(0, totalLength);
  }, [sortedMedia]);

  const setHovered = (isHovered : boolean) => {
    setIsHovered(isHovered);
  }

  // wrap showing markers on timeout in useEffect
  // makes it so that if called while timeout is running it will cancel it.
  useEffect(() => {
    if(!isHovered) { //if setting hovered to off, immediately hide markers.
        setShowMarkers(isHovered);
    } else {
        const animationTimeout = setTimeout(() => {
            setShowMarkers(isHovered);
            updateItemsOutOfView(); //initialize this itemsOutOfView state var on hover.
            //so that we can set hide the arrows for initially out of bounds items.
        }, timeoutTime);
        return () => clearTimeout(animationTimeout);
    }
  }, [isHovered])


  const itemContainerRef = useRef<HTMLDivElement>(null);

  const [itemsOutOfView, setItemsOutOfView] = useState<number[]>([])
  const handleItemScroll = () => {
    updateItemsOutOfView();
    updateXarrow();
  }

  const updateItemsOutOfView = () => {
    const container = itemContainerRef.current;
    const containerRect = container!.getBoundingClientRect();
    
    if (!container) return;

    const itemRows = container.querySelectorAll(`.${styles.itemRow}`);

    const newItemsOutOfView: number[] = [];
    itemRows.forEach((itemRow) => {
      const rect = itemRow.getBoundingClientRect();

      const midPoint = (rect.top + rect.bottom)/2

      // Check if the itemRow is outside the container
      if (
            midPoint <= containerRect.top || 
            midPoint >= containerRect.bottom ) {
        const itemId = parseInt(itemRow.id.replace('itemInfo-', ''), 10);
        newItemsOutOfView.push(itemId);
      }
    });
    setItemsOutOfView(newItemsOutOfView);
  }

//   useEffect(() => {
//     updateItemsOutOfView();
//   }, [isHovered])

  const updateXarrow = useXarrow();

  return (
    <div className={styles.carouselContainer}
            onMouseEnter={() => setHovered(true)} 
            onMouseLeave={() => setHovered(false)}>
        <Xwrapper>
        <Slider {...settings} className={styles.mySlickSlide}>
        {sortedMedia.map((media: Media) => (
            // <div className={styles.mediaInfo}> 
                <div key={media.id} 
                    className={`${styles.imageContainer} 
                    ${(isHovered && styles.hovered)}
                    ${(showMarkers && styles.showMarkers)}`} >
                    <div className={styles.mediaCol}>
                        <div className={styles.mediaRow}>
                            <div className={styles.mediaContainer}>
                                <div className={styles.imageMarkerRelativeLocator}>
                                    <img 
                                        src={media.bucket_key} 
                                        alt={String(media.index)} 
                                        className={styles.carouselImage}
                                    />
                                    {media.mediaItems.map((mediaItem: MediaItem, i:number) => (
                                        <div 
                                                key={mediaItem.id} 
                                                className={`${
                                                    itemsOutOfView.includes(mediaItem.id) ? 
                                                        styles.outOfView : 
                                                        ''
                                                    }`}>
                                            <div //this div is solely for locating the arrow
                                                id={`marker-${mediaItem.id}`} 
                                                style={{ 
                                                    top: `${mediaItem.item_position_percent_y}%`, 
                                                    left: `${mediaItem.item_position_percent_x}%` 
                                                }}
                                                className={styles.markerInvisibleDummy}
                                            />
                                            <PostImageMarker 
                                                x={mediaItem.item_position_percent_x} 
                                                y={mediaItem.item_position_percent_y}
                                            />
                                            {/* only draw arrow if end ref is not null */}
                                            {itemInfoRef.current[i] != null &&
                                                <div className={styles.arrow}>
                                                    <Xarrow
                                                        startAnchor={'right'}
                                                        endAnchor={'left'}
                                                        //showHead={false}
                                                        start={`marker-${mediaItem.id}`}
                                                        /* end={itemInfoRef.current[i]!!} */
                                                        end={`itemInfo-${mediaItem.id}`}
                                                        color={'#d1d1d1'}
                                                        strokeWidth={2}
                                                    />
                                                </div>
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.itemsCol}
                                ref={itemContainerRef}
                                onScroll={() => handleItemScroll()}>
                            <div className={styles.mediaItems}>
                                {media.mediaItems.sort((a,b) => 
                                    //sort the items to ensure highest up shows up first in the list.
                                    //(avoid crossing arrows)
                                    a.item_position_percent_y - b.item_position_percent_y
                                ).map((mediaItem: MediaItem, i:number) => (
                                    <div 
                                        id={`itemInfo-${mediaItem.id}`}
                                        key={mediaItem.id} 
                                        className={styles.itemRow}
                                        ref={el => itemInfoRef.current[i] = el} 
                                    >
                                        {mediaItem.item.item_type}<br/>
                                        <Link href={`/search-item/${mediaItem.item.id}`}>
                                            <i className="bi bi-search me-2"></i>
                                        </Link>
                                        <a href={mediaItem.link}>
                                            {mediaItem.item.brand} {mediaItem.item.title} in {mediaItem.colorway}<br/>
                                            (size {mediaItem.size})<br/>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            // </div>
        ))}
        </Slider>
        </Xwrapper>
    </div>
  );
};

export default PostImageCarousel;
