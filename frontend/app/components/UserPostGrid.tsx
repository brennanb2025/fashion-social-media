import React, { useState, useEffect } from 'react';
import globalStyles from '../styles/myGlobals.module.css';
import axios from 'axios';
import { UserPost, UserPostBarProps, UserPostGridProps } from '../types/UserPost';
import PostImageCarousel from './PostImageCarousel';
import PostBar from './PostBar';
import styles from '../styles/userPostGrid.module.css'

const UserPostGrid: React.FC<UserPostGridProps> = ({ id }) => {
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);

  const fetchUserPosts = () => {
    // Assuming you have an API endpoint to fetch user posts
    axios.get<UserPost[]>(`http://localhost:8000/api/users/${id}/posts-full/`)
      .then((res) => setUserPosts(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const renderUserPosts = () => {
    return userPosts.map((post) => (
      <div key={post.id} className={styles.post}>
        <div className={`card ${styles.card}`}>
          <div className={`card-body ${styles.cardBody}`}>
            <h5 className={`card-title ${styles.cardTitle}`}>{post.title}</h5>
            <PostImageCarousel userPost={post} />
            <h5 className={styles.cardCaption}>{post.caption}</h5>
            <h5 className={styles.cardTimestamp}>{post.timestamp}</h5>
            <PostBar post={post} userid={id} />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <main className="container">
      <div className={globalStyles.text1}>
        <h1 className="text-uppercase text-center my-4">Posts</h1>
        <div className={styles.postsContainer}>
          {renderUserPosts()}
        </div>
      </div>
    </main>
  );
};

export default UserPostGrid;