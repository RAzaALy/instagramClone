import React, { useState, useEffect } from "react";
import Post from "./components/Post";
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Input } from "@material-ui/core";
import PostUpload from "./components/PostUpload";
import Scroll from './components/Scroll';
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSign, setOpenSign] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has log in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has log out
        setUser(null);
      }
    });
    return () => {
      //cleanup function
      unsubscribe();
    };
  }, [user, username]);
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  // modal style
  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #000",
      width: "40%",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));
  const classes = useStyles();
  const signup = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
  };
  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSign(false);
  };
  return (
    <>
      <div className="App">
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={() => setOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <form className="app__signup">
                <center>
                  <img className="app__headerImg" src="logo.svg" alt="logo" />
                </center>

                <Input
                  placeholder="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  placeholder="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" onClick={signup}>
                  Sign Up
                </Button>
              </form>
            </div>
          </Fade>
        </Modal>
        {/* Sing In Modal */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openSign}
          onClose={() => setOpenSign(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openSign}>
            <div className={classes.paper}>
              <form className="app__signup">
                <center>
                  <img className="app__headerImg" src="logo.svg" alt="logo" />
                </center>

                <Input
                  placeholder="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" onClick={signIn}>
                  Sign In
                </Button>
              </form>
            </div>
          </Fade>
        </Modal>
        {/* Header */}
        <div className="app__header">
          <img src="logo.svg" alt="logo" className="app__headerImg" />
          {user ? (
            <Button className="app__headerLogout" variant="outlined" color="primary" onClick={() => auth.signOut()}>
              Logout
            </Button>
          ) : (
            <div className="app__loginContainer">
              <Button variant="outlined" color="primary" onClick={() => setOpenSign(true)}>
                Sign In
              </Button>
              <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* posts */}
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            username={post.username}
            caption={post.caption}
            imgUrl={post.imgUrl}
          />
        ))}
        {user?.displayName ? (
          <PostUpload username={user.displayName} />
        ) : (
          console.log('ubable to upload')
        )}
        <Scroll showBelow={250} />
      </div>
    </>
  );
}

export default App;
