//import { useRef, useEffect } from 'react';
import React, { useEffect, useRef } from "react";

import * as THREE from "three";
//import GLTFLoader from 'three-gltf-loader';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
//import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// import { createCanvas } from "canvas";
import { createRef } from "react";

import { Cache, QuadraticBezierCurve3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Water } from 'three/examples/jsm/objects/Water.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
//import vertexShader from './VertexShader.js';
//import fragmentShader from './FragmentShader.js';
import GPGPU_Water from './gpgpuWater.js';

import hdri_tex from '../../public/Textures/HDRI_INFO.png';
import avatars from '../../public/glTF/avatars.glb';

// About page scene demo
export const InfoRender = () => {
  // Canvas ref
  const canvasRef = useRef(null);

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

  //const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Get user input 
    const canvas = canvasRef.current;
    //canvas.addEventListener('wheel', handleScroll);

    // Create the loading div
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.innerText = 'Loading...';

    // Set the CSS properties to grey out the screen
    // Set the CSS properties for the loading div
    loadingDiv.style.position = 'fixed';
    loadingDiv.style.top = '0';
    loadingDiv.style.left = '0';
    loadingDiv.style.width = '100%';
    loadingDiv.style.height = '100%';
    loadingDiv.style.background = 'rgba(0, 0, 0, 0.2)'; // semi-transparent black
    loadingDiv.style.color = 'white'; // set the text color to white
    loadingDiv.style.padding = '20px'; // add 20px padding around the text
    loadingDiv.style.fontSize = '24px'; // set the font size to 24px
    loadingDiv.style.fontWeight = 'bold'; // make the text bold
    loadingDiv.style.textAlign = 'center'; // center the text horizontally
    loadingDiv.style.lineHeight = '100vh'; // center the text vertically*/


    // Add the loading div to the DOM
    document.body.appendChild(loadingDiv);

    // Scene
    const scene = new THREE.Scene();

    // variables for control 
    var mattAvatar = new THREE.Mesh();
    let derekAvatar = new THREE.Mesh();
    let camera = new THREE.PerspectiveCamera(75, canvasRef.current.width / canvasRef.current.height, 0.1, 4000);
    camera.position.set(333, 100, 0);

    const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("decoder/draco/");

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

    //renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias:true });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0xffffff, 1);
    renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );

    //Manual water 
    const waterGeometry = new THREE.PlaneGeometry(6000, 6000, 1, 1);

    const mirror = new Reflector(waterGeometry, {
      clipBias: 0.003,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: 0x777777,
    });
    mirror.rotation.x = -Math.PI/2;
    mirror.position.y -= 1;
    //mirror.position.y += 1;
    scene.add(mirror);

    //let water;
    const water = new GPGPU_Water(scene, renderer, camera, mirror);
    water.waterMesh.position.y -=2;

    const updateMousePosition = (event) => {
      //console.log("Mouse moved to: ", event.clientX, event.clientY);
      water.onPointerMove(event);
    };
    //water.renderer.domElement.addEventListener("mousemove", updateMousePosition);
    canvas.addEventListener("pointermove", updateMousePosition);
    //Manual sky 
    // Create the sphere geometry
    const sphereGeometry = new THREE.SphereGeometry(3000);

    // Create the sphere material with the environment map
    const sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 1,
      roughness: 0,
      side : THREE.BackSide,
      envMapIntensity: 1 // Set the environment map intensity
    });

    // Create the sphere mesh with the geometry and material
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // Load the HDRI environment map
    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    const hdrLoader = new THREE.TextureLoader();

    hdrLoader.load(hdri_tex, function (texture) {
      const prefilteredCubeMap = pmremGenerator.fromEquirectangular( texture ).texture;
      sphere.material.envMap = prefilteredCubeMap;
      sphere.material.needsUpdate = true; // Update the material
      sphere.material.ambientIntensity = 0;
      texture.flipY = false;
      //water.waterMesh.material.envMap = prefilteredCubeMap;
      //water.waterMesh.material.map = prefilteredCubeMap;
      pmremGenerator.dispose();
      //loadingDiv.style.background = 'rgba(0, 0, 0, 0)';

    });
    // Importing entire scene from c4d export
    loader.load(avatars, (gltf) => {
      const root = gltf.scene;

      console.log(dumpObject(root).join('\n'));
      root.rotateY(Math.PI/2);
      mattAvatar = root.getObjectByName('Matt');
      derekAvatar = root.getObjectByName('Derek');
    
      let avatrText = new THREE.TextureLoader();
      avatrText.load('/Textures/ClothesD_Cust.png', function(texture) {
        texture.flipY = false;
        texture.encoding = THREE.sRGBEncoding;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        derekAvatar.getObjectByName("Clothes_D").material.map = texture;
        derekAvatar.getObjectByName("Clothes_D").material.map.needsUpdate = true;
        mattAvatar.getObjectByName("Clothes_M").material.roughness = 0.5;
        mattAvatar.getObjectByName("Clothes_M").material.metalness = 0;
        mattAvatar.getObjectByName("Clothes_M").material.map = texture;
        mattAvatar.getObjectByName("Clothes_M").material.map.needsUpdate = true;
      });
      avatrText.load('/Textures/Derek_Cust.png', function(texture) {
        derekAvatar.getObjectByName("Derek_1").material.roughness = 0.5;
        derekAvatar.getObjectByName("Derek_1").material.metalness = 0;
        texture.flipY = false;
        texture.encoding = THREE.sRGBEncoding;
        //texture.encoding = THREE.LinearEncoding;
        //texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        //texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        derekAvatar.getObjectByName("Derek_1").material.map = texture;
        derekAvatar.getObjectByName("Derek_1").material.map.needsUpdate = true;
      });
      avatrText.load('/Textures/Sunnies_DSurface_Color.png', function(texture) {
        texture.flipY = false;
        texture.encoding = THREE.sRGBEncoding;
        derekAvatar.getObjectByName("Sunnies_D").material.map = texture;
        mattAvatar.getObjectByName("Sunnies_M").material.map = texture;
      });
      /*avatrText.load('/Textures/ClothesM_Cust.png', function(texture) {
        texture.flipY = false;
        texture.encoding = THREE.sRGBEncoding;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        mattAvatar.getObjectByName("Clothes_M").material.roughness = 0.5;
        mattAvatar.getObjectByName("Clothes_M").material.metalness = 0;
        mattAvatar.getObjectByName("Clothes_M").material.map = texture;
        mattAvatar.getObjectByName("Clothes_M").material.map.needsUpdate = true;
      });*/
      avatrText.load('/Textures/Matt_Cust.png', function(texture) {
        texture.flipY = false;
        texture.encoding = THREE.sRGBEncoding;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        mattAvatar.getObjectByName("Matt_1").material.roughness = 0.5;
        mattAvatar.getObjectByName("Matt_1").material.metalness = 0;
        mattAvatar.getObjectByName("Matt_1").material.map = texture;
        mattAvatar.getObjectByName("Matt_1").material.map.needsUpdate = true;
      });
      avatrText.load('/Textures/Hand_Cust.png', function(texture) {
        texture.flipY = false;
        texture.encoding = THREE.LinearEncoding;
        derekAvatar.getObjectByName("Hand_D").material.roughness = 0.5;
        derekAvatar.getObjectByName("Hand_D").material.metalness = 0;
        derekAvatar.getObjectByName("Hand_D").material.map = texture;
      });
      avatrText.load('/Textures/Hand_MSurface_Color.png', function(texture) {
        texture.flipY = false;
        texture.encoding = THREE.LinearEncoding;
        mattAvatar.getObjectByName("Hand_M").material.roughness = 0.5;
        mattAvatar.getObjectByName("Hand_M").material.metalness = 0;
        mattAvatar.getObjectByName("Hand_M").material.map = texture;
        //derekAvatar.getObjectByName("Hand_D").material.map = texture;
      });

      derekAvatar.position.y += 83;
      mattAvatar.position.y += 83;
      mattAvatar.position.z = -40;
      derekAvatar.position.z = 40;
      mattAvatar.position.x = 0;
      derekAvatar.position.x = 0;
      mattAvatar.rotation.y = Math.PI/2;
      derekAvatar.rotation.y = Math.PI/1.5;
      scene.add(mattAvatar);
      scene.add(derekAvatar);
      //water = new GPGPU_Water(scene, renderer, camera, mirror);
      document.body.removeChild(loadingDiv);
      //setIsLoading(false);
      //exportTexture(mirror.material.map, renderer);
      
  });

    // Set up the Three.js scene, camera, and renderer

    //const light = new THREE.AmbientLight(0xffbb77, .4);
    const light2 = new THREE.AmbientLight(0xffffff, .1);
    //const light3 = new THREE.AmbientLight(0xffffff, .2);
    const sun = new THREE.RectAreaLight(0xff7700, .2, 6000, 4500);
    sun.decay = .3;
    const sun2 = new THREE.RectAreaLight(0xfff0f0, .2, 3000, 2000);
    sun2.decay = .6;
    sun.position.set(-2700, 1100, 0);
    sun2.position.set(-1550, 700, 0);
    //sun.visible = false;
    //sun2.visible = false;
    sun.lookAt(0,0,0);
    sun2.lookAt(0,0,0);
    //scene.add(light);
    scene.add(light2);
    //scene.add(light3);
    scene.add(sun);
    scene.add(sun2);
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, .5);
    scene.add(hemisphereLight);
    //water.rotation.x = - Math.PI / 2;

    sphere.rotation.y += Math.PI/2;
    scene.add( sphere );
    sphere.position.set(0, 1234, 0);
    //scene.add( water.waterMesh );
    //water.position.y = 28;
    //water.material.side = THREE.FrontSide;

    scene.add(camera);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controls.target.set( 0, 88, 0);
    controls.enablePan = false;
    controls.rotateSpeed = .5; // reduce the maximum orbit speed
    controls.zoomSpeed = 0.5; // reduce the maximum zoom speed
    controls.minPolarAngle = Math.PI/3.5; // lock vertical rotation
    controls.maxPolarAngle = Math.PI/2; // lock vertical rotation
    controls.maxDistance = 690;
    controls.minDistance = 230;

    //var framecount = 0;
    //var rotateAvatar = 0;
    //var isRotating = false;
    var clock = new THREE.Clock();
    var increment = 0;
    //renderer.setAnimationLoop(animate);

    function animate() {
      // Translating camera on a horizontal fixed orbit
      controls.update();
      
      //Ripple the water? 
      //scene.remove(water.waterMesh);
      //water.animate();
      water.render();
      //scene.add(water.waterMesh);

      // Render the scene
      //renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      //water.renderer.domElement.removeEventListener("mousemove", updateMousePosition);
      canvas.removeEventListener("pointermove", updateMousePosition);
      clearThree(scene);
    }
  }, []); // The empty array ensures that this effect only runs once when the component mounts

return (
  <div id = "main">
    <canvas ref={canvasRef} className = "three" style={{maxHeight:"100%", maxWidth:"100%"}} width="1920px" height="1080px" />
  </div>
);
}
export default InfoRender;

// Draws a circular orbit around (0,0)
function calculate_orbit(r, theta){
  var x = (r * Math.cos(theta));
  var y = r * Math.sin(theta);
  return [x, y]
}

function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
  }

function getWaveInfo( x, z, time ) {

  const pos = new THREE.Vector3();
  const tangent = new THREE.Vector3( 1, 0, 0 );
  const binormal = new THREE.Vector3( 0, 0, 1 );
  Object.keys( waves ).forEach( ( wave ) => {

    const w = waves[ wave ];
    const k = ( Math.PI * 2 ) / w.wavelength;
    const c = Math.sqrt( 9.8 / k );
    const d = new THREE.Vector2(
      Math.sin( ( w.direction * Math.PI ) / 180 ),
      - Math.cos( ( w.direction * Math.PI ) / 180 )
    );
    const f = k * ( d.dot( new THREE.Vector2( x, z ) ) - c * time );
    const a = w.steepness / k;

    pos.x += d.y * ( a * Math.cos( f ) );
    pos.y += a * Math.sin( f );
    pos.z += d.x * ( a * Math.cos( f ) );

    tangent.x += - d.x * d.x * ( w.steepness * Math.sin( f ) );
    tangent.y += d.x * ( w.steepness * Math.cos( f ) );
    tangent.z += - d.x * d.y * ( w.steepness * Math.sin( f ) );

    binormal.x += - d.x * d.y * ( w.steepness * Math.sin( f ) );
    binormal.y += d.y * ( w.steepness * Math.cos( f ) );
    binormal.z += - d.y * d.y * ( w.steepness * Math.sin( f ) );

  } );

  const normal = binormal.cross( tangent ).normalize();

  return { position: pos, normal: normal };

  }

  function exportTexture(texture, renderer) {
    console.log(texture);
    let gl = renderer.getContext();
    let width = texture.image.width;
    let height = texture.image.height;

    // Create a framebuffer backed by the texture
    let framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    // Read the contents of the framebuffer (data stores the pixel values)
    let data = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

    // Create a 2D canvas to store the result 
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let context = canvas.getContext('2d');

    // Copy the pixels to a 2D canvas
    let imageData = context.createImageData(width, height);
    imageData.data.set(data);
    context.putImageData(imageData, 0, 0);

    // Create an a element to download the image
    let a = document.createElement('a');
    a.href = canvas.toDataURL();
    a.download = 'image.png';
    a.click();
}

  
  