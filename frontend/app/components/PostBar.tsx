//Below a post:
// like button, num likes, comments

import "bootstrap-icons/font/bootstrap-icons.css";

import React, { useState, useEffect } from 'react';
import globalStyles from '../styles/myGlobals.module.css';
import axios from 'axios';
import { UserPost, PostComment, PostNumLikes, UserPostBarProps, PostLikedByUserStatus } from '../types/UserPost';
import { SuccessResult } from "../types/Generic";
import styles from '../styles/userPostBar.module.css'

const PostBar: React.FC<UserPostBarProps> = ({ post, userid }) => {
  const [postComments, setPostComments] = useState<PostComment[]>([]);
  const [postNumLikes, setPostNumLikes] = useState<number>(0); //default to 0?
  //const [postLikeResult, setPostLikeResult] = useState<string>("");
  const [postIsLikedByUser, setPostIsLikedByUser] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");

  const fetchPostComments = () => {
    axios.get<PostComment[]>(`http://localhost:8000/api/posts/${post.id}/comments/`)
      .then((res) => setPostComments(res.data))
      .catch((err) => console.log(err));
  };
  const fetchPostNumLikes = () => {
    axios.get<PostNumLikes>(`http://localhost:8000/api/posts/${post.id}/num_likes/`)
      .then((res) => setPostNumLikes(res.data.num_likes))
      .catch((err) => console.log(err));
  };
  const fetchPostUserLiked = () => {
    axios.get<PostLikedByUserStatus>(`http://localhost:8000/api/posts/${post.id}/like/${userid}/`)
      .then((res) => setPostIsLikedByUser(res.data.status))
      .catch((err) => console.log(err));
  }

  const likePost = () => {
    //post this like under id userid
    axios.post<SuccessResult>(`http://localhost:8000/api/posts/${post.id}/like/${userid}/`) 
      .then((res) => {
        //setPostLikeResult(res.data.message);
        if(res.data.message) {
            if(postIsLikedByUser) { //post was already liked --> now is not
                setPostNumLikes(postNumLikes-1);
            } else {
                setPostNumLikes(postNumLikes+1);
            }

            setPostIsLikedByUser(!postIsLikedByUser)
        }
      })
      .catch((err) => console.log(err));
  };

  const submitComment = () => {
    const commentTrimmed = newComment.trim();
    if (commentTrimmed !== "") {
      axios.post<SuccessResult>(`http://localhost:8000/api/posts/${post.id}/comment/`, {
        content: commentTrimmed,
        user: userid, // Assuming you want to associate the comment with the current user
      })
        .then((res) => {
          // Assuming you want to update the comment list after submitting
          fetchPostComments();
          // You may want to clear the comment input after submission
          setNewComment("");
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    fetchPostComments();
    fetchPostNumLikes();
    fetchPostUserLiked();
  }, []);

  const handleLikeClick = () => {
    likePost()
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const renderPostBar = () => {
    return (
        <div className={styles.postBar}>
            <span>
                <i 
                    className={`bi me-2 ${styles.likePostButton} 
                            ${postIsLikedByUser ? 
                                `bi-heart-fill ${styles.likedPostHeart}` : 
                                "bi-heart"}`} 
                    onClick={handleLikeClick}
                >
                </i>
                {postNumLikes}
            </span>
            {/* Add a text field to enter a new comment */}
            <div className={`mt-3 ${styles.commentInputContainer}`}>
                <input
                    className={styles.commentInput}
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={handleCommentChange}
                />
                <button 
                    onClick={submitComment}
                    className={styles.commentButton}
                >
                    <i className="bi bi-send"></i>
                </button>
            </div>
            <div className={styles.comments}>
                {postComments.map((comment, index) => (
                    <div key={index}>
                        Put in a box. Make own component.
                        User: {comment.user}<br/>
                        Content: {comment.content}<br/>
                        time: {comment.timestamp}<br/>
                        <i 
                            /*className={`bi me-2 ${styles.likePostButton} 
                                    ${commentIsLikedByUser ? 
                                        `bi-heart-fill ${styles.likedPostHeart}` : 
                                        "bi-heart"}`} 
                            onClick={handleLikeClick}*/
                        >
                        </i>
                        {comment.num_likes}
                    </div>
                ))}
            </div>
        </div>
    );
  };

  return (
    <main className="container">
        {renderPostBar()}
    </main>
  );
};

export default PostBar;