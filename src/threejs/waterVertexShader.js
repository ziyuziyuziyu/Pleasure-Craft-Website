const waterVertexShader = `
	uniform sampler2D heightmap;
	uniform mat4 textureMatrix;

	varying vec4 vUv;
	//varying vec2 vUv;

	#define PHONG

	varying vec3 vViewPosition;

	#ifndef FLAT_SHADED

		varying vec3 vNormal;

        varying vec3 vWorldPosition;

	#endif

	#include <common>
	#include <uv_pars_vertex>
	#include <displacementmap_pars_vertex>
	#include <envmap_pars_vertex>
	#include <color_pars_vertex>
	#include <morphtarget_pars_vertex>
	#include <skinning_pars_vertex>
	#include <shadowmap_pars_vertex>
	#include <logdepthbuf_pars_vertex>
	#include <clipping_planes_pars_vertex>

	void main() {

		vec2 cellSize = vec2( 1.0 / WIDTH, 1.0 / WIDTH );

        //vUv = uv;
		vUv = textureMatrix * vec4( position, 1.0 );

        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

		#include <uv_vertex>
		#include <color_vertex>

		vec3 objectNormal = vec3(
			( texture2D( heightmap, uv + vec2( - cellSize.x, 0 ) ).x - texture2D( heightmap, uv + vec2( cellSize.x, 0 ) ).x ) * WIDTH / BOUNDS,
			( texture2D( heightmap, uv + vec2( 0, - cellSize.y ) ).x - texture2D( heightmap, uv + vec2( 0, cellSize.y ) ).x ) * WIDTH / BOUNDS,
			1.0 );
		
		vNormal = normalize(objectNormal);

		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>

	#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

		vNormal = normalize( transformedNormal );

	#endif

		float heightValue = texture2D( heightmap, uv ).x;
		vec3 transformed = vec3( position.x, position.y, heightValue );

		#include <morphtarget_vertex>
		#include <skinning_vertex>
		#include <displacementmap_vertex>
		#include <project_vertex>
		#include <logdepthbuf_vertex>
		#include <clipping_planes_vertex>

		vViewPosition = - mvPosition.xyz;

		#include <worldpos_vertex>
		#include <envmap_vertex>
		#include <shadowmap_vertex>

	}
`;

export default waterVertexShader;
