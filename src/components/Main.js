import React, { useEffect, useContext } from "react";
import NavBar from "./NavBar";
import { BrowserRouter as Router } from "react-router-dom";
import BaseRoutes from "./BaseRoutes";
import makeStyles from "@mui/styles/makeStyles";

import AppContext from "../context/AppContext";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
  },
}));

export const Main = (props) => {
  const { api } = useContext(AppContext);
  const { invokeStart } = api;

  const classes = useStyles();

  useEffect(() => {
    invokeStart();
  }, []);

  return (
    <>
      <Router>
        <div>
          <NavBar />
        </div>
        <div className={classes.root}>
          <BaseRoutes />
        </div>
      </Router>
    </>
  );
};

export default Main;
