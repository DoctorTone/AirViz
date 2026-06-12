const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[100, 100, 100]} intensity={1.2} castShadow />
      <pointLight position={[0, 50, 0]} intensity={0.5} color="#ff7e00" />
    </>
  );
};

export default Lights;
