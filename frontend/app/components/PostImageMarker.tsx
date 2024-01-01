import { MarkerProps } from "../types/UserPost";
import styles from '../styles/imageCarousel.module.css';

export const PostImageMarker: React.FC<MarkerProps> = ({ x, y }) => {

    return (
      <div
        className={styles.marker}
        style={{ top: `${y}%`, left: `${x}%` }}
      >
        <div className={styles.markerInner}></div>
      </div>
    );
  };