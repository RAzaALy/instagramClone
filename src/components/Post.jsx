import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase";
import firebase from 'firebase'
import "./Post.css";
const Post = ({ username, caption, imgUrl, postId,user }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp','desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);
  const postComment = (e) => {
    e.preventDefault();
    db.collection('posts').doc(postId).collection('comments').add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    setComment('');
  }
  return (
    <div className="post">
      <div className="post__header">
        {/* header -> avater +_ username */}
        <Avatar className="post__avatar" alt="RAza ALy" src="me.png" />
        <h3>{username}</h3>
      </div>

      {/* image */}
      <img className="post__img" src={imgUrl} alt="avatar" />
      <h4 className="post__txt">
        {/* username + caption */}
        <strong>{username} :</strong> {caption}
      </h4>
     {/* comments here */}
     <div className="post__comments">
       {
         comments.map((comment) => (
           <p className="post__comment">
            <strong>{comment.username} : </strong>
             {comment.text}
           </p>
         ))
       }
     </div>
     { user && (
      <form className="post__commentBox">
        <input
          type="text"
          className="post__input"
          placeholder="take a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="post__button"
          disabled={!comment}
          type="submit"
          onClick={postComment}
        >Post</button>
      </form>
     )}
     
    </div>
  );
};

export default Post;
