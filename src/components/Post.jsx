import React from "react";
import Avatar from "@material-ui/core/Avatar";
import "./Post.css";
const Post = ({ username, caption, imgUrl }) => {
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
    </div>
  );
};

export default Post;
