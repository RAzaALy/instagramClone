import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase";
import firebase from "firebase";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import "./Post.css";

const Post = ({username, caption, imgUrl, postId, user }) => {
  // console.log(username);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [emoji, setEmoji] = useState({ showEmojis: false });

  //get comments from 🔥 db:
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    //celanup function:
    return () => {
      unsubscribe();
    };
  }, [postId]);
  //post a comment 👍
  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };
  const closeMenu = (e) => {
    setEmoji({
      showEmojis: false,
    });
  };
  const showEmojis = (e) => {
    setEmoji({
      showEmojis: true,
    });
  };

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
        <h3 className="post__commentTitle">Comments</h3>
        {comments.map((comment, index) => (
          <p className="post__comment" key={index}>
            <strong>{comment.username} : </strong>
            {comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form className="post__commentBox">
          <input
            type="text"
            className="post__input"
            placeholder="take a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button postBtn"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
          {emoji.showEmojis ? (
            <>
              <Picker
                showPreview={false}
                emoji="point_up"
                emojiSize={30}
                showEmojis={true}
                emojiTooltip={true}
                className={styles.emojiPicker}
                title="comment"
                onSelect={(emoji) => setComment(comment + emoji.native)}
              />
              <button
                title="pick emoji"
                onClick={closeMenu}
                className="post__button"
              >
                😄
              </button>
            </>
          ) : (
            <button
              title="pick emoji"
              onClick={showEmojis}
              className="post__button"
            >
              😄
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default Post;
const styles = {
  emojiPicker: {
    cursor: "pointer",
    zIndex: 333,
    position: "fixed",
    bottom: "12%",
    left: "4%",
    border: "none",
    margin: 0,
  },
};
