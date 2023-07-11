import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js';

import heightMapFragmentShader from './heightMapFragmentShader.js';
import smoothFragmentShader from './smoothFragmentShader.js';
import waterVertexShader from './waterVertexShader.js';
import readWaterLevelFragmentShader from './readWaterLevelFragmentShader.js';
import mappedMirrorMPFShader from './mappedMirrorMPFShader.js';
import mappedMPFShader from './mappedMPFShader.js';

const bounds_coeff = 12.0;
// Texture width for simulation
const WIDTH = 128 * 2;

// Water size in system units
const BOUNDS = 512 * bounds_coeff;
const BOUNDS_HALF = BOUNDS * 0.5;

const simplex = new SimplexNoise();

class GPGPU_Water {
	constructor(scene, renderer, camera, mirror) {
	this.scene = scene;
	this.renderer = renderer;
    this.mirror = mirror;
	this.camera = camera;

	this.animate = this.animate.bind(this);

	this.mouseMoved = false;
	this.mouseCoords = new THREE.Vector2();
	this.raycaster = new THREE.Raycaster();

	this.gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);

	if (renderer.capabilities.isWebGL2 === false) {
		this.gpuCompute.setDataType(THREE.HalfFloatType);
	}

	this.heightmapVariable = null;
	this.waterMesh = null;
	this.waterUniforms = null;

	this.vertexShader = waterVertexShader;
	this.fragmentShader = smoothFragmentShader;
	this.readWaterLevelFragmentShader = readWaterLevelFragmentShader;

	this.initWater();
	}

	initWater() {

	//const materialColor = 0x0040C0;
    const materialColor = 0x777777;


	//const geometry = new THREE.CircleGeometry( BOUNDS, WIDTH - 1);
    const geometry = new THREE.PlaneGeometry( BOUNDS, BOUNDS, WIDTH - 1, WIDTH - 1);

	// material: make a THREE.ShaderMaterial clone of THREE.MeshPhongMaterial, with customized vertex shader
	let material = new THREE.ShaderMaterial( {
		uniforms: THREE.UniformsUtils.merge( [
			THREE.ShaderLib[ 'phong' ].uniforms,
			{
				'heightmap': { value: null },
                'tDiffuse': { value: null },
				//'map': { value: null },
        		'textureMatrix': { value: null }
			}
		] ),
		vertexShader: waterVertexShader,
        //fragmentShader: mappedMirrorMPFShader
		fragmentShader: mappedMirrorMPFShader,

	} );

	material.lights = true;

    //transparency experiment
    //material.transparent = true;
    material.opacity = 1.0; // half-transparent

	// Material attributes from THREE.MeshPhongMaterial
	material.color = new THREE.Color(1.0, 1.0, 1.0) ;
    material.specular = new THREE.Color(0.5, 0.5, 0.5);
	material.shininess = 30;

	// Sets the uniforms with the material values
	material.uniforms[ 'diffuse' ].value = this.mirror.material.uniforms[ 'color' ].value;
	material.uniforms[ 'specular' ].value = material.specular;
	material.uniforms[ 'shininess' ].value = Math.max( material.shininess, 1e-4 );
	material.uniforms[ 'opacity' ].value = material.opacity;
	material.uniforms[ 'emissive' ].value = new THREE.Color(0.0, 0.0, 0.0);
	//material.uniforms[ 'cameraPosition' ].value = this.camera.position;
    //material.uniforms[ 'cameraRotation' ].value = Math.atan2(this.mirror.camera.position.z, this.mirror.camera.position.x);
    //console.log(this.mirror.material);
    material.uniforms[ 'tDiffuse' ].value = this.mirror.material.uniforms[ 'tDiffuse' ].value;
	material.uniforms[ 'textureMatrix' ].value = this.mirror.material.uniforms[ 'textureMatrix' ].value;
	// Defines
	material.defines.WIDTH = WIDTH.toFixed( 1 );
	material.defines.BOUNDS = BOUNDS.toFixed( 1 );

	this.waterUniforms = material.uniforms;
	this.waterMesh = new THREE.Mesh( geometry, material );
    this.waterMesh.visible = true;
	this.waterMesh.rotation.x = - Math.PI / 2;
	this.waterMesh.matrixAutoUpdate = false;
	this.waterMesh.updateMatrix();

	this.scene.add( this.waterMesh );
	this.waterMesh.position.y += 5;

	// THREE.Mesh just for mouse raycasting
	const geometryRay = new THREE.PlaneGeometry( BOUNDS, BOUNDS, 1, 1 );
    //const geometryRay = new THREE.CircleGeometry( BOUNDS, WIDTH - 1);
	this.meshRay = new THREE.Mesh( geometryRay, new THREE.MeshBasicMaterial( { color: 0xFFFFFF, visible: false } ) );
    //this.meshRay = new THREE.Mesh( geometryRay, new THREE.MeshBasicMaterial( { color: 0xFF0000, transparent: true, opacity: 0.5 } ) )
	this.meshRay.rotation.x = - Math.PI / 2;
	this.meshRay.matrixAutoUpdate = false;
	this.meshRay.updateMatrix();
	this.scene.add( this.meshRay );


	// Creates the gpu computation class and sets it up

	this.gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, this.renderer );

	if ( this.renderer.capabilities.isWebGL2 === false ) {

		this.gpuCompute.setDataType( THREE.HalfFloatType );

	}

	const heightmap0 = this.gpuCompute.createTexture();

	this.fillTexture( heightmap0 );

	this.heightmapVariable = this.gpuCompute.addVariable( 'heightmap', heightMapFragmentShader, heightmap0 );

	this.gpuCompute.setVariableDependencies( this.heightmapVariable, [ this.heightmapVariable ] );

	this.heightmapVariable.material.uniforms[ 'mousePos' ] = { value: new THREE.Vector2( 10000, 10000 ) };
	this.heightmapVariable.material.uniforms[ 'mouseSize' ] = { value: 69.0 };
	this.heightmapVariable.material.uniforms[ 'viscosityConstant' ] = { value: 0.98 };
	this.heightmapVariable.material.uniforms[ 'heightCompensation' ] = { value: 1.0 };
	this.heightmapVariable.material.defines.BOUNDS = BOUNDS.toFixed( 1 );

	const error = this.gpuCompute.init();
	if ( error !== null ) {

		console.error( error );

	}

	// Create compute shader to smooth the water surface and velocity
	this.smoothShader = this.gpuCompute.createShaderMaterial( smoothFragmentShader, { smoothTexture: { value: null } } );

	// Create compute shader to read water level
	this.readWaterLevelShader = this.gpuCompute.createShaderMaterial( readWaterLevelFragmentShader, {
		point1: { value: new THREE.Vector2() },
		levelTexture: { value: null }
	} );
	this.readWaterLevelShader.defines.WIDTH = WIDTH.toFixed( 1 );
	this.readWaterLevelShader.defines.BOUNDS = BOUNDS.toFixed( 1 );

	// Create a 4x1 pixel image and a render target (Uint8, 4 channels, 1 byte per channel) to read water height and orientation
	this.readWaterLevelImage = new Uint8Array( 4 * 1 * 4 );

	this.readWaterLevelRenderTarget = new THREE.WebGLRenderTarget( 4, 1, {
		wrapS: THREE.ClampToEdgeWrapping,
		wrapT: THREE.ClampToEdgeWrapping,
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat,
		type: THREE.UnsignedByteType,
		depthBuffer: false
	} );

}

fillTexture( texture ) {

	const waterMaxHeight = 10;

	function noise( x, y ) {

		let multR = waterMaxHeight;
		let mult = 0.025;
		let r = 0;
		for ( let i = 0; i < 15; i ++ ) {

			r += multR * simplex.noise( x * mult, y * mult );
			multR *= 0.53 + 0.025 * i;
			mult *= 1.25;

		}

		return r;

	}

	const pixels = texture.image.data;

	let p = 0;
	for ( let j = 0; j < WIDTH; j ++ ) {

		for ( let i = 0; i < WIDTH; i ++ ) {

			const x = i * 128 / WIDTH;
			const y = j * 128 / WIDTH;

			pixels[ p + 0 ] = noise( x, y );
			pixels[ p + 1 ] = pixels[ p + 0 ];
			pixels[ p + 2 ] = 0;
			pixels[ p + 3 ] = 1;

			p += 4;

		}

	}

}

smoothWater() {

	const currentRenderTarget = this.gpuCompute.getCurrentRenderTarget( this.heightmapVariable );
	const alternateRenderTarget = this.gpuCompute.getAlternateRenderTarget( this.heightmapVariable );

	for ( let i = 0; i < 10; i ++ ) {

		this.smoothShader.uniforms[ 'smoothTexture' ].value = currentRenderTarget.texture;
		this.gpuCompute.doRenderTarget( this.smoothShader, alternateRenderTarget );

		this.smoothShader.uniforms[ 'smoothTexture' ].value = alternateRenderTarget.texture;
		this.gpuCompute.doRenderTarget( this.smoothShader, currentRenderTarget );

	}

}

onWindowResize() {

	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize( window.innerWidth, window.innerHeight );

}

setMouseCoords( x, y ) {

	this.mouseCoords.set( ( x / this.renderer.domElement.clientWidth ) * 2 - 1, - ( y / this.renderer.domElement.clientHeight ) * 2 + 1 );
	this.mouseMoved = true;

}

onPointerMove( event ) {

	if ( event.isPrimary === false ) return;
    //console.log("coords: " + event.clientX + ", " + event.clientY);
	this.setMouseCoords( event.clientX, event.clientY );

}

readWaterHeightAtOrigin() {
    const currentRenderTarget = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable);
    this.readWaterLevelShader.uniforms['levelTexture'].value = currentRenderTarget.texture;

    // Read water level at (0,0)
    const u = 0.5; // assuming (0,0) maps to (0.5,0.5) in UV space
    const v = 0.5; 
    this.readWaterLevelShader.uniforms['point1'].value.set(u, v);
    this.gpuCompute.doRenderTarget(this.readWaterLevelShader, this.readWaterLevelRenderTarget);

    this.renderer.readRenderTargetPixels(this.readWaterLevelRenderTarget, 0, 0, 4, 1, this.readWaterLevelImage);
    const pixels = new Float32Array(this.readWaterLevelImage.buffer);

    // Get water level at (0,0)
    const waterLevel = pixels[0];

    return waterLevel;
}


animate() {

	requestAnimationFrame( this.animate );

	this.render();
	//stats.update();

}

render() {
	//this.renderer.clear();
	//this.mirror.updateTexture(this.renderer, this.scene, this.camera);
	//console.log(this.waterUniforms[ 'tDiffuse' ].value);

	// Set uniforms: mouse interaction
	const uniforms = this.heightmapVariable.material.uniforms;

	if ( this.mouseMoved ) {
		this.raycaster.setFromCamera( this.mouseCoords, this.camera );
    
		const intersects = this.raycaster.intersectObject( this.meshRay );

		if ( intersects.length > 0 ) {

			const point = intersects[ 0 ].point;

			uniforms[ 'mousePos' ].value.set( point.x, point.z );
			let scale = Math.sqrt( point.x * point.x + point.z * point.z );
			let dist_coeff = 0.77 + Math.sqrt(scale)/100 * scale/1000;
			uniforms[ 'mouseSize' ].value = 69.0 * dist_coeff;
			let scalescale = 0;
			if (scale > 1500) {
				scalescale = 1.3;
			}
			if (scale > 777) {
				scalescale = 1.1;
			}
			if (scale > 420 && scale < 777) {
				scalescale = 0.9;
			}
			if (scale > 150 && scale < 420) {
				scalescale = 0.7;
			}
			uniforms[ 'heightCompensation' ].value = 0.28 + Math.sqrt(scale/1000) * Math.sqrt(dist_coeff) * scalescale;
			//console.log(uniforms[ 'heightCompensation' ].value);
			//uniforms[ 'viscosityConstant' ].value = 0.981 - scale/69000;

		} else {

			uniforms[ 'mousePos' ].value.set( 10000, 10000 );

		}

        /*circle attempt
        if ( intersects.length > 0 ) {
            const point = intersects[ 0 ].point;
            const distanceFromCenter = Math.sqrt(point.x * point.x + point.z * point.z);

            if (distanceFromCenter <= BOUNDS_HALF) {
                // The interaction point is within the circle
                uniforms[ 'mousePos' ].value.set( point.x, point.z );
            } else {
                // The interaction point is outside the circle
                uniforms[ 'mousePos' ].value.set( 10000, 10000 );
            }
        } else {
            uniforms[ 'mousePos' ].value.set( 10000, 10000 );
        }
        */

		this.mouseMoved = false;

	} else {

		uniforms[ 'mousePos' ].value.set( 10000, 10000 );

	}

	// Do the gpu computation
	this.gpuCompute.compute();

	// Get compute output in custom uniform
	this.waterUniforms[ 'heightmap' ].value = this.gpuCompute.getCurrentRenderTarget( this.heightmapVariable ).texture;
    //this.waterMesh.material.needsUpdate = true;
	// Render

	this.mirror.position.y = this.readWaterHeightAtOrigin()+1;
	if (this.mirror.position.y < -3) {this.waterMesh.position.y = -3;}
	else {this.waterMesh.position.y = 3;}
	this.mirror.onBeforeRender(this.renderer, this.scene, this.camera);
	this.waterUniforms[ 'diffuse' ].value = this.mirror.material.uniforms[ 'color' ].value;
	this.waterUniforms[ 'tDiffuse' ].value = this.mirror.material.uniforms[ 'tDiffuse' ].value;
	//this.waterUniforms[ 'tDiffuse' ].value.encoding = THREE.sRGBEncoding;
	//this.waterUniforms[ 'tDiffuse' ].value.needsUpdate = true;
	this.waterUniforms[ 'textureMatrix' ].value = this.mirror.material.uniforms[ 'textureMatrix' ].value;
	this.mirror.visible = false;
	this.renderer.render( this.scene, this.camera );
	this.mirror.visible = true;
}}

export default GPGPU_Water;
