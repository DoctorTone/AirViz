import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { INTERACTIONS } from "./state/Config";
import Lights from "./components/Lights";
import Scene from "./components/Scene";
import UI from "./UI/UI";
const fogColor = "#81868b";

function App() {
  return (
    <>
      <Canvas
        style={{ background: fogColor }}
        camera={{ position: [0, 300, 1000], fov: 50, near: 10, far: 10000 }}
        gl={{ antialias: true }}
      >
        <Lights />
        <Scene />
        {/* <FloorGrid /> */}

        <OrbitControls
          makeDefault
          enablePan={INTERACTIONS.PAN}
          enableRotate={INTERACTIONS.ROTATE}
          enableDamping={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <UI />
    </>
  );
}

export default App;
