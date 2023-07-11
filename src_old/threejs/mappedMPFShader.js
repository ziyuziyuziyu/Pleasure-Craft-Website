let mappedMPFShader = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
uniform sampler2D map;
uniform vec3 viewPosition;
uniform float cameraRotation;

varying vec2 vUv;
//varying vec3 vNormal;
varying vec3 vWorldPosition;


#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

#ifdef USE_SPLATMAP
    uniform sampler2D textures[${length}];
    uniform sampler2D splatMaps[${length - 1}]; // one less splatmap than textures.
    varying vec2 textureUVs[${length}]; // computed in vertexshader
#endif

void main() {
    #include <clipping_planes_fragment>
    vec4 diffuseColor = vec4( diffuse, opacity );
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    vec3 totalEmissiveRadiance = emissive;
    
    vec2 uvRotated = vec2(1.0 - vUv.y, vUv.x);

    #ifdef USE_SPLATMAP
        float splatSum = 0.0;
        for (int i = 0; i < ${length - 1}; i++) {
            splatSum += texture2D(splatMaps[i], vUv).r;
        }
        vec4 accumulated = texture2D(textures[0], textureUVs[0]).rgba * (1.0 - splatSum);
        for (int i = 1; i < ${length}; i++) {
            vec4 texel = texture2D(textures[i], textureUVs[i]);
            vec4 splatTexel = texture2D(splatMaps[i - 1], vUv);
            accumulated = mix(accumulated, texel, splatTexel.r);
        }
        //accumulated = mapTexelToLinear(accumulated);
        diffuseColor *= accumulated;
    #else
        vec4 texColor = texture2D(map, uvRotated);
        //texColor.rgb *= 1.7;
        diffuseColor = texColor;
    #endif

    #include <logdepthbuf_fragment>
    #include <map_fragment>
    #include <color_fragment>
    #include <alphamap_fragment>
    #include <alphatest_fragment>
    #include <specularmap_fragment>
    #include <normal_fragment_begin>
    #include <normal_fragment_maps>
    #include <emissivemap_fragment>

    // accumulation
    #include <lights_phong_fragment>
    #include <lights_fragment_begin>
    #include <lights_fragment_maps>
    #include <lights_fragment_end>

    // modulation
    #include <aomap_fragment>

    //vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

    gl_FragColor = vec4(outgoingLight, diffuseColor.a);// * texture2D(mirror), uvRotated);

    #include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`;

export default mappedMPFShader;
