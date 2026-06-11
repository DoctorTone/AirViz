import { Grid } from "@react-three/drei";

const FloorGrid = () => {
  return (
    <Grid
      args={[10, 10]}
      position={[0, 0.01, 0]}
      cellSize={4}
      cellThickness={1}
      cellColor="#6f6f6f"
      sectionSize={16}
      sectionThickness={1.5}
      sectionColor="#9d4b4b"
      infiniteGrid
      fadeDistance={250}
      fadeStrength={1}
    />
  );
};

export default FloorGrid;
