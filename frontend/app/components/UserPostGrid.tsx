import React, { useState, useEffect } from 'react';
import globalStyles from '../styles/myGlobals.module.css';
import axios from 'axios';
import { UserPost, UserPostBarProps, UserPostGridProps } from '../types/UserPost';
import PostImageCarousel from './PostImageCarousel';
import PostBar from './PostBar';
import Post from './Post';
import styles from '../styles/userPostGrid.module.css'

const UserPostGrid: React.FC<UserPostGridProps> = ({ user }) => {
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);

  const fetchUserPosts = () => {
    // Assuming you have an API endpoint to fetch user posts
    axios.get<UserPost[]>(`http://localhost:8000/api/users/${user.id}/posts-full/`)
      .then((res) => setUserPosts(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const renderUserPosts = () => {
    return userPosts.map((post) => (
      <div key={post.id}>
        <Post post={ post } user={ user } />
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