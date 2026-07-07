import { useEffect, useState, useMemo } from "react";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { Color, Shape, ExtrudeGeometry, Float32BufferAttribute } from "three";

type Building = {
  coords: [number, number][];
  height: number;
};

// Project lon/lat to local metres, centred on the bbox centre.
function project(
  lon: number,
  lat: number,
  centerLon: number,
  centerLat: number,
) {
  const R = 6378137; // earth radius, metres
  const x =
    (lon - centerLon) *
    (Math.PI / 180) *
    R *
    Math.cos((centerLat * Math.PI) / 180);
  const z = (lat - centerLat) * (Math.PI / 180) * R;
  return [x, z];
}

function Buildings() {
  const [buildings, setBuildings] = useState<Building[]>([]);

  useEffect(() => {
    fetch("./data/delhi_buildings.json")
      .then((res) => res.json())
      .then(setBuildings)
      .catch((err) => console.error("Failed to load buildings:", err));
  }, []);

  // Centre of your bbox — MUST match the area you fetched.
  const centerLon = 77.22;
  const centerLat = 28.635;

  const geometry = useMemo(() => {
    if (!buildings.length) return null;

    // DEBUG
    // Building height spread
    // const heights = buildings.map((b) => b.height).sort((a, b) => a - b);
    // console.log("min", heights[0], "max", heights[heights.length - 1]);
    // console.log("median", heights[Math.floor(heights.length / 2)]);
    // console.log("p95", heights[Math.floor(heights.length * 0.95)]);

    const geometries = [];
    const base = new Color(0x9a958a);

    for (const b of buildings) {
      if (!b.coords || b.coords.length < 3) continue;

      const shape = new Shape();
      b.coords.forEach(([lon, lat], i) => {
        const [x, z] = project(lon, lat, centerLon, centerLat);
        if (i === 0) shape.moveTo(x, z);
        else shape.lineTo(x, z);
      });

      const geo = new ExtrudeGeometry(shape, {
        depth: b.height || 15,
        bevelEnabled: false,
      });
      // Shape is in the XZ plane via X/Y; rotate so extrusion goes up (+Y).
      geo.rotateX(-Math.PI / 2);

      // Set building colour
      const t = Math.min(b.height / 70, 1); // 0..1 across your height range
      const v = 0.9 + t * 0.15; // taller = slightly lighter
      const c = base.clone().multiplyScalar(v);

      const colors = [];
      const count = geo.attributes.position.count;
      for (let i = 0; i < count; i++) colors.push(c.r, c.g, c.b);
      geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
      geometries.push(geo);
    }

    // Merge into one geometry for performance — 3435 separate meshes will tank framerate.
    return mergeGeometries(geometries);
  }, [buildings]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors roughness={0.7} metalness={0.1} />
    </mesh>
  );
}

export default Buildings;
