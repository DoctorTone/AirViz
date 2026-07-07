import { useEffect } from "react";
import Terrain from "./Terrain";
import useStore from "../state/store";
import Buildings from "./Buildings";
import SmogLayers from "./SmogLayers";

const Scene = () => {
  const airData = useStore((state) => state.airData);
  const setAirData = useStore((state) => state.setAirData);
  const currentDay = useStore((state) => state.currentDay);

  useEffect(() => {
    fetch("./data/delhi_air_quality.json")
      .then((res) => res.json())
      .then((json) => setAirData(json))
      .catch((err) => console.error("Failed to load data:", err));
  }, []);

  if (!airData) {
    return null;
  }

  const sensor = airData.sensors[0];
  const timeseries = sensor.timeseries;
  const currentReading = timeseries[currentDay];

  return (
    <>
      <Terrain />
      <Buildings />
      <SmogLayers pm25={currentReading.pm25} />
    </>
  );
};

export default Scene;
