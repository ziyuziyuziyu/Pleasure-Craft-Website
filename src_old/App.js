import { AppContextProvider } from "./context/AppContext";
import React from "react";
import Main from "./components/Main";
import "./App.css";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import mainTheme from './theme.js';
// require('dotenv').config()

const App = () => {
  return (
    <ThemeProvider theme={mainTheme}>
      <AppContextProvider>
        <Main />
      </AppContextProvider>
    </ThemeProvider>
  );
};

export default App;
