import React, { useState, useEffect } from 'react';
import globalStyles from '../styles/myGlobals.module.css';
import axios from 'axios';
import { CommentLikedByUserStatus, CommentProps, PostComment } from '../types/UserPost';
import styles from '../styles/comment.module.css'
import { SuccessResult } from '../types/Generic';

const Comment: React.FC<CommentProps> = ({ comment, user }) => {
  const [childComments, setChildComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [commentIsLikedByUser, setCommentIsLikedByUser] = useState<boolean>(false);
  const [commentNumLikes, setCommentNumLikes] = useState<number>(0);

  const fetchChildComments = () => {
    // just fetch children of the top-level passed comment
    axios.get<PostComment[]>(`http://localhost:8000/api/comments/${comment.id}/children/`)
      .then((res) => setChildComments(res.data))
      .catch((err) => console.log(err));
  };
  const fetchCommentUserLiked = () => { //TODO: userid
    axios.get<CommentLikedByUserStatus>(`http://localhost:8000/api/comments/${comment.id}/like/${1}/`)
      .then((res) => setCommentIsLikedByUser(res.data.status))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    fetchChildComments();
    fetchCommentUserLiked();
    setCommentNumLikes(comment.num_likes);
  }, []);

  const likeComment = () => {
    //post this like under id userid
    axios.post<SuccessResult>(`http://localhost:8000/api/comments/${comment.id}/like/${1}/`)  //TODO: userid
      .then((res) => {
        if(res.data.message) {
            if(commentIsLikedByUser) { //comment was already liked --> now is not
                setCommentNumLikes(commentNumLikes-1);
            } else {
                setCommentNumLikes(commentNumLikes+1);
            }

            setCommentIsLikedByUser(!commentIsLikedByUser)
        }
      })
      .catch((err) => console.log(err));
  };

  const submitComment = () => {
    const commentTrimmed = newComment.trim();
    if (commentTrimmed !== "") {
      axios.post<SuccessResult>(`http://localhost:8000/api/comments/${comment.id}/`, {
        content: commentTrimmed,
        user: user.id,
        post: comment.post,
      })
        .then((res) => {
          // Assuming you want to update the comment list after submitting
          fetchChildComments();
          // You may want to clear the comment input after submission
          setNewComment("");
        })
        .catch((err) => console.log(err));
    }
  };

  const handleLikeComment = ( ) => {
    likeComment();
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const renderComment = (comment:PostComment) => {
    return (
        <div className={styles.commentContainer}>
            <div className={styles.commentUserInfo}>
                <img src={user.profile_picture} alt="User" />
                {comment.user}
            </div>
            <div className={styles.commentContent}>{comment.content}</div>
            <div className={styles.commentFooter}>
                <div className={styles.likesTimestampWrapper}>
                    <i 
                        className={`bi me-2 ${styles.likePostButton} 
                                ${commentIsLikedByUser ? 
                                    `bi-heart-fill ${styles.likedPostHeart}` : 
                                    "bi-heart"}`} 
                        onClick={handleLikeComment}
                    >
                    </i>
                    {commentNumLikes}
                    <span>&nbsp; &bull; &nbsp;</span>
                    {comment.timestamp}
                    {comment.num_children}
                </div>

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
            </div>
        </div>
  )};

  const renderChildren = () => {
    return childComments.map((comment, index) => (
        <div key={index} className={styles.childComment}>
            <Comment comment={comment} user={user} />
        </div>
    ))
  };

  return (
    <main className="container">
      <div className={globalStyles.text1}>
        {/* <h1 className="text-uppercase text-center my-4">This comment</h1> */}
        <div className={styles.commentContainer}>
          {renderComment(comment)} {/* render the top level comment */}
          {renderChildren()}
        </div>
      </div>
    </main>
  );
};

export default Comment;