//import { useRef, useEffect } from 'react';
import React, { useEffect, useRef, useState, useContext } from "react";
import AppContext from "../context/AppContext.js";
import * as THREE from "three";
//import GLTFLoader from 'three-gltf-loader';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// import { createCanvas } from "canvas";
import { createRef } from "react";

import { Cache, QuadraticBezierCurve3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Water } from "three/examples/jsm/objects/Water.js";
import vertexShader from "./VertexShader.js";
import fragmentShader from "./FragmentShader.js";

// Global context var
var direction = 0;

const waves = {
  A: { direction: 344, steepness: 0.1, wavelength: 5 },
  B: { direction: 330, steepness: 0.1, wavelength: 10 },
  C: { direction: 280, steepness: 0.1, wavelength: 6.9 },
};

// About page scene demo
export const InfoRender = () => {
  const { state, api } = useContext(AppContext);
  const { gltf, texture, loaded, loadedHdr } = state;
  const { doLoad, setLoaded, setGltf } = api;
  const [postHdrLoad, setPostHdrLoad] = useState(false);
  const [postLoad, setPostLoad] = useState(false);

  const [setupDone, setSetupDone] = useState(false);

  // Canvas ref
  const canvasRef = useRef(null);

  // Scene
  const scene = new THREE.Scene();

  var mattAvatar = new THREE.Mesh();
  let derekAvatar = new THREE.Mesh();
  //   let camera = new THREE.PerspectiveCamera();
  const sphereGeometry = new THREE.SphereGeometry(3000);

  // Create the sphere material with the environment map
  const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 0,
    side: THREE.BackSide,
    envMapIntensity: 1, // Set the environment map intensity
  });

  // Create the sphere mesh with the geometry and material
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

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

  const animate = (
    renderer,
    controls,
    framecount,
    rotateAvatar,
    clock,
    water,
    camera
  ) => {
    // Translating camera on a horizontal fixed orbit
    // console.log('controls in animate: ', controls);
    controls.update();
    //sphere.rotation.z += Math.PI/4;

    // Calculate the angle between the camera and the avatars
    const avatarDirection = new THREE.Vector3();
    mattAvatar.getWorldDirection(avatarDirection);

    const cameraDirection = new THREE.Vector3();
    cameraDirection
      .subVectors(camera.position, mattAvatar.position)
      .normalize();

    var angle = avatarDirection.angleTo(cameraDirection);

    if (
      avatarDirection.dot(cameraDirection.cross(new THREE.Vector3(0, 1, 0))) > 0
    ) {
      angle = -angle;
    }

    //console.log("AVATAR ANGLE: " + angle);
    const dist = Math.abs(angle);

    if (dist >= (100 * Math.PI) / 180 && rotateAvatar === 0) {
      rotateAvatar = angle > 0 ? 1 : -1;
    }
    if (framecount >= 40 && dist < (20 * Math.PI) / 180) {
      rotateAvatar = 0;
      framecount = 0;
    }
    if (rotateAvatar !== 0 && dist > (20 * Math.PI) / 180) {
      // Rotate the avatars by a small amount
      mattAvatar.rotation.y += (rotateAvatar * Math.PI) / 45;
      derekAvatar.rotation.y += (rotateAvatar * Math.PI) / 45;
      framecount++;
    }
    //console.log(rotate_avatar);

    //water
    //water.material.uniforms.time.value += 1.0 / 60.0;
    water.material.uniforms["time"].value += clock.getDelta();

    //console.log(camera.position);
    renderer.render(scene, camera);
    requestAnimationFrame(() =>
      animate(
        renderer,
        controls,
        framecount,
        rotateAvatar,
        clock,
        water,
        camera
      )
    );
  };

  useEffect(() => {
    // Create the loading div
    const loadingDiv = document.createElement("div");
    loadingDiv.id = "loading";
    loadingDiv.innerText = "Loading...";

    // Set the CSS properties to grey out the screen
    // Set the CSS properties for the loading div
    loadingDiv.style.position = "fixed";
    loadingDiv.style.top = "0";
    loadingDiv.style.left = "0";
    loadingDiv.style.width = "100%";
    loadingDiv.style.height = "100%";
    loadingDiv.style.background = "rgba(0, 0, 0, 0.5)"; // semi-transparent black
    loadingDiv.style.color = "white"; // set the text color to white
    loadingDiv.style.padding = "20px"; // add 20px padding around the text
    loadingDiv.style.fontSize = "24px"; // set the font size to 24px
    loadingDiv.style.fontWeight = "bold"; // make the text bold
    loadingDiv.style.textAlign = "center"; // center the text horizontally
    loadingDiv.style.lineHeight = "100vh"; // center the text vertically

    // Add the loading div to the DOM
    // document.body.appendChild(loadingDiv);
    let start = Date.now().toLocaleString("en-us", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
    console.log("start time on about page: ", start);

    // variables for control

    // const loader = new GLTFLoader();

    //const derekParent = new THREE.Object3D();
    //derekParent.position.set(-60, 0, 0);
    //console.time("loaded in");

    /*
    //Manual sky
    // Create the sphere geometry
    const sphereGeometry = new THREE.SphereGeometry(3000);

    // Create the sphere material with the environment map
    const sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 1,
      roughness: 0,
      side: THREE.BackSide,
      envMapIntensity: 1, // Set the environment map intensity
    });

    // Create the sphere mesh with the geometry and material
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
*/
    setSetupDone(true);
    return () => {
      clearThree(scene);
    };
  }, []); // The empty array ensures that this effect only runs once when the component mounts

  useEffect(() => {
    if (loadedHdr && setupDone) {
      console.log("texture id in InfoRender: ", texture.uuid);

      // Load the HDRI environment map
      //   const pmremGenerator = new THREE.PMREMGenerator( renderer );
      //   const prefilteredCubeMap =
      // pmremGenerator.fromEquirectangular(texture).texture;

      sphere.material.envMap = texture; // prefilteredCubeMap;
      sphere.material.needsUpdate = true; // Update the material
      sphere.material.ambientIntensity = 0;
      //water.material.envMap = prefilteredCubeMap;
      //   pmremGenerator.dispose();

      setPostHdrLoad(true);

      let hdrtime = Date.now().toLocaleString("en-us", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
      });
      console.log("time after hdr load callback: ", hdrtime);
    }
  }, [loadedHdr, setupDone, texture]);

  let root = {};
  useEffect(() => {
    if (loaded && setupDone) {
      console.log("GLTF id in InfoRender: ", gltf.scene.uuid);
      console.log('gltf in info render: ', gltf.scene);
      root = gltf.scene;
      // console.log(dumpObject(root).join('\n'));
      root.rotateY(Math.PI / 2);
      root.position.y = -3;
      //var waterFloor = root.getObjectByName('Water_Floor');
      mattAvatar = root.getObjectByName("Matt");
      derekAvatar = root.getObjectByName("Derek");

      // derekAvatar.getObjectByName("Jacket_D_1").material =
      //   derekAvatar.getObjectByName("Jacket_D-Clothing").material;
      // mattAvatar.getObjectByName("Jacket_M_1").material =
      //   mattAvatar.getObjectByName("Jacket_M-Clothing").material;
      // const offWhite = new THREE.Color(240 / 255, 240 / 255, 240 / 255);
      // derekAvatar.getObjectByName("Jacket_D_1").material.color = offWhite;
      // mattAvatar.getObjectByName("Jacket_M_1").material.color = offWhite;
      // derekAvatar.getObjectByName("Jacket_D_1").material.metalness = 0.5;

      setPostLoad(true);

      let end = Date.now().toLocaleString("en-us", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
      });
      console.log("time after gltf load callback: ", end);
    }
  }, [loaded, gltf]);

  useEffect(() => {
    console.log("setupDone: ", setupDone);
    console.log("loaded: ", loaded);
    if (!loaded && setupDone) {
      loading();
    }
    // console.log(file);
    // setGltf(file);
    // setLoaded(true);
  }, [setupDone]);

  const loading = async () => {
    let file = await doLoad();
    console.log(file);
    setGltf(file);
    setLoaded(true);
  };

  useEffect(() => {
    if (postLoad) {
      //renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
      });
      renderer.setClearColor(0xffffff, 1);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const hdrLoader = new THREE.TextureLoader();
      hdrLoader.load(
        "./Textures/tex (1)/Ultimate_Skies_4k_0058.jpg",
        function (texture) {
          const prefilteredCubeMap =
            pmremGenerator.fromEquirectangular(texture).texture;
          //prefilteredCubeMap.encoding = THREE.sRGBEncoding;
          //reuseableMap = prefilteredCubeMap;
          sphere.material.envMap = prefilteredCubeMap;
          sphere.material.needsUpdate = true; // Update the material
          sphere.material.ambientIntensity = 0;
          //water.material.envMap = prefilteredCubeMap;
          pmremGenerator.dispose();
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

      console.log("got here too");
      //   let el = document.getElementById("loading");
      //   console.log("EL: ", el);
      //   console.log(loadingDiv);
      //   document.body.removeChild(loadingDiv);
      // Set up the Three.js scene, camera, and renderer
      //Manual water
      const waterGeometry = new THREE.PlaneGeometry(6000, 6000, 1, 1);
      const water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(
          "textures/Water0325normal.jpeg",
          function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          }
        ),
        sunDirection: new THREE.Vector3(0, -1, -1),
        sunColor: null,
        waterColor: null,
        distortionScale: 10.0,
        fog: scene.fog !== undefined,
        //shadowSide: THREE.BackSide,
        /*map: new THREE.TextureLoader().load('textures/Water0325.jpeg', function(texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        })*/
      });
      water.material.onBeforeCompile = function (shader) {
        shader.uniforms.waveA = {
          value: [
            Math.sin((waves.A.direction * Math.PI) / 180),
            Math.cos((waves.A.direction * Math.PI) / 180),
            waves.A.steepness,
            waves.A.wavelength,
          ],
        };
        shader.uniforms.waveB = {
          value: [
            Math.sin((waves.B.direction * Math.PI) / 180),
            Math.cos((waves.B.direction * Math.PI) / 180),
            waves.B.steepness,
            waves.B.wavelength,
          ],
        };
        shader.uniforms.waveC = {
          value: [
            Math.sin((waves.C.direction * Math.PI) / 180),
            Math.cos((waves.C.direction * Math.PI) / 180),
            waves.C.steepness,
            waves.C.wavelength,
          ],
        };
        shader.vertexShader = vertexShader;
        shader.fragmentShader = fragmentShader;
      };

      const light = new THREE.AmbientLight(0xffbb77, 0.3);
      const light2 = new THREE.AmbientLight(0xffffff, 0.7);
      const sun = new THREE.RectAreaLight(0xff7700, 0.8, 6000, 4500);
      sun.decay = 0.3;
      const sun2 = new THREE.RectAreaLight(0xfff0f0, 1, 3000, 2000);
      sun2.decay = 0.6;
      sun.position.set(-2700, 1100, 0);
      sun2.position.set(-1550, 700, 0);
      //sun.visible = false;
      //sun2.visible = false;
      sun.lookAt(0, 0, 0);
      sun2.lookAt(0, 0, 0);
      scene.add(light);
      scene.add(light2);
      scene.add(sun);
      scene.add(sun2);
      water.rotation.x = -Math.PI / 2;

      scene.add(sphere);
      sphere.position.set(0, 200, 0);
      //sphere.material.transparent = true;
      //sphere.material.opacity = 0;
      //sphere.material.reflectivity = 0;
      scene.add(water);
      //water.position.y = 28;
      water.material.side = THREE.FrontSide;
      //water.material.envMapIntensity = 1;
      water.material.ambientIntensity = 0.2;
      water.material.transparent = true;
      water.material.opacity = 0.8;
      console.log('does it have it? : ', root);
      scene.add(root);

      const camera = new THREE.PerspectiveCamera(
        75,
        canvasRef.current.width / canvasRef.current.height,
        0.1,
        4000
      );
      //camera.position.set(0, 75, 0);
      scene.add(camera);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2.0;
      controls.target.set(0, 80, 0);
      controls.enablePan = false;
      controls.rotateSpeed = 0.5; // reduce the maximum orbit speed
      controls.zoomSpeed = 0.5; // reduce the maximum zoom speed
      controls.minPolarAngle = Math.PI / 3.5; // lock vertical rotation
      controls.maxPolarAngle = Math.PI / 2; // lock vertical rotation
      controls.minDistance = 230;
      controls.maxDistance = 500;
      var framecount = 0;
      var rotateAvatar = 0;
      //var isRotating = false;
      var clock = new THREE.Clock();
      //renderer.setAnimationLoop(animate);
      console.log("controls in useeffect: ", controls);
      animate(
        renderer,
        controls,
        framecount,
        rotateAvatar,
        clock,
        water,
        camera
      );
    }
  }, [postLoad]);

  return (
    <div id="main">
      <canvas
        ref={canvasRef}
        className="three"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
        width="1920px"
        height="1080px"
      />
    </div>
  );
};
export default InfoRender;

// Draws a circular orbit around (0,0)
function calculate_orbit(r, theta) {
  var x = r * Math.cos(theta);
  var y = r * Math.sin(theta);
  return [x, y];
}

function dumpObject(obj, lines = [], isLast = true, prefix = "") {
  const localPrefix = isLast ? "└─" : "├─";
  lines.push(
    `${prefix}${prefix ? localPrefix : ""}${obj.name || "*no-name*"} [${
      obj.type
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

function getWaveInfo(x, z, time) {
  const pos = new THREE.Vector3();
  const tangent = new THREE.Vector3(1, 0, 0);
  const binormal = new THREE.Vector3(0, 0, 1);
  Object.keys(waves).forEach((wave) => {
    const w = waves[wave];
    const k = (Math.PI * 2) / w.wavelength;
    const c = Math.sqrt(9.8 / k);
    const d = new THREE.Vector2(
      Math.sin((w.direction * Math.PI) / 180),
      -Math.cos((w.direction * Math.PI) / 180)
    );
    const f = k * (d.dot(new THREE.Vector2(x, z)) - c * time);
    const a = w.steepness / k;

    pos.x += d.y * (a * Math.cos(f));
    pos.y += a * Math.sin(f);
    pos.z += d.x * (a * Math.cos(f));

    tangent.x += -d.x * d.x * (w.steepness * Math.sin(f));
    tangent.y += d.x * (w.steepness * Math.cos(f));
    tangent.z += -d.x * d.y * (w.steepness * Math.sin(f));

    binormal.x += -d.x * d.y * (w.steepness * Math.sin(f));
    binormal.y += d.y * (w.steepness * Math.cos(f));
    binormal.z += -d.y * d.y * (w.steepness * Math.sin(f));
  });

  const normal = binormal.cross(tangent).normalize();

  return { position: pos, normal: normal };
}

function rotateAvatarsToCamera(
  camera,
  mattAvatar,
  derekAvatar,
  rotateAvatar,
  isRotating
) {
  const avatarDirection = new THREE.Vector3();
  mattAvatar.getWorldDirection(avatarDirection);

  const cameraDirection = new THREE.Vector3();
  cameraDirection.subVectors(camera.position, mattAvatar.position).normalize();

  var angle = avatarDirection.angleTo(cameraDirection);

  if (
    avatarDirection.dot(cameraDirection.cross(new THREE.Vector3(0, 1, 0))) > 0
  ) {
    angle = -angle;
  }
}
