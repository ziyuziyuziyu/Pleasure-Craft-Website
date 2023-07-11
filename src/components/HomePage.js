import React, { useState, useContext, useEffect, useRef } from "react";
import makeStyles from "@mui/styles/makeStyles";
import Fade from "@mui/material/Fade";
import AppContext from "../context/AppContext";
import Preview from "./Preview";
import HomeLogo from "../threejs/HomeLogo";
import useMediaQuery from "@mui/material/useMediaQuery";
import Footer from "./Footer";



const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    //backgroundColor: "rgb(237,239,240)",
    backgroundColor:"#dde1e1", //#d5d8d6, 

  },

  
  scrollView: {
    width: "100%",
    height: "100vh",
    overflowY: "scroll",
  },

  viewContainer: {
    position: "relative",
    height: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },

  "@keyframes fadeout": {
    "0%": {
      opacity: 1,
    },
    "100%": {
      opacity: 0,
    },
  },

  loadingScreen: {
    position: "fixed",
    zIndex: 15,
    height: "100vh",
    width: "100vw",
    top: 0,
    left: 0,
    fontSize:".7rem",
    //backgroundColor: "white",//
    //backgroundColor: "rgb(237,239,240)",
    backgroundColor:"#dde1e1",
    opacity: 1,
    color: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));



export const HomePage = (props) => {
  const { state, api } = useContext(AppContext);
  const { projects, config, showLoading } = state;
  const { setShowLogo } = api;

  const largeScreen = useMediaQuery("(min-width:600px)");

  const classes = useStyles();
  const viewRef = useRef();

  useEffect(() => {
    let logoObserver = new IntersectionObserver(showHide, logoObserverOptions);
    let target = document.getElementById("logo-container");
    if (largeScreen) {
      logoObserver.observe(target);
    }
    return () => {
      logoObserver.unobserve(target);
    };
  }, []);

  let videoObserverOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.8,
  };

  let logoObserverOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.2,
  };

  let playObserverOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  function showHide(entry) {
    if (entry[0].isIntersecting) {
      setShowLogo(false);
    } else {
      setShowLogo(true);
    }
  }

 

  return (
    <div className={classes.root}>
      <Fade in={showLoading} unmountOnExit timeout={500}>
        <div className={classes.loadingScreen}>LOADING</div>
      </Fade>
      <div className={classes.scrollView} ref={viewRef} id="scrollview">
        <div className={classes.viewContainer} /*style={{height: largeScreen ? '100vh' : '100%'}}*/ id="logo-container">
          <HomeLogo/>
        </div>
        {projects.map(
          (proj, ind) =>
            ((config && config === []) ||
              (config && config.length > 0 && config.includes(proj.name))) && (
              <div className={classes.viewContainer}>
                <Preview
                  options={videoObserverOptions}
                  playOptions={playObserverOptions}
                  data={proj}
                  index={ind}
                />
              </div>
            )
        )}
              
        <div style={{ width: "100%" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;