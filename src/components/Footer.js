import React, { useContext, useEffect, useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useLocation, useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import InstagramIcon from "@mui/icons-material/Instagram";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "40px",
    position: "relative",
    // bottom: 0,
    // left: 0,
    // right: 0,
    zIndex: 3,
    marginTop: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    boxSizing: "border-box",
    paddingLeft:"5px",
    paddingRight:"5px",
    paddingBottom:"5px",
  },
  text: {
    fontFamily: "Square721",
  },
}));

export const Footer = () => {
  const largeScreen = useMediaQuery("(min-width:600px)");

  const classes = useStyles();

  return (
    <div
      className={classes.root}
      style={{ marginTop: largeScreen ? "-40px" : 0 }}
    >
      <div
        className={classes.text}
        style={{ fontSize: largeScreen ? ".5rem" : ".6rem" }}
      >
        © 2023 PLEASURE CRAFT
      </div>
      <div style={{ fontSize: largeScreen ? ".5rem" : ".6rem" }}>
        <a
          style={{ color: "#000000", textDecoration: "none" }}
          href="https://www.instagram.com/pleasurecraft.fun"
          rel="noreferrer"
        >
          INSTAGRAM
        </a>
      </div>
    </div>
  );
};

export default Footer;
