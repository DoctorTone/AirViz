const Lights = () => {
  return (
    <>
      <directionalLight intensity={1} position={[100, 100, 100]} />
      <ambientLight intensity={0.6} />
    </>
  );
};

export default Lights;
