import React, { useState } from "react";
import { Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
import EmojiEmotionsRoundedIcon from "@material-ui/icons/EmojiEmotionsRounded";
import { storage, db } from "../firebase";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import firebase from "firebase";
import "./PostUpload.css";
const PostUpload = ({ username }) => {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [post, setPost] = useState(null);
  const [emoji, setEmoji] = useState({ showEmojis: false });


  const handleChange = (e) => {
    if (e.target.files[0]) {
      setPost(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    const uploadPost = storage.ref(`images/${post.name}`).put(post);
    uploadPost.on(
      "state_changed",
      (snapshot) => {
        //pgorgress function ... 😄
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //error Function:
        console.log(error);
        alert(error.message);
      },
      () => {
        //Final function: 🚀
        storage
          .ref("images")
          .child(post.name)
          .getDownloadURL()
          .then((url) => {
            //post the image inside the database:
            db.collection("posts").add({
              username: username,
              caption: caption,
              imgUrl: url,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setProgress(0);
            setCaption("");
            setPost(null);
          });
      }
    );
  };

  const closeMenu = (e) => {
    setEmoji(
      {
        showEmojis: false,
      },
      
    );
  };
  const showEmojis = (e) => {
    setEmoji(
      {
        showEmojis: true,
      },
     
    );
  };

  const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
      padding: "1rem",
      fontSize: "1.5rem",
      width: "12%",
    },
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "100%",
      },
    },
    progress: {
      width: "100%",
    },
  }));
  const classes = useStyles();
  return (
    <div className="PostUpload">
      {/* following steps for upload post image  🔥 🚀*/}

      {/* Caption Input  🏒*/}
      {/* <progress className="PostUpload__progress" value={progress} max="100" /> */}
      <div className={classes.progress}>
        <LinearProgress
          className="progress"
          variant="determinate"
          value={progress}
        />
      </div>
      {/* File upload 🆙 */}
      <input
        className="custom-file-input"
        type="file"
        onChange={handleChange}
      />

      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          className="caption"
          type="text"
          value={caption}
          id="outlined-basic"
          label="Take a Caption"
          variant="outlined"
          onChange={(e) => setCaption(e.target.value)}
        />
      </form>

      {/* Post Btn 🅱️ */}
      <div className="cotnainer">


      {emoji.showEmojis ? (
        <>
          <Picker
            showPreview={false}
            emoji="point_up"
            emojiSize={30}
            showEmojis={true}
            emojiTooltip={true}
            className={styles.emojiPicker}
            title="WeChat"
            onSelect={(emoji) => setCaption(caption + emoji.native)}
          />
          <Button
          title="pick emoji" 
          onClick={closeMenu}
          variant="outlined"
          color="primary"
          className={classes.button}
          startIcon={<EmojiEmotionsRoundedIcon />}
        >
          Emoji
        </Button>
        </>
      ) : (
        <Button
          title="pick emoji" 
          onClick={showEmojis}
          variant="outlined"
          color="primary"
          className={classes.button}
          startIcon={<EmojiEmotionsRoundedIcon />}
        >
          
        </Button>
      )}


   
        <Button
          variant="outlined"
          color="primary"
          title="upload" 
          onClick={handleUpload}
          className={classes.button}
          startIcon={<CloudUploadIcon />}
        >
          
        </Button>
      </div>
    </div>
  );
};

export default PostUpload;
const styles = {
    emojiPicker: {
      cursor: "pointer",
      zIndex: 333,
      position: "fixed",
      bottom: "3.5%",
      left: "4%",
      border: "none",
      margin: 0,
    },
  };