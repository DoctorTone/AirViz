import { Points, PointMaterial } from "@react-three/drei";

const PollutionCloud = ({ pm25, color }) => {
  // Scale pollution cloud size by PM2.5 value
  const scale = Math.min(pm25 / 50, 3); // Max 3x scale at 150+ PM2.5

  // Generate random particles in sphere
  const positions = new Float32Array(1000 * 3);
  for (let i = 0; i < 1000; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 20 * scale;

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }

  return (
    <points position={[0, 30, 0]}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.5}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

export default PollutionCloud;
