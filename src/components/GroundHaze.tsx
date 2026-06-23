import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

const GroundHaze = ({
  pm25,
  color,
  extent = 3000,
  capHeight = 40,
  count = 20000,
}) => {
  const ref = useRef(null);

  // Fixed particle cloud — generated once. We modulate appearance per-day,
  // not the positions, so the timeline scrub stays smooth.
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread across the city footprint (X/Z)
      arr[i * 3] = (Math.random() - 0.5) * extent; // x
      // Bias Y toward the ground: more particles low, thinning upward.
      arr[i * 3 + 1] = Math.pow(Math.random(), 2) * capHeight; // y
      arr[i * 3 + 2] = (Math.random() - 0.5) * extent; // z
    }
    return arr;
  }, [count, extent, capHeight]);

  // Map the day's PM2.5 to haze intensity.
  // Your daily range is ~27-91, so anchor the mapping to that, not 0-500.
  const t = Math.min(1, Math.max(0, (pm25 - 27) / (91 - 27)));
  const opacity = 0.05 + t * 0.45; // clear-ish day -> thick day
  const size = 4 + t * 6; // particles also fatten with pollution

  // Gentle drift so it feels suspended, not frozen.
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

export default GroundHaze;
