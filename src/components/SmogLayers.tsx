import { useMemo } from "react";
import useStore from "../state/store";
import * as THREE from "three";

const SmogLayers = ({ pm25, color, extent = 5000, capHeight = 30 }) => {
  // Map the day's PM2.5 (~27-91) to overall haze intensity.
  const t = Math.min(1, Math.max(0, (pm25 - 27) / (91 - 27)));
  const layers = useStore((state) => state.numPlanes);
  const opacity = useStore((state) => state.planeOpacity);

  const planes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < layers; i++) {
      const frac = i / (layers - 1); // 0 at ground, 1 at cap
      const y = frac * capHeight;
      // Density falls off with height: thick low, thin near the top.
      const heightFalloff = 1 - frac; // linear; pow(1-frac,2) hugs tighter
      arr.push({ y, heightFalloff });
    }
    return arr;
  }, [layers, capHeight]);

  return (
    <group>
      {planes.map((p, i) => (
        <mesh key={i} position={[0, p.y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[extent, extent]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={t * p.heightFalloff * opacity} // per-plane; they stack up
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.NormalBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

export default SmogLayers;
