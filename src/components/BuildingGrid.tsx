import { useRef } from "react";

const BuildingGrid = ({ pm25, color }) => {
  const groupRef = useRef(null);

  // Generate grid of buildings around sensor
  const buildingData = [];
  for (let x = -80; x <= 80; x += 10) {
    for (let z = -80; z <= 80; z += 10) {
      buildingData.push({
        x,
        z,
        height: Math.random() * 40 + 5, // 5-45m height
        width: 8,
        depth: 8,
      });
    }
  }

  return (
    <group ref={groupRef}>
      {buildingData.map((building, idx) => {
        // Vary color slightly based on position
        const variedColor = color; // Could vary by distance from sensor
        return (
          <mesh
            key={idx}
            position={[building.x, building.height / 2, building.z]}
          >
            <boxGeometry
              args={[building.width, building.height, building.depth]}
            />
            <meshStandardMaterial
              color={variedColor}
              roughness={0.5}
              metalness={0.2}
              emissive={color}
              emissiveIntensity={0.25}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default BuildingGrid;
