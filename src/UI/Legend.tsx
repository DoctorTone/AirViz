import { Box } from "@mui/material";

const Legend = () => {
  const aqi_scale = {
    good: { range: "0-50", color: "#00E400" },
    moderate: { range: "51-100", color: "#FFFF00" },
    unhealthy_sensitive: { range: "101-150", color: "#FF7E00" },
    unhealthy: { range: "151-200", color: "#FF0000" },
    very_unhealthy: { range: "201-300", color: "#8F3F97" },
    hazardous: { range: "301-500", color: "#7E0023" },
  };
  return (
    <Box
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(8px)",
        padding: 2,
        borderRadius: 2,
        color: "#fff",
        fontSize: 12,
        fontFamily: "system-ui",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Air Quality (AQI)</div>
      {Object.entries(aqi_scale).map(([name, info]) => (
        <div
          key={name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 3,
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: info.color,
              flexShrink: 0,
            }}
          />
          <span>
            {name.replace(/_/g, " ")} · {info.range}
          </span>
        </div>
      ))}
    </Box>
  );
};

export default Legend;
