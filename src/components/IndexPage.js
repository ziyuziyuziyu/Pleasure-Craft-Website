import React, { useState, useContext, useEffect } from "react";
import ReactPlayer from "react-player/file";
import makeStyles from "@mui/styles/makeStyles";
import AppContext from "../context/AppContext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Footer from "./Footer";
import Button from "@mui/material/Button";


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
    //background: "rgb(237,239,240)",
    backgroundColor:"#dde1e1",
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
    paddingTop: "200px",
    boxSizing: "border-box",
  },

  viewWindow: {
    minHeight: 0,
    maxHeight: "30%",
    height: "auto",
    maxWidth: "50%",
    borderRadius: "20px",
    overflow: "hidden",
    zIndex: 2,
    boxShadow: "rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset",
  },

  bottomBox: {
    zIndex: 1,
    width: "100%",
    height: "auto",
    maxHeight: "80%",
    overflowY: "auto",
    // paddingBottom: '64px',
    zIndex: 1,
  },


  
}));

const endpoint = process.env.REACT_APP_STRAPIURL;

export const IndexPage = (props) => {
  const { state, api } = useContext(AppContext);
  const { projects, videoMap } = state;

  const classes = useStyles();

  let navigate = useNavigate();

  const largeScreen = useMediaQuery("(min-width:600px)");

  const [hover, setHover] = useState("");
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

  const goTo = (route) => {
    navigate(`../project/${route}`, { replace: true });
  };

  return (
    <div
      className={classes.viewContainer}
      style={{
        padding: largeScreen ? "84px 24px 44px 24px" : "84px 32px 64px 32px",
      }}
    >
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
              >
                <Button

                className={classes.indexButton}
                style={{
                  display:"block",
                  position:"absolute",
                  width:"90%",
                }}
                 onClick={() => goTo(proj.name)}
          >
                </Button>


          
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".75rem" : ".6rem",
                    lineHeight:".6rem",
                  }}
                >
                  {proj.projectName.toUpperCase()}
                </Typography>
              </Grid>



              <Grid item xs={1} md={3} sx={{ textAlign: "left" }}>
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".75rem" : ".6rem",
                    lineHeight:".6rem",

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
                    lineHeight:".6rem",

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
                    lineHeight:".6rem",

                  }}
                >
                  {proj.director.toUpperCase()}
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
                    lineHeight:".6rem",

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
            autoplay
            muted
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
      </div>

      <div style={{ width: "100%", position: "fixed", bottom: 0 }}>
        <Footer />
      </div>
      
    </div>
  );
};

export default IndexPage;
