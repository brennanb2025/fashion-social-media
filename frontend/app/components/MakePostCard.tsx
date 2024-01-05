import React, { useState, useEffect } from 'react';
import globalStyles from '../styles/myGlobals.module.css';
import axios from 'axios';
import { UserPost } from '../types/UserPost';
import { UserPostGridProps } from '../types/UserPost';
import ImageCarousel from './PostImageCarousel';
import styles from '../styles/userPostGrid.module.css'

//TODO: could change it to pass the whole user
const MakePostCard: React.FC<UserPostGridProps> = ({ id }) => {
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);

  const renderUserPosts = () => {
    return (
        <form>
            Todo
            <input type="submit" value="Create new post" />
      </form>
    );
  };

  return (
    <main className="container">
      <div className={globalStyles.text1}>
        <h1 className="text-uppercase text-center my-4">Make a new post</h1>
        <div className={styles.postsContainer}>
          {renderUserPosts()}
        </div>
      </div>
    </main>
  );
};

export default MakePostCard;