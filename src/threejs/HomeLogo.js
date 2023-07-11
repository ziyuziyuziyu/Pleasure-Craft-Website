//import { useRef, useEffect } from 'react';
import React, { useEffect, useRef, useContext } from "react";
import AppContext from "../context/AppContext";
import * as THREE from "three";
//import GLTFLoader from 'three-gltf-loader';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Cache } from "three";
import { isPlainObject } from "@mui/utils";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import Fade from '@mui/material/Fade';
import logo_gltf from "../../public/glTF/LOGO CHROME_Less Soft.gltf";
import logo_tex from "../../public/Textures/HDRI_Chrome_Soft.png";

// Homepage logo demo

var directionX = 0;
var directionY = 0;

export const HomeLogo = () => {
  // Canvas ref
  const canvasRef = useRef(null);

  const { state, api } = useContext(AppContext);
  const { showLoading } = state;
  const { setShowLoading } = api;

  const clearThree = (obj) => {
    while (obj.children.length > 0) {
      clearThree(obj.children[0]);
      obj.remove(obj.children[0]);
    }
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      Object.keys(obj.material).forEach((prop) => {
        if (!obj.material[prop]) return;
        if (
          obj.material[prop] !== null &&
          typeof obj.material[prop].dispose === "function"
        )
          obj.material[prop].dispose();
      });
      obj.material.dispose();
    }
  };

  useEffect(() => {
    // Get user input
    let start = Date.now().toLocaleString("en-us", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
    // console.log('start time: ', start);
    const canvas = canvasRef.current;
    canvas.addEventListener("pointermove", handleMouseMove);
    // Primary floating object
    var coinDisc = new THREE.Mesh();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/decoder/draco/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(logo_gltf, (gltf) => {
      const root = gltf.scene;
      //scene.add(root);
      coinDisc = root.getObjectByName("Fixed_Logo");
      coinDisc.position.set(0, 0, 0);
      coinDisc.scale.set(0.1, 0.1, 0.1);
      // HDRI setup
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const hdrLoader = new THREE.TextureLoader();
      hdrLoader.load(
        logo_tex,
        function (texture) {
          const prefilteredCubeMap =
            pmremGenerator.fromEquirectangular(texture).texture;
          // Set the texture as the environment map for a material
          coinDisc.material.envMap = prefilteredCubeMap;
          pmremGenerator.dispose();
          // console.log(texture.status);
          //coinDisc.material.emissive = new THREE.Color(0xffffff);
          //coinDisc.material.emissiveIntensity = 0.1;
          scene.add(coinDisc);
          loadTime = Date.now();
          theta = Math.PI / 2;
        }
      );
      //console.log(dumpObject(root).join('\n'));
      let end = Date.now().toLocaleString("en-us", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
      });
      console.log('end time: ', end);
      setShowLoading(false);
    });
    // Set up the Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    let theta = 0;
    let phi = 0;
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setClearColor(0xffffff, 0);
    //renderer.setSize(canvasRef.current.width, canvasRef.current.height);
    renderer.setAnimationLoop(animate);
    const camera = new THREE.PerspectiveCamera(
      50,
      canvasRef.current.width / canvasRef.current.height,
      0.1,
      1000
    );
    camera.position.z = 100;
    camera.position.x = 100;
    let rotating = false;
    let loadTime;
    renderer.render(scene, camera);
    const frame = Math.PI / 360;
    function animate() {
      // Translating camera on a fixed orbit
      let r = 100;
      if (Date.now() - loadTime >= 2000) {
        rotating = true;
      }
      if (rotating) {
        theta -= frame; // This gives the illusion of rotation by orbiting the camera horizontally
      }
      // The mesh rotates one way
      coinDisc.rotateY(frame * directionX);
      //coinDisc.rotateOnAxis(new THREE.Vector3(1, 0, 0), frame * directionY);

      // The camera orbits the opposite way
      theta -= frame * directionX;
      phi -= frame * directionY;

      let coordinates = calculate_orbit(r, theta, phi);

      // Updating camera position
      camera.position.x = coordinates[0];
      //camera.position.y = coordinates[1];
      camera.position.z = coordinates[2];

      // Rotating camera to track origin
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      renderer.render(scene, camera);
    }    
    
    return () => {
      canvasRef &&
        canvasRef.current &&
        canvasRef.current.removeEventListener("mousemove", handleMouseMove);
      clearThree(scene);
    };
  }, []); // The empty array ensures that this effect only runs once when the component mounts
  /*useEffect (() => {
    if(!showLoading){
      setTimeout(animate, 2000);
    }
  },[showLoading]);*/
  return (
      <Fade in={!showLoading} timeout={500}>
    <div id="main">

        <canvas
          ref={canvasRef}
          className="three"
          style={{ maxHeight: "100%", maxWidth: "100%" }}
          width="1500px"
          height="900px"
        />
    </div>
      </Fade>
  );
};


export default HomeLogo;

// Draws a circular orbit around (0,0)
function calculate_orbit(r, theta, phi) {
  var x = r * Math.cos(theta);
  var y = r * Math.cos(phi);
  var z = r * Math.sin(theta);
  return [x, y, z];
}


// Tracks user interaction
let timeout;
const handleMouseMove = (event) => {
  const coefficient = 0.69;
  directionX = event.movementX * coefficient;
  directionY = -event.movementY * coefficient;  // Notice the - sign for correct vertical rotation direction
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    directionX = 0;
    directionY = 0;
  }, 100);
};

function handleScroll(event) {
  event.preventDefault();
  var coefficient = 1;
  direction = event.deltaY * coefficient;
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    direction = 0;
  }, 2500);
}
function dumpObject(obj, lines = [], isLast = true, prefix = "") {
  const localPrefix = isLast ? "└─" : "├─";
  lines.push(
    `${prefix}${prefix ? localPrefix : ""}${obj.name || "*no-name*"} [${obj.type
    }]`
  );
  const newPrefix = prefix + (isLast ? "  " : "│ ");
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}
