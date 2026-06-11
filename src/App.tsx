import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { INTERACTIONS } from "./state/Config";
import Lights from "./components/Lights";
import Scene from "./components/Scene";
import FloorGrid from "./components/FloorGrid";
import UI from "./UI/UI";

function App() {
  return (
    <>
      <Canvas
        camera={{ position: [0, 50, 100], fov: 50, near: 10, far: 10000 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#1a1a2e"]} />
        <Lights />
        <Scene />
        <FloorGrid />

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
