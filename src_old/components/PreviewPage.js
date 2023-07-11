import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player/file";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    alignItems: "center",
    justifyContent: 'center',
    padding: "17.5% 7.5%",

    // marginTop: 'auto',
    // marginBottom: 'auto'
    // position: "sticky",
    // top: 120,
    // border: "1px solid green",
    // padding: "20% 15%",
    // boxSizing: 'border-box',
    // paddingTop: '120px',
    // paddingBottom: '120px',
    // paddingBottom: '15%'
  },
  smallRoot: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  wrapped: {
    height: "75%",
    width: "85%",
    position: "sticky",
    top: 120,
    // height: "auto",
    // width: "auto",
    // flexGrow: 1,
    // borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  window: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      // justifyContent: 'center',
      // border: "2px solid green",
      position: "sticky",
      top: '13.33%',
      bottom: '13.33%',
      height: "65%",
      width: "100%",
      // maxWidth: "85%",
      overflow: 'hidden',
    },
    wrapper: {
      // height: "auto",
      // width: "auto",
      height: "100%",
      // width: "85%",
      // marginTop: "120px",
      // marginRight: 'auto',
      // marginLeft: 'auto',
  
      // border: "2px solid blue",
      // borderRadius: "20px",
      // marginBottom: "8px",
      // objectFit: 'cover',
      // paddingTop: '56.25%',
      // boxSizing: "border-box",
      aspectRatio: 16 / 9,
      borderRadius: "40px",
      overflow: "hidden",
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
      transition: "width .75s",
      boxSizing: 'border-box',
      cursor: "pointer",
      // flexGrow: 1,
    },
  subtitle: {
    marginTop: "8px",
    position: "absolute",
    bottom: 0,
    flexGrow: 1,
    width: "85%",
    maxWidth: "85%",
    // marginRight: "auto",
    // marginLeft: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "display 1s",
  },
  subtitleSmall: {
    width: "85%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    left: "7.5%",
    right: "7.5%",
    bottom: "7.5%",
  },
}));

export const Preview = (props) => {
  const { data, scrollPos, index } = props;
  const classes = useStyles();
  const navigate = useNavigate();

  console.log(index);
  const [featuredUrl, setFeaturedUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);

  const viewRef = useRef(null);

  const {
    projectName,
    name,
    role,
    client,
    writeup,
    roles,
    director,
    code,
    featured,
    gallery,
    description,
  } = data;

  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    let featUrl = featured.data.attributes.url;
    let imgUrls = [];
    setFeaturedUrl(featUrl);
  }, []);

  const switchView = () => {
    navigate(`project/${data.name}`);
  };

  const largeScreen = useMediaQuery("(min-width:600px)");

  //   useEffect(() => {
  //     let element = document.getElementById(`videoFrame-${name}`);
  //     if (element) {
  //       if (showSubtitle) {
  //         element.style.width = "100%";
  //         element.style.height = "100%";
  //         element.style.borderRadius = "0px";
  //         // }
  //       } else {
  //         element.style.width = "85%";
  //         element.style.height = "70%";
  //         element.style.borderRadius = "20px";
  //       }
  //     }
  //   }, [showSubtitle]);

  useEffect(() => {
    if (largeScreen) {
      let element = document.getElementById(`featured-${name}`);
      if (element) {
        if (showSubtitle) {
          element.style.transition = "width .75s, height .5s";
          element.style.height = "calc(100% - 32px)";
          setTimeout(myTimer, 2000);
          function myTimer() {
            element.style.width = "100%";
          }
        } else {
          // element.style.transition = "width 1s";
          element.style.width = "";
          element.style.maxWidth = "85%";
          element.style.height = "100%";
        }
      }
    } else {
      let element = document.getElementById(`featured-${name}`);
      if (element) {
        if (showSubtitle) {
          element.style.transition = "width .75s, height .5s";
          element.style.width = "100%";
          element.style.height = "100%";
          element.style.borderRadius = "0px";
          // }
        } else {
          element.style.width = "85%";
          element.style.height = "70%";
          element.style.borderRadius = "20px";
        }
      }
    }
  }, [showSubtitle, largeScreen]);

  //   const [element, setElement] = useState(null);

  useEffect(() => {
    if (largeScreen) {
      console.log(scrollPos);
      let element = document.getElementById(`featured-${name}`);
      let vwh = window.innerHeight;
      let factor = window.innerHeight * .65;
      let subtract = (scrollPos - (1 + index) * vwh).toFixed(0);
      let scale = 100 - ((subtract * 100) / factor).toFixed(0);
      let scaleReverse = 100 - ((subtract * -100) / 400).toFixed(0);
      console.log(subtract);
      if (subtract < factor && subtract > 0) {
        console.log(`subtracting ${subtract} pixels`);
        // element.style.height = `calc(65% - ${subtract}px)`;
        element.style.transformOrigin = "top";
        element.style.transform = `scaleY(${scale}%)`;
        console.log(`scale(${scale}%)`);
      }
      if (subtract > (-1 * factor) && subtract < 0) {
        element.style.transformOrigin = "bottom";
        element.style.transform = `scaleY(${scaleReverse}%)`;
      }
    }

    // let el = document.getElementById(`featured-instagram`);
    // let rect = el.getBoundingClientRect();
    // let top = rect.top;
    // let bot = rect.bottom;
    // console.log('scrollPos: ', scrollPos)
    // console.log('top: ', top);
    // console.log('bottom: ', bot);
    // if (top < 120 && bot > 120) {
    //     // el.style.position = 'absolute';
    //     // el.style.top = 120;
    //     // el.style.left = 200;
    //     let height = (bot-120)*55/396;
    //     console.log(height)
    //     el.style.height = `${height}%`;
    // }
  }, [scrollPos]);

  //   var element = document.getElementById(`featured-instagram`) ? document.getElementById(`featured-instagram`) : '';
  //   let topPos = 'not found';
  //   topPos = element != '' ? element.getBoundingClientRect().bottom: 'not found';
  //   var leftPos = element != '' ? element.getBoundingClientRect().left: 'not found';

  //   function handleScroll () {
  //       console.log(window.scrollY)
  //       console.log(topPos);
  //   }

  //   useEffect(() => {
  //     console.log(topPos);
  //   }, [topPos])

  return (
    <>
      {largeScreen ? (
        <div className={classes.root}>
          <div className={classes.window}>
            <div
              // ref={viewRef}
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
                  alignContent: 'center',
                //   right: 0,
                //   bottom: 0,
                //   margin: "auto",
                }}
                url={`http://localhost:1337${featuredUrl}`}
                width="100%"
                height="auto"
                playing
                loop
                muted
                fluid={false}
              />
            </div>
            {showSubtitle && (
              <div className={classes.subtitle}>
                <Typography
                  style={{ fontFamily: "Square721", fontSize: "1rem" }}
                >
                  {projectName}
                </Typography>
                <Typography style={{ fontFamily: "Square721" }}>
                  {role}
                </Typography>
                <Typography style={{ fontFamily: "Square721" }}>
                  {client}
                </Typography>
                <Typography style={{ fontFamily: "Square721" }}>
                  {director}
                </Typography>
                <Typography style={{ fontFamily: "Square721" }}>
                  {code}
                </Typography>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={classes.smallRoot}>
          <div
            // ref={viewRef}
            id={`featured-${name}`}
            className={classes.wrapped}
            style={{
              boxSizing: "border-box",
              //   position: 'relative'
              //   aspectRatio: 16 / 9,
            }}
            onMouseEnter={() => setShowSubtitle(true)}
            onMouseLeave={() => setShowSubtitle(false)}
            onClick={switchView}
          >
            <ReactPlayer
              id={`videoFrame-${name}`}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                borderRadius: "20px",
                overflow: "hidden",
                position: "absolute",
                top: 0,
                bottom: 0,
                // right: 0,
                // bottom: 0,
                // transform: 'translate(-50%, -50%)',
                margin: "auto",
                alignContent: "center",
                transition: "width .5s, height 1s",
              }}
              url={`http://localhost:1337${featuredUrl}`}
              width="auto"
              height="100%"
              playing
              loop
              muted
              fluid={false}
            />
          </div>
          {/* {showSubtitle && ( */}
          <div className={classes.subtitleSmall}>
            <Typography style={{ fontFamily: "Square721", fontSize: ".8rem" }}>
              {projectName}
            </Typography>
            <Typography style={{ fontFamily: "Square721", fontSize: ".8rem" }}>
              {client}
            </Typography>
            <Typography style={{ fontFamily: "Square721", fontSize: ".8rem" }}>
              {code}
            </Typography>
          </div>
          {/* )} */}
        </div>
      )}
    </>
  );
};

export default Preview;
