import React, { createContext, useEffect, useRef, useState } from "react";
import { getProjects, getConfig } from "../api/api";

import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

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

  const [loaded, setLoaded] = useState(false);
  const [loadedHdr, setLoadedHdr] = useState(false);

  const [gltf, setGltf] = useState(null);
  const [texture, setTexture] = useState(null);

  // let mattAvatar = new THREE.Mesh();
  // let derekAvatar = new THREE.Mesh();
  // const renderer = new THREE.WebGLRenderer({
  //   canvas: canvasRef.current,
  //   antialias: true,
  // });

  // const scene = new THREE.Scene();

  // const sphereGeometry = new THREE.SphereGeometry(3000);
  // const sphereMaterial = new THREE.MeshStandardMaterial({
  //   metalness: 1,
  //   roughness: 0,
  //   side: THREE.BackSide,
  //   envMapIntensity: 1, // Set the environment map intensity
  // });

  // const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // const pmremGenerator = new THREE.PMREMGenerator(renderer);

  const doHdrLoad = async () => {
    if (!loadedHdr && !texture) {
      const hdrLoader = new THREE.TextureLoader();

      await hdrLoader.load(
        "/Textures/tex (1)/Ultimate_Skies_4k_0058.jpg",
        function (texture) {
          console.log("texture id in AppContext: ", texture.uuid);

          setLoadedHdr(true);
          setTexture(texture);

          let hdrtime = Date.now().toLocaleString("en-us", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3,
          });
          console.log("time to finish hdr load: ", hdrtime);
        }
      );
    }
  };

  const doLoad = async () => {
    if (!loaded && !gltf) {
      console.log("got to load gltf");

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("decoder/draco/");

      const loader = new GLTFLoader();
      // loader.setDRACOLoader(dracoLoader);
      return new Promise((resolve, reject) => {
        loader.load(
          "/glTF/About Us_v3_Avatars Only.glb",
          function (gltf) {
            console.log("GLTF id in AppContext: ", gltf.scene.uuid);
            // setLoaded(true);
            // setGltf(gltf);

            let gltfTime = Date.now().toLocaleString("en-us", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              fractionalSecondDigits: 3,
            });
            console.log("time to finish gltf load: ", gltfTime);
            // setGltf(gltf);
            resolve(gltf);
            // return gltf;
          },
          undefined,
          function (error) {
            reject(error);
          }
        );
      });
    }
  };

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

  useEffect(() => {
    if (config && config.length > 0) {
      if (config.length === loadedVids.length) {
        setShowLoading(false);
      }
    }
  }, [config, loadedVids]);

  const invokeStart = () => {
    invokeGetProjects();
    invokeGetConfig();
    // doLoad();
    // doHdrLoad();
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
    loaded: loaded,
    loadedHdr: loadedHdr,
    gltf: gltf,
    texture: texture,
  };
  const api = {
    invokeStart: invokeStart,
    setShowLoading: setShowLoading,
    setShowNav: setShowNav,
    setShowLogo: setShowLogo,
    setVideoMap: setVideoMap,
    setLoadedVids: setLoadedVids,
    doLoad: doLoad,
    setLoaded: setLoaded,
    setGltf: setGltf,
  };
  return (
    <AppContext.Provider value={{ state, api }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
