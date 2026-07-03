import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { INTERACTIONS } from "./state/Config";
import Lights from "./components/Lights";
import Scene from "./components/Scene";
import useStore from "./state/store";
import UI from "./UI/UI";
import DaySky from "./components/DaySky";

function App() {
  const skyColour = useStore((state) => state.skyColour);
  return (
    <>
      <Canvas
        style={{ background: `#${skyColour.getHexString()}` }}
        camera={{ position: [0, 300, 1000], fov: 50, near: 10, far: 10000 }}
        gl={{ antialias: true }}
      >
        <Lights />
        <DaySky />
        <Scene />

        <OrbitControls
          makeDefault
          enablePan={INTERACTIONS.PAN}
          enableRotate={INTERACTIONS.ROTATE}
          enableDamping={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={500}
          maxDistance={2000}
        />
      </Canvas>
      <UI />
    </>
  );
}

export default App;
