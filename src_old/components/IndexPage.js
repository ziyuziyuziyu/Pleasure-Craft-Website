import React, { useState, useContext, useEffect } from "react";
import ReactPlayer from "react-player/file";
import makeStyles from "@mui/styles/makeStyles";
import AppContext from "../context/AppContext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Fade from "@mui/material/Fade";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

import axios from "axios";

const useStyles = makeStyles(() => ({
  viewContainer: {
    position: "relative",
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "84px 64px 64px 64px",
    boxSizing: "border-box",
  },
  previewContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: "100px",
    boxSizing: "border-box",
  },
  viewWindow: {
    // height: "400px",
    minHeight: 0,
    // width: '80%',
    // maxWidth: "80%",
    maxHeight: "60%",
    height: "auto",
    maxWidth: "50%",
    borderRadius: "20px",
    overflow: "hidden",
    // display: 'flex',
    // flexGrow: 1,
    // height: 'auto',
    // width: 'auto',
    zIndex: 2,
  },
  bottomBox: {
    zIndex: 1,
    width: "100%",
    height: "auto",
    maxHeight: "80%",
    overflowY: "auto",
    zIndex: 1,
  },
}));

const endpoint = process.env.REACT_APP_STRAPIURL;

export const IndexPage = (props) => {
  const { state, api } = useContext(AppContext);
  const { projects, videoMap } = state;
  const { setVideoMap } = api;

  const classes = useStyles();

  let navigate = useNavigate();

  const largeScreen = useMediaQuery("(min-width:600px)");

  const [hover, setHover] = useState("");
  // const featuredUrl = projects.some(proj => proj.projectName == hover) ? projects[projects.indexOf(proj => proj.projectName == hover)]?.featured.data.attributes.url : '';
  const [featuredUrl, setFeaturedUrl] = useState("");

  useEffect(() => {
    if (hover !== "") {
      if (projects.some((proj) => proj.name === hover)) {
        let proj = projects[projects.findIndex((proj) => proj.name === hover)];
        if (proj.featured) {
          let url = proj.featured.data.attributes.url;
          setFeaturedUrl(`http://${endpoint}${url}`);
        }
      }
    } else {
      setFeaturedUrl("");
    }
  }, [hover]);

//   useEffect(() => {
//     console.log(featuredUrl);
//     const temp = videoMap;
//     if (!temp[`${hover}`] && featuredUrl !== '') {
//       console.log("got here");
//       fetch(featuredUrl)
//         .then((res) => res.blob())
//         .then((blob) => {
//           temp[`${hover}`] = URL.createObjectURL(blob);
//         });
//       console.log(temp);
//       if (Object.keys(temp).length >= 3) {
//         let first = Object.keys(videoMap)[0];
//         console.log(first);
//         delete temp[`${first}`];
//         console.log(temp);
//       }
//       setVideoMap(temp);
//     }
//   }, [featuredUrl]);

  let pro = {
    projectName: "The Ride 2.0",
    role: "Director",
    client: "Jesse Gibson",
    agency: null,
    director: "Pleasure Craft",
    code: "PC001",
    name: "theride",
    writeup:
      "Made at the height of a global pandemic, we decided to embrace life’s current limitations, building 90% of the film in CGI worlds of our own creation.\nWe put together a skeleton crew, shooting most of the project on green screen at 718 Studios in Brooklyn.\n\nFrom tropical quarantines the Pleasure Craft duo spent the next 60 days crafting digital alternate realities.\nA series of flawed utopias visualizing Jessie becoming “The Ride” as he moves through them. ",
    roles:
      "Director: Pleasure Craft, DP: Derek Hanson, Color: Ryan Berger, Art Direction: Matt Ching, Post/VFX: Pleasure Craft",
    createdAt: "2023-03-23T00:01:36.383Z",
    updatedAt: "2023-03-23T00:09:04.332Z",
    publishedAt: "2023-03-23T00:09:04.317Z",
    featured: {
      data: {
        id: 1,
        attributes: {
          name: "TheRide_Landing_Short.mp4",
          alternativeText: null,
          caption: null,
          width: null,
          height: null,
          formats: null,
          hash: "The_Ride_Landing_Short_ac9fe39430",
          ext: ".mp4",
          mime: "video/mp4",
          size: 17654.46,
          url: "/uploads/The_Ride_Landing_Short_ac9fe39430.mp4",
          previewUrl: null,
          provider: "local",
          provider_metadata: null,
          createdAt: "2023-03-23T00:08:29.069Z",
          updatedAt: "2023-03-23T00:08:29.069Z",
        },
      },
    },
    thumbnail: {
      data: {
        id: 2,
        attributes: {
          name: "The-Ride_16x9_generic_v2-02263.PNG",
          alternativeText: null,
          caption: null,
          width: 1920,
          height: 1080,
          formats: {
            thumbnail: {
              name: "thumbnail_The-Ride_16x9_generic_v2-02263.PNG",
              hash: "thumbnail_The_Ride_16x9_generic_v2_02263_480cb52df7",
              ext: ".PNG",
              mime: "image/png",
              path: null,
              width: 245,
              height: 138,
              size: 53.5,
              url: "/uploads/thumbnail_The_Ride_16x9_generic_v2_02263_480cb52df7.PNG",
            },
            small: {
              name: "small_The-Ride_16x9_generic_v2-02263.PNG",
              hash: "small_The_Ride_16x9_generic_v2_02263_480cb52df7",
              ext: ".PNG",
              mime: "image/png",
              path: null,
              width: 500,
              height: 281,
              size: 181.62,
              url: "/uploads/small_The_Ride_16x9_generic_v2_02263_480cb52df7.PNG",
            },
            medium: {
              name: "medium_The-Ride_16x9_generic_v2-02263.PNG",
              hash: "medium_The_Ride_16x9_generic_v2_02263_480cb52df7",
              ext: ".PNG",
              mime: "image/png",
              path: null,
              width: 750,
              height: 422,
              size: 393.95,
              url: "/uploads/medium_The_Ride_16x9_generic_v2_02263_480cb52df7.PNG",
            },
            large: {
              name: "large_The-Ride_16x9_generic_v2-02263.PNG",
              hash: "large_The_Ride_16x9_generic_v2_02263_480cb52df7",
              ext: ".PNG",
              mime: "image/png",
              path: null,
              width: 1000,
              height: 563,
              size: 700.32,
              url: "/uploads/large_The_Ride_16x9_generic_v2_02263_480cb52df7.PNG",
            },
          },
          hash: "The_Ride_16x9_generic_v2_02263_480cb52df7",
          ext: ".PNG",
          mime: "image/png",
          size: 528.72,
          url: "/uploads/The_Ride_16x9_generic_v2_02263_480cb52df7.PNG",
          previewUrl: null,
          provider: "local",
          provider_metadata: null,
          createdAt: "2023-03-23T00:08:29.946Z",
          updatedAt: "2023-03-23T00:08:42.734Z",
        },
      },
    },
    preview: {
      data: {
        id: 1,
        attributes: {
          name: "TheRide_Landing_Short.mp4",
          alternativeText: null,
          caption: null,
          width: null,
          height: null,
          formats: null,
          hash: "The_Ride_Landing_Short_ac9fe39430",
          ext: ".mp4",
          mime: "video/mp4",
          size: 17654.46,
          url: "/uploads/The_Ride_Landing_Short_ac9fe39430.mp4",
          previewUrl: null,
          provider: "local",
          provider_metadata: null,
          createdAt: "2023-03-23T00:08:29.069Z",
          updatedAt: "2023-03-23T00:08:29.069Z",
        },
      },
    },
  };
  //   let projects1 = Array(20).fill(pro);

  const goTo = (route) => {
    navigate(`../project/${route}`, { replace: true });
  };

  return (
    <div className={classes.viewContainer}>
      <div className={classes.bottomBox}>
        {projects.map((proj, index) => {
          return (
            <Grid
              container
              columns={{ xs: 3, md: 15 }}
              direction="row"
              alignItems="center"
              justifyContent="space-evenly"
              key={`${proj.projectName}-${index}`}
              sx={{ padding: "4px 0 4px 0" }}
            >
              <Grid
                sx={{
                  display: { xs: "none", md: "block" },
                  textAlign: "left",
                }}
                item
                xs={0}
                md={5}
                align="left"
                onMouseEnter={(e) => setHover(proj.name)}
                onMouseLeave={(e) => setHover("")}
                onClick={() => goTo(proj.name)}
              >
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".75rem" : ".6rem",
                  }}
                >
                  {proj.projectName.toUpperCase()}
                </Typography>
              </Grid>
              <Grid
                item
                xs={1}
                md={3}
                sx={{ textAlign: { xs: "left", md: "center" } }}
              >
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".75rem" : ".6rem",
                  }}
                >
                  {proj.client.toUpperCase()}
                </Typography>
              </Grid>
              <Grid item xs={1} md={3} sx={{ textAlign: "center" }}>
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".75rem" : ".6rem",
                  }}
                >
                  {proj.role.toUpperCase()}
                </Typography>
              </Grid>
              <Grid
                sx={{
                  display: { xs: "none", md: "block", textAlign: "center" },
                }}
                item
                xs={0}
                md={3}
              >
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".75rem" : ".6rem",
                  }}
                >
                  {proj.medium.toUpperCase()}
                </Typography>
              </Grid>
              <Grid
                item
                xs={1}
                md={1}
                sx={{
                  textAlign: { xs: "right", md: "center" },
                }}
              >
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".75rem" : ".6rem",
                  }}
                >
                  {proj.code.toUpperCase()}
                </Typography>
              </Grid>
            </Grid>
          );
        })}
      </div>
      <div
        className={classes.previewContainer}
        style={{ display: largeScreen ? "flex" : "none" }}
      >
        {/* {hover != "" && featuredUrl !== "" ? ( */}
        <Fade in={hover != "" && featuredUrl !== ""} timeout={25}>
          <div className={classes.viewWindow}>
            {/* <ReactPlayer
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  borderRadius: "40px",
                  overflow: "hidden",
                }}
                url={`http://${endpoint}${featuredUrl}`}
                playing
                loop
                muted
              /> */}
            <video
              height="auto"
              width="100%"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                overflow: "hidden",
                borderRadius: "20px",
              }}
              src={videoMap[hover] ? videoMap[hover] : featuredUrl}
            />
          </div>
        </Fade>
        {/* ) : null} */}
      </div>
    </div>
  );
};

export default IndexPage;
