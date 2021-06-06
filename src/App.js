import React, { useState, useEffect } from "react";
import Post from "./components/Post";
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Input } from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PostUpload from "./components/PostUpload";
import Scroll from "./components/Scroll";
// import InstagramEmbed from "react-instagram-embed";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSign, setOpenSign] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // 🔥 base authentication:
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has log in
        // console.log(authUser);
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

  //get post from databas 🔥;
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

  // 🙂 modal style
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
  //signup functinality 🚀
  const signup = (e) => {
    e.preventDefault();
    if(username.length > 2){
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        toast.success(`Welcome ${username} to Instagram Clone`, {
          position: "top-right",
          zIndex: 43343434,
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => {
        toast.error(`${error.message}`, {
          position: "top-right",
          zIndex: 43343434,
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    }else{
      toast.warning(`Username must contain 3 characters.`, {
        position: "top-right",
        zIndex: 43343434,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setOpen(false);
  };
  //sign in functionality:
  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        toast.success(`Welcome to Instagram Clone App`, {
          position: "top-right",
          zIndex: 43343434,
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        toast.error(`${error.message}`, {
          position: "top-right",
          zIndex: 43343434,
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    setOpenSign(false);
  };

  return (
    <>
      <div className="App">
        <ToastContainer style={{ fontSize: "1.4rem" }} />
        {/* signup modal */}
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
            <Button
              className="app__headerLogout"
              variant="outlined"
              color="primary"
              onClick={() => {
                auth.signOut();
                toast.success(`You have successfully Log out.`, {
                  position: "top-right",
                  zIndex: 43343434,
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }}
            >
              Logout
            </Button>
          ) : (
            <div className="app__loginContainer">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenSign(true)}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpen(true)}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* posts */}
        <div className="app__posts">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              user={user}
              postId={id}
              username={post.username}
              caption={post.caption}
              imgUrl={post.imgUrl}
            />
          ))}
        </div>
        {/* <InstagramEmbed
          url="https://www.instagram.com/p/B_uf9dmAGPw/"
          maxWidth={320}
          hideCaption={false}
          containerTagName="div"
          protocol=""
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        /> */}
        {user?.displayName && <PostUpload username={user.displayName} />}
        <Scroll showBelow={250} />
      </div>
    </>
  );
}

export default App;
