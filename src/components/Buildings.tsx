import { useEffect, useState, useMemo } from "react";
import * as THREE from "three";

// Project lon/lat to local metres, centred on the bbox centre.
function project(lon, lat, centerLon, centerLat) {
  const R = 6378137; // earth radius, metres
  const x =
    (lon - centerLon) *
    (Math.PI / 180) *
    R *
    Math.cos((centerLat * Math.PI) / 180);
  const z = (lat - centerLat) * (Math.PI / 180) * R;
  return [x, z];
}

function Buildings({ color }) {
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    fetch("/data/delhi_buildings.json")
      .then((res) => res.json())
      .then(setBuildings)
      .catch((err) => console.error("Failed to load buildings:", err));
  }, []);

  // Centre of your bbox — MUST match the area you fetched.
  const centerLon = 77.22;
  const centerLat = 28.635;

  const geometry = useMemo(() => {
    if (!buildings.length) return null;

    const geometries = [];

    for (const b of buildings) {
      if (!b.coords || b.coords.length < 3) continue;

      const shape = new THREE.Shape();
      b.coords.forEach(([lon, lat], i) => {
        const [x, z] = project(lon, lat, centerLon, centerLat);
        if (i === 0) shape.moveTo(x, z);
        else shape.lineTo(x, z);
      });

      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: b.height || 15,
        bevelEnabled: false,
      });
      // Shape is in the XZ plane via X/Y; rotate so extrusion goes up (+Y).
      geo.rotateX(-Math.PI / 2);
      geometries.push(geo);
    }

    // Merge into one geometry for performance — 3435 separate meshes will tank framerate.
    return mergeGeometries(geometries);
  }, [buildings]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={0.6}
        metalness={0.1}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

export default Buildings;
