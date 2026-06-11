import React from "react";

export const SensorPoint = ({ lat, lon }) => {
  return (
    <mesh position={[0, 5, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffff00" />
    </mesh>
  );
};
