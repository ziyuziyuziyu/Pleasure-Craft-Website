import React, { useEffect, useContext } from "react";
import NavBar from "./NavBar";
import { BrowserRouter as Router } from "react-router-dom";
import BaseRoutes from "./BaseRoutes";
import makeStyles from "@mui/styles/makeStyles";

import HomePage from "./HomePage";
import IndexPage from "./IndexPage";
import AppContext from "../context/AppContext";


const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    // height: '100vh'
  },
  // assetContainer: {
  //   height: "65%",
  //   border: "1px solid black",
  //   textAlign: "center",
  // },
  // textContainer: {
  //   height: "35%",
  //   border: "1px solid black",
  //   textAlign: "center",
  // },
}));

export const Main = (props) => {
  const { api, state } = useContext(AppContext);
  const { invokeStart, setVideoMap } = api;
  const { videoMap } = state;

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
    // <div>
    //     <NavBar />
    //     <HomePage />
    //     {/* <BrowserRouter>
    //         <Routes>
    //             <Route path='/'>
    //                 <HomePage />
    //             </Route>
    //             <Route path='/index'>
    //                 <IndexPage />
    //             </Route>
    //         </Routes>
    //     </BrowserRouter> */}
    // </div>
  );
};

export default Main;
