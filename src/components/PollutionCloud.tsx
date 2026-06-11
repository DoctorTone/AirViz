import React from "react";

const PollutionCloud = ({ pm25, color }) => {
  // Scale pollution cloud size by PM2.5 value
  const scale = Math.min(pm25 / 50, 3); // Max 3x scale at 150+ PM2.5

  return (
    <mesh position={[0, 30, 0]}>
      <sphereGeometry args={[20 * scale, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.4}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

export default PollutionCloud;
