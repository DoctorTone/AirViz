import useStore from "../state/store";

const VolumetricFog = ({ pm25 }) => {
  const fogNear = useStore((state) => state.fogNear);
  const fogFar = useStore((state) => state.fogFar);

  // Fog density increases with pollution
  // const fogNear = 1000;
  // const fogFar = Math.max(150, 250 - pm25 * 0.8); // 150-250m range
  // const fogFar = 3000;

  return <fog attach="fog" args={["#81868b", 100, 3500]} />;
};

export default VolumetricFog;
