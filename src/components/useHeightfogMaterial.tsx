import { useMemo } from "react";
import * as THREE from "three";

// A material that fogs based on world height: dense below `fogTop`,
// clear above it. Density scales with the day's pollution.
function useHeightFogMaterial(
  color,
  pm25,
  { fogTop = 40, fogBottom = 0 } = {},
) {
  return useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.6,
      metalness: 0.1,
    });

    // Map daily PM2.5 (~27-91) to a fog strength 0..1
    const strength = Math.min(1, Math.max(0, (pm25 - 27) / (91 - 27)));

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.fogTop = { value: fogTop };
      shader.uniforms.fogBottom = { value: fogBottom };
      shader.uniforms.fogStrength = { value: strength };
      shader.uniforms.hazeColor = { value: new THREE.Color("#b9863f") }; // smog tint

      // expose world position to the fragment shader
      shader.vertexShader = shader.vertexShader
        .replace(
          "void main() {",
          `varying float vWorldY;
     void main() {`,
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
     vWorldY = (modelMatrix * vec4(transformed, 1.0)).y;`,
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "void main() {",
          `varying float vWorldY;
         uniform float fogTop;
         uniform float fogBottom;
         uniform float fogStrength;
         uniform vec3 hazeColor;
         void main() {`,
        )
        .replace(
          "#include <dithering_fragment>",
          `#include <dithering_fragment>
         // 1 at/below fogBottom, 0 at/above fogTop, smooth between
         float h = clamp((fogTop - vWorldY) / (fogTop - fogBottom), 0.0, 1.0);
         float fogAmount = h * fogStrength;
         gl_FragColor.rgb = mix(gl_FragColor.rgb, hazeColor, fogAmount);`,
        );
    };

    mat.customProgramCacheKey = () => `heightfog-${fogTop}-${fogBottom}`;
    return mat;
  }, [color, pm25, fogTop, fogBottom]);
}

export default useHeightFogMaterial;
