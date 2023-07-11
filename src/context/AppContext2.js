import React, { createContext, useEffect, useState } from "react";
import { getProjects, getConfig } from "../api/api";

const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [projects, setProjects] = useState([]);
  const [projectRoutes, setProjectRoutes] = useState([]);
  const [config, setConfig] = useState([]);

  const [showNav, setShowNav] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [loadedVids, setLoadedVids] = useState([]);

  const [videoMap, setVideoMap] = useState({});

  const invokeGetProjects = async () => {
    await getProjects()
      .then((res) => {
        let proj = res.data.data;
        let temp = [];
        let tempRoutes = [];
        proj.forEach((el) => {
          temp.push(el.attributes);
          tempRoutes.push({
            routeName: el.attributes.name,
            data: el.attributes,
          });
        });
        setProjects([...temp]);
        setProjectRoutes([...tempRoutes]);
      })
      .catch(() => {
        console.log("couldnt fetch projects");
      });
  };
  const invokeGetConfig = async () => {
    await getConfig()
      .then((res) => {
        let ret = [];
        if (res && res.data && res.data.data) {
          let conf = res.data.data.attributes.featuredIds;
          let arr = conf.split(",");
          arr.forEach((el) => ret.push(el.trim()));
        }
        setConfig([...ret]);
      })
      .catch(() => {
        console.log("couldnt fetch config");
        setConfig([]);
      });
  };

  useEffect(() => {
    if (config.length > 0) {
      if (config.length === loadedVids.length) {
        setShowLoading(false);
      }
    }
  }, [config, loadedVids])

  // const invokeGetMedia = async () => {
  //     await getMedia().then((res) => {
  //         let med = res.data
  //         setMedia([...med]);
  //     }).catch(() => {
  //         console.log('couldnt fetch media');
  //     });
  // };

  // const invokeGetFolders = async () => {
  //     await getFolders().then((res) => {
  //         console.log(res);
  //         // let fold = res.data
  //         // setFolders([...fold]);
  //     }).catch(() => {
  //         console.log('couldnt fetch folders');
  //     });
  // };

  const invokeStart = () => {
    invokeGetProjects();
    invokeGetConfig();
    // invokeGetMedia();
    // invokeGetFolders();
  };

  const state = {
    projects: projects,
    projectRoutes: projectRoutes,
    config: config,
    showNav: showNav,
    showLogo: showLogo,
    showLoading: showLoading,
    loadedVids: loadedVids,
    videoMap: videoMap,
  };
  const api = {
    invokeStart: invokeStart,
    setShowNav: setShowNav,
    setShowLogo: setShowLogo,
    setVideoMap: setVideoMap,
    setLoadedVids: setLoadedVids,
  };
  return (
    <AppContext.Provider value={{ state, api }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
