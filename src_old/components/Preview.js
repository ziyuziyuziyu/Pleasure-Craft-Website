import React, { useState, useEffect, useContext } from "react";
import ReactPlayer from "react-player/file";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100dvh",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    padding: useMediaQuery("(min-width: 600px)") ? "120px 64px" : "0px",
  },
  wrapper: {
    height: "100%",
    minWidth: "100%",
    aspectRatio: 16 / 9,
    borderRadius: "40px",
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    transition: "width .75s",
    cursor: "pointer",
  },
  window: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "all .5s",
    justifyContent: useMediaQuery("(min-width: 600px)") ? "" : "flex-start",
    paddingTop: useMediaQuery("(min-width: 600px)") ? "0" : "80px",
    position: "relative",
    // top: "13.33%",
    // bottom: "13.33%",
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  cont: {
    height: useMediaQuery("(min-width:600px)") ? "100%" : "75%",
    width: "85%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: "40px",
  },
  subtitle: {
    marginTop: "8px",
    position: "absolute",
    bottom: useMediaQuery("(min-width:600px)") ? 0 : 80,
    flexGrow: 1,
    width: "85%",
    maxWidth: "85%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "display 1s",
  },
}));

const endpoint = process.env.REACT_APP_STRAPIURL;

export const Preview = (props) => {
  const { data, index, options, playOptions } = props;
  const classes = useStyles();
  const navigate = useNavigate();
  const { state, api } = useContext(AppContext);
  const { videoMap, loadedVids } = state;
  const { setShowNav, setVideoMap, setLoadedVids } = api;

  const [previewUrl, setPreviewUrl] = useState("");

  const { projectName, name, role, client, medium, code, featured, preview } =
    data;

  const [showSubtitle, setShowSubtitle] = useState(false);

  const [url, setUrl] = useState(null);

  const [playing, setPlaying] = useState(false);

  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    let observer = new IntersectionObserver(doGrow, options);
    let playObserver = new IntersectionObserver(togglePlay, playOptions);
    let target = document.getElementById(`window-${name}`);
    playObserver.observe(target);
    if (!largeScreen) {
      observer.observe(target);
    }
    return () => {
      observer.unobserve(target);
      playObserver.unobserve(target);
    };
  }, []);

  function togglePlay(entry) {
    if (entry[0].isIntersecting) {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }
  useEffect(() => {
    let prevUrl =
      preview && preview.data && preview.data.attributes
        ? preview.data.attributes.url
        : featured.data.attributes.url;
    setPreviewUrl(prevUrl);

    // if (!videoMap[`${name}-preview`]) {
    //   setUrl(`http://${endpoint}${prevUrl}`);
    // } else {
    //   setUrl(videoMap[`${name}-preview`]);
    // }
  }, []);

  // useEffect(() => {
  //   console.log("url in useeffect: ", url);
  //   if (url && !videoMap[`${name}-preview`]) {
  //     fetch(url)
  //       .then((res) => res.blob())
  //       .then((blob) => {
  //         let temp = videoMap;
  //         let tempUrl = URL.createObjectURL(blob);
  //         temp[`${name}-preview`] = tempUrl;
  //         setUrl(tempUrl);
  //         setVideoMap(temp);
  //       });
  //   }
  // }, [url]);

  const switchView = () => {
    navigate(`project/${data.name}`);
  };

  const largeScreen = useMediaQuery("(min-width:600px)");

  function growTimer(container, wind) {
    wind.style.paddingTop = "0px";
    // container.style.transition = "width .75s, height .5s";
    container.style.transition = "all .5s";
    container.style.width = "95%";
    container.style.height = "90%";
    container.style.borderRadius = "80px";
    setShowNav(false);
  }

  function doGrow(entry) {
    let container = document.getElementById(`container-${name}`);
    let wind = document.getElementById(`window-${name}`);
    if (entry[0].isIntersecting) {
      let container = document.getElementById(`container-${name}`);
      let wind = document.getElementById(`window-${name}`);
      this.grow = setTimeout(() => growTimer(container, wind), 2000);
    } else {
      clearTimeout(this.grow);
      wind.style.paddingTop = "80px";
      container.style.width = "85%";
      container.style.height = "75%";
      container.style.borderRadius = "40px";
      setShowNav(true);
    }
  }

  // function growTimerLarge(container) {
  //   container.style.width = "100%";
  // }

  useEffect(() => {
    if (largeScreen) {
      let container = document.getElementById(`container-${name}`);
      let element = document.getElementById(`featured-${name}`);
      if (element) {
        if (showSubtitle) {
          container.style.transitionDuration = ".5s, 1s";
          container.style.transitionDelay = "0ms, 150ms";
          container.style.transitionProperty = "height, transform";
          container.style.height = "calc(100% - 32px)";
          // container.style.width = "100%";
          // container.style.transition = 'transform 1s';
          container.style.transform = `scale(${100 / 85}, 1)`;
          element.style.transition = "transform 1s";
          element.style.transform = `scale(1, ${100 / 85})`;
          // setTimeout(() => growTimerLarge(container), 2000);
        } else {
          // container.style.transitionDelay = "0ms, 0ms";
          // container.style.transitionProperty = "height, width";
          // container.style.minWidth = "85%";
          container.style.height = "100%";
          container.style.transform = "scale(1, 1)";
          element.style.transform = "scale(1, 1)";
        }
      }
    }
  }, [showSubtitle, largeScreen]);

  // SCROLL SKEW ANIMATION
  // useEffect(() => {
  //   // if (largeScreen) {
  //     let container = document.getElementById(`container-${name}`);
  //     let vwh = window.innerHeight;
  //     let factor = window.innerHeight * (largeScreen ? 0.65 : .85);
  //     let subtract = (scrollPos - (1 + index) * vwh).toFixed(0);
  //     let scale = 100 - ((subtract * 100) / factor).toFixed(0);
  //     let scaleReverse = 100 - ((subtract * -100) / factor).toFixed(0);
  //     if (subtract < factor && subtract > 0) {
  //       container.style.transformOrigin = "top";
  //       container.style.transform = `scaleY(${scale}%)`;
  //     }
  //     if (subtract > -1 * factor && subtract < 0) {
  //       container.style.transformOrigin = "bottom";
  //       container.style.transform = `scaleY(${scaleReverse}%)`;
  //     }
  //   // }
  // }, [scrollPos]);

  return (
    <div className={classes.root}>
      <div className={classes.window} id={`window-${name}`}>
        <div className={classes.cont} id={`container-${name}`}>
          <div
            id={`featured-${name}`}
            className={classes.wrapper}
            onMouseEnter={() => setShowSubtitle(true)}
            onMouseLeave={() => setShowSubtitle(false)}
            onClick={switchView}
          >
            <ReactPlayer
              id={`videoFrame-${name}`}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                borderRadius: "40px",
                overflow: "hidden",
                position: "absolute",
                top: 0,
                left: 0,
                alignContent: "center",
              }}
              url={
                videoMap[name]
                  ? videoMap[name]
                  : `http://${endpoint}${previewUrl}`
              }
              width="100%"
              height="auto"
              playing={playing}
              loop
              muted
              fluid={false}
              onReady={() => {
                let vids = [...loadedVids];
                if (!vids.includes(name)) {
                  vids.push(name);
                  setLoadedVids([...vids]);
                }
              }}
            />
          </div>
        </div>
        {(showSubtitle || !largeScreen) && (
          <div className={classes.subtitle}>
            <Typography
              color="primary"
              style={{
                fontFamily: "Square721",
                fontSize: largeScreen ? ".75rem" : ".6rem",
              }}
            >
              {projectName.toUpperCase()}
            </Typography>
            <Typography
              color="primary"
              style={{
                fontFamily: "Square721",
                fontSize: largeScreen ? ".75rem" : ".6rem",
              }}
            >
              {role.toUpperCase()}
            </Typography>
            {largeScreen && (
              <Typography
                color="primary"
                style={{
                  fontFamily: "Square721",
                  fontSize: largeScreen ? ".75rem" : ".6rem",
                }}
              >
                {medium.toUpperCase()}
              </Typography>
            )}
            <Typography
              color="primary"
              style={{
                fontFamily: "Square721",
                fontSize: largeScreen ? ".75rem" : ".6rem",
              }}
            >
              {code.toUpperCase()}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
