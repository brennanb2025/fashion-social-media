import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { UserPostProps } from '../types/UserPost';
import styles from '../styles/userPost.module.css'
import PostImageCarousel from './PostImageCarousel';
import PostBar from './PostBar';

const Post: React.FC<UserPostProps> = ({ user, post }) => {
  user.profile_picture = "https://fsm-app-bucket.s3.amazonaws.com/post_media/1/434be55b-6052-4e14-a15e-95dcf01b39c7";
  return (
    <div key={`post-${post.id}`} className={styles.post}>
        <div className={`card ${styles.card}`}>
            <div className={`card-body ${styles.cardBody}`}>
                <div className={styles.header}>
                    <img className={styles.profilePicture} src={user.profile_picture} alt="Profile" />
                    <h5 className={`card-title ${styles.cardTitle}`}>{post.title}</h5>
                </div>
                <PostImageCarousel post={post} />
                <h5 className={styles.cardCaption}>{post.caption}</h5>
                <h5 className={styles.cardTimestamp}>{post.timestamp}</h5>
                <PostBar post={post} user={user} /> 
                {/* TODO: userid */}
            </div>
        </div>
    </div>
  );
};

export default Post;
