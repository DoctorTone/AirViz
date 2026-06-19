import React from "react";

const VolumetricFog = ({ pm25 }) => {
  // Fog density increases with pollution
  const fogNear = 1000;
  // const fogFar = Math.max(150, 250 - pm25 * 0.8); // 150-250m range
  const fogFar = 3000;

  return <fog attach="fog" args={["#4a5a6a", fogNear, fogFar]} />;
};

export default VolumetricFog;
