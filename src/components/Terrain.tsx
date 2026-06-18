const Terrain = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[5000, 5000]} />
      <meshStandardMaterial color="#1a3a1a" roughness={0.8} metalness={0.1} />
    </mesh>
  );
};

export default Terrain;
