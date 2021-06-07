import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 1332,
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(0.5),
    color: "#fff",
    backgroundColor: "#111",
    "&:hover, &.Mui-focusVisible": {
      transition: "0.3s",
      color: "#fff",
      backgroundColor: "#333",
    },
    
  },
}));

const Scroll = ({ showBelow }, ref) => {
  const classes = useStyles();
  const [show, setShow] = useState(showBelow ? false : true);
  useEffect(() => {
    if (showBelow) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  });
  const handleScroll = () => {
    if (window.pageYOffset > showBelow) {
      if (!show) {
        setShow(true);
      } else {
        if (show) {
          setShow(false);
        }
      }
    }
  };
  const handleClick = () => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
  };
  return (
    <div>
      {show && (
        <IconButton onClick={handleClick} className={classes.root}>
          <KeyboardArrowUpIcon  style={{fontSize: "2rem"}} />
        </IconButton>
      )}
    </div>
  );
};

export default Scroll;
