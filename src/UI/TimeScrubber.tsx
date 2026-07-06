import Slider from "@mui/material/Slider";
import useStore from "../state/store";

const TimeScrubber = () => {
  const airData = useStore((state) => state.airData);
  const currentDay = useStore((state) => state.currentDay);
  const setCurrentDay = useStore((state) => state.setCurrentDay);

  if (!airData) return null;

  const sensor = airData.sensors[0];
  const days = sensor.timeseries;
  const n = days.length;
  const current = days[currentDay];

  // One solid band per day — hard stops, no blending between days
  const gradient = `linear-gradient(to right, ${days
    .map(
      (d, i) =>
        `${d.color} ${(i / n) * 100}%, ${d.color} ${((i + 1) / n) * 100}%`,
    )
    .join(", ")})`;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        left: 24,
        right: 24,
        color: "#fff",
      }}
    >
      <div style={{ fontSize: 13, marginBottom: 6, fontFamily: "system-ui" }}>
        {current.date} · PM2.5 {current.pm25} µg/m³ · AQI {current.aqi}
      </div>
      <Slider
        min={0}
        max={n - 1}
        value={currentDay}
        onChange={(_, v) => setCurrentDay(v)}
        sx={{
          height: 10,
          "& .MuiSlider-rail": {
            background: gradient,
            opacity: 1,
            border: "1px solid rgba(255,255,255,0.15)",
          },
          "& .MuiSlider-track": {
            background: "transparent",
            border: "none", // kill the default filled track
          },
          "& .MuiSlider-thumb": {
            width: 16,
            height: 22,
            borderRadius: 1.5,
            background: "#fff",
            border: "2px solid rgba(0,0,0,0.4)",
            "&:hover, &.Mui-focusVisible": {
              boxShadow: "0 0 0 6px rgba(255,255,255,0.15)",
            },
          },
        }}
      />
    </div>
  );
};

export default TimeScrubber;
