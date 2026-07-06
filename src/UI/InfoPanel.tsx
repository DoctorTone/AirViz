import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

const InfoPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px

  return (
    <Box
      sx={{
        position: "absolute",
        top: isMobile ? 10 : 20,
        left: isMobile ? 10 : 20,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(10px)",
        padding: 2,
        borderRadius: 2,
        minWidth: 200,
        maxWidth: isMobile ? "45vw" : "none", // Cap width on mobile
      }}
    >
      <Typography
        variant={isMobile ? "subtitle1" : "h6"}
        sx={{ color: "white", mb: isMobile ? 0.5 : 1, fontWeight: 600 }}
      >
        Delhi Air Pollution
      </Typography>
      {!isMobile && ( // Hide description on mobile to save space
        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}
        >
          3D visualisation of air pollution across Delhi
        </Typography>
      )}
      <Box sx={{ mt: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,255,255,0.6)",
            fontSize: isMobile ? "0.65rem" : "0.75rem",
          }}
        >
          Pollution Range
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-around" }}>
        <Typography
          variant={"body2"}
          sx={{
            color: "white",
          }}
        >
          PM2.5: (27 - 91)
        </Typography>
        <Typography
          variant={"body2"}
          sx={{
            color: "white",
          }}
        >
          AQI: (83 - 169)
        </Typography>
      </Box>
    </Box>
  );
};

export default InfoPanel;
