import React, { useContext, useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import useMediaQuery from "@mui/material/useMediaQuery";

const useStyles = makeStyles(() => ({
  navBar: {
    minWidth: "100%",
    background: "#FFFFFF",

    width: "100%",
    position: "fixed",
    top: 0,
    right: 0,
    left: 0,
    height: "60px",
    zIndex: 3,
    opacity: 1,
    marginBottom: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 24px",
    boxSizing: "border-box",
    // transition: "all .25s ease-in-out",
    transformOrigin: "top",
  },
  toolbar: {
    display: "flex",
    padding: "0px 24px",

    minWidth: "60%",
    flexDirection: "row",
    background: "#FFFFFF",
    // justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    zIndex: 2,
  },

  menuButton: {
    fontFamily: "Square721",
    cursor: "pointer",
    textAlign: "center",
    padding: 0,
    opacity: "1 !important",
    color: "#000000",
  },
  barText: {
    fontFamily: "Square721",
  },
  logo: {
    height: "44px",
    // animation: "$fadein 1000ms",
  },
  logoOut: {
    animation: "$fadeout 1000ms",
  },
  "@keyframes fadein": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  },
  "@keyframes fadeout": {
    "0%": {
      opacity: 1,
    },
    "100%": {
      opacity: 0,
    },
  },
}));

export const NavBar = (props) => {
  const classes = useStyles();
  let navigate = useNavigate();
  const { state } = useContext(AppContext);
  const { showNav, showLogo } = state;
  const [render, setRender] = useState(showLogo);

  const largeScreen = useMediaQuery("(min-width:800px)");

  // function hideTimer() {
  //   setRender(false);
  // }
  // useEffect(() => {
  //   if (showLogo) {
  //     clearTimeout(this.fade);
  //     setRender(true);
  //   } else {
  //     this.fade = setTimeout(hideTimer, 500);
  //   }
  // }, [showLogo]);

  return (
    // showNav && (
    <div
      className={classes.navBar}
      style={{
        transform: showNav ? "scaleY(1)" : "scaleY(0)",
        padding: largeScreen ? "0px 24px" : "0px 8px",
      }}
    >
      <Grid
        container
        className={classes.toolbar}
        style={{
          padding: largeScreen ? '0px 40px' : '0px 24px',
          minWidth: largeScreen && showLogo ? "100%" : "60%",
        }}
      >
        <Grid
          item
          xs={6}
          sm={4}
          sx={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Button
            className={classes.menuButton}
            // fullWidth
            style={{
              fontFamily: "Square721",
              color: "#000000",
              // justifyContent: "flex-start",
              fontSize: largeScreen ? "1rem" : ".75rem",
            }}
            onClick={(e) => navigate("/")}
          >
            Pleasure Craft
          </Button>
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            className={classes.menuButton}
            // fullWidth
            style={{
              fontFamily: "Square721",
              color: "#000000",
              // justifyContent: "flex-end",

              fontSize: largeScreen ? "1rem" : ".75rem",
            }}
            onClick={(e) => navigate("/info")}
          >
            Info
          </Button>
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            className={classes.menuButton}
            // fullWidth
            style={{
              fontFamily: "Square721",
              color: "#000000",
              // justifyContent: "flex-end",

              fontSize: largeScreen ? "1rem" : ".75rem",
            }}
            onClick={(e) => navigate("/index")}
          >
            Index
          </Button>
        </Grid>
        <Grid
          item
          xs={0}
          sm={2}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
          direction="row"
        >
          {largeScreen ? (
            <Fade in={showLogo} unmountOnExit timeout={1000}>
              <img
                className={classes.logo}
                src={"./logo-gif.gif"}
                onClick={(e) => navigate("/")}
              />
            </Fade>
          ) : null}
        </Grid>
      </Grid>
    </div>
    // )
    /* <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={3} style={{ height: "100%" }}>
          <div className={classes.menuButton} onClick={(e) => navigate("/")}>
            Pleasure Craft
          </div>
        </Grid>
        <Grid item xs={3} style={{ float: "right", border: "1px solid black" }}>
          <Button
            className={classes.menuButton}
            onClick={(e) => navigate("/info")}
          >
            Info
          </Button>
        </Grid>
        <Grid item xs={3} style={{ float: "right", border: "1px solid black" }}>
          <Button
            className={classes.menuButton}
            onClick={(e) => navigate("/index")}
          >
            Index
          </Button>
        </Grid>
      </Grid> */
    // </div>
  );
};

export default NavBar;
