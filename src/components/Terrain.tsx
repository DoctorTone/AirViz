import React from "react";

const Terrain = ({ lat, lon }) => {
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2000, 2000]} />
      <meshStandardMaterial color="#2a4a3a" />
    </mesh>
  );
};

export default Terrain;
