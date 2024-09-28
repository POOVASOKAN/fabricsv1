import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Snackbar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CameraSettings = () => {
  // State for camera settings
  const [cameraPosition, setCameraPosition] = useState({ x: 1, y: -5, z: -10 });
  const [targetPosition, setTargetPosition] = useState({ x: 1, y: 0, z: -10 });
  const [near, setNear] = useState(0.5);
  const [far, setFar] = useState(0.5);
  const [fov, setFov] = useState(0.5);
  const [controller, setController] = useState("Orbit");
  const [rotation, setRotation] = useState(true);
  const [zoomInOut, setZoomInOut] = useState(true);
  const [panning, setPanning] = useState(true);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(1);
  const [lockUpperHemisphere, setLockUpperHemisphere] = useState(true);
  const [minAzim, setMinAzim] = useState(0);
  const [maxAzim, setMaxAzim] = useState(360);
  const [minPolar, setMinPolar] = useState(0);
  const [maxPolar, setMaxPolar] = useState(180);
  const [dampFactor, setDampFactor] = useState(1);

  // FirstPerson specific states
  const [movementSpeed, setMovementSpeed] = useState(50);
  const [lookSpeed, setLookSpeed] = useState(50);

  // Camera Type and Name states
  const [cameraType, setCameraType] = useState("Perspective");
  const [cameraName, setCameraName] = useState("");
  const [cameras, setCameras] = useState([{ name: "Default Camera" }]);

  // Snackbar state for camera limit
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Handlers for camera position inputs
  const handlePositionChange = (axis, value) => {
    setCameraPosition((prev) => ({ ...prev, [axis]: parseFloat(value) }));
  };

  const handleTargetChange = (axis, value) => {
    setTargetPosition((prev) => ({ ...prev, [axis]: parseFloat(value) }));
  };

  const handleAddCamera = () => {
    if (cameras.length >= 4) {
      setSnackbarOpen(true);
      return;
    }

    if (cameraName.trim()) {
      setCameras([...cameras, { name: cameraName, type: cameraType }]);
      setCameraName(""); // Reset camera name field
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          paddingBottom: "155px",
          scrollbarWidth: "thin",
        }}
      >
        {cameras.map((camera, index) => (
          <Accordion
            defaultExpanded
            key={index}
            sx={{ margin: "0", padding: "0" }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: "12px", fontWeight: "normal", flexGrow: 1 }}
              >
                {camera.name}
              </Typography>
              <Button
                size="small"
                sx={{
                  color: "#1976d2",
                  textTransform: "none",
                  fontSize: "10px",
                  fontWeight: "normal",
                }}
              >
                Edit
              </Button>
            </AccordionSummary>
            <AccordionDetails>
              {/* Position Inputs */}
              <Box display="flex" gap={1} mb={2} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "10px",
                    fontWeight: "normal",
                    color: "#333",
                    flexGrow: 1,
                  }}
                >
                  cameraPos...
                </Typography>
                {["x", "y", "z"].map((axis) => (
                  <TextField
                    key={axis}
                    label={axis.toUpperCase()}
                    value={cameraPosition[axis]}
                    onChange={(e) => handlePositionChange(axis, e.target.value)}
                    size="small"
                    type="number"
                    sx={{
                      width: "60px",
                      "& .MuiInputBase-root": {
                        fontSize: "12px",
                        textAlign: "center",
                        backgroundColor: "#f5f5f5",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  />
                ))}
              </Box>

              {/* Near, Far, Fov Inputs */}
              {["Near", "Far", "Fov"].map((setting, index) => (
                <TextField
                  key={setting}
                  label={setting}
                  value={index === 0 ? near : index === 1 ? far : fov}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (index === 0) setNear(value);
                    else if (index === 1) setFar(value);
                    else setFov(value);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  sx={{
                    mb: 2,
                    "& .MuiInputBase-root": {
                      fontSize: "12px",
                      backgroundColor: "#f5f5f5",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                />
              ))}

              {/* View and Set Camera Buttons */}
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                alignItems="center"
                mt={2}
              >
                <Button
                  variant="outlined"
                  sx={{
                    width: "100%",
                    textTransform: "none",
                    fontSize: "14px",
                    borderRadius: "8px",
                    borderColor: "#ccc",
                    color: "#333",
                    "&:hover": {
                      borderColor: "#888",
                    },
                  }}
                >
                  View Camera
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    width: "100%",
                    textTransform: "none",
                    fontSize: "14px",
                    backgroundColor: "#4caf50",
                    color: "white",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#388e3c",
                    },
                  }}
                >
                  Set Camera
                </Button>
              </Box>

              {/* Target Position Inputs */}
              <Box display="flex" gap={1} mt={3} mb={2} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "10px",
                    fontWeight: "normal",
                    color: "#333",
                    flexGrow: 1,
                  }}
                >
                  targetPos...
                </Typography>
                {["x", "y", "z"].map((axis) => (
                  <TextField
                    key={axis}
                    label={axis.toUpperCase()}
                    value={targetPosition[axis]}
                    onChange={(e) => handleTargetChange(axis, e.target.value)}
                    size="small"
                    type="number"
                    sx={{
                      width: "60px",
                      "& .MuiInputBase-root": {
                        fontSize: "12px",
                        textAlign: "center",
                        backgroundColor: "#f5f5f5",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  />
                ))}
              </Box>

              {/* Transform Focus Button */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={2}
              >
                <Button
                  variant="outlined"
                  sx={{
                    width: "100%",
                    textTransform: "none",
                    fontSize: "14px",
                    borderRadius: "8px",
                    borderColor: "#ccc",
                    color: "#333",
                    "&:hover": {
                      borderColor: "#888",
                    },
                  }}
                >
                  Transform Focus
                </Button>
              </Box>

              {/* Controller Section */}
              <Box mt={4}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Controller</InputLabel>
                  <Select
                    value={controller}
                    onChange={(e) => setController(e.target.value)}
                    label="Controller"
                    sx={{ fontSize: "12px" }}
                  >
                    <MenuItem value="Orbit">Orbit</MenuItem>
                    <MenuItem value="FirstPerson">FirstPerson</MenuItem>
                  </Select>
                </FormControl>

                {/* FirstPerson specific controls */}
                {controller === "FirstPerson" && (
                  <Box>
                    <TextField
                      label="Movement Speed"
                      value={movementSpeed}
                      disabled
                      type="number"
                      inputProps={{ max: 100, min: 0 }}
                      size="small"
                      sx={{
                        width: "100%",
                        mb: 2,
                        "& .MuiInputBase-root": {
                          fontSize: "12px",
                          backgroundColor: "#f5f5f5",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    />
                    <TextField
                      label="Look Speed"
                      value={lookSpeed}
                      disabled
                      type="number"
                      inputProps={{ max: 100, min: 0 }}
                      size="small"
                      sx={{
                        width: "100%",
                        mb: 2,
                        "& .MuiInputBase-root": {
                          fontSize: "12px",
                          backgroundColor: "#f5f5f5",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Other controller settings for Orbit */}
                {controller !== "FirstPerson" && (
                  <>
                    {[
                      {
                        label: "Rotation",
                        value: rotation,
                        setter: setRotation,
                      },
                      {
                        label: "Zoom in/out",
                        value: zoomInOut,
                        setter: setZoomInOut,
                      },
                      { label: "Panning", value: panning, setter: setPanning },
                      {
                        label: "Lock Upper Hemisphere",
                        value: lockUpperHemisphere,
                        setter: setLockUpperHemisphere,
                      },
                    ].map(({ label, value, setter }, index) => (
                      <Box
                        display="flex"
                        gap={2}
                        mb={2}
                        alignItems="center"
                        key={index}
                      >
                        <Typography
                          sx={{
                            flexGrow: 1,
                            fontSize: "10px",
                            fontWeight: "normal",
                            color: "#333",
                          }}
                        >
                          {label}
                        </Typography>
                        <Switch
                          checked={value}
                          onChange={() => setter(!value)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "green",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: "green",
                              },
                            "& .MuiSwitch-track": {
                              backgroundColor: "#ccc",
                            },
                          }}
                        />
                        <TextField
                          value={1}
                          size="small"
                          sx={{
                            width: "50px",
                            "& .MuiInputBase-root": {
                              fontSize: "12px",
                              backgroundColor: "#f5f5f5",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          }}
                        />
                      </Box>
                    ))}

                    {[
                      { label: "Min Zoom", value: minZoom, setter: setMinZoom },
                      { label: "Max Zoom", value: maxZoom, setter: setMaxZoom },
                      {
                        label: "Min Azim°",
                        value: minAzim,
                        setter: setMinAzim,
                      },
                      {
                        label: "Max Azim°",
                        value: maxAzim,
                        setter: setMaxAzim,
                      },
                      {
                        label: "Min Polar°",
                        value: minPolar,
                        setter: setMinPolar,
                      },
                      {
                        label: "Max Polar°",
                        value: maxPolar,
                        setter: setMaxPolar,
                      },
                      {
                        label: "Dampfactor",
                        value: dampFactor,
                        setter: setDampFactor,
                      },
                    ].map(({ label, value, setter }, index) => (
                      <Box
                        display="flex"
                        gap={2}
                        mb={2}
                        alignItems="center"
                        key={index}
                      >
                        <Typography
                          sx={{
                            flexGrow: 1,
                            fontSize: "10px",
                            fontWeight: "normal",
                            color: "#333",
                          }}
                        >
                          {label}
                        </Typography>
                        <TextField
                          value={value}
                          onChange={(e) => setter(parseFloat(e.target.value))}
                          size="small"
                          sx={{
                            width: "60px",
                            "& .MuiInputBase-root": {
                              fontSize: "12px",
                              backgroundColor: "#f5f5f5",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Camera Type, Name, and Add button at the bottom */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "8px", // Shrink padding to reduce height
          backgroundColor: "#fff",
          position: "absolute",
          bottom: 125, // Keeps it above the footer
          width: "100%",
          boxShadow: "0px -1px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Camera Type */}
        <FormControl fullWidth sx={{ mb: 1 }}>
          {" "}
          {/* Reduced bottom margin */}
          <InputLabel>Camera Type</InputLabel>
          <Select
            value={cameraType}
            onChange={(e) => setCameraType(e.target.value)}
            label="Camera Type"
            sx={{ fontSize: "12px" }}
          >
            <MenuItem value="Perspective">Perspective</MenuItem>
          </Select>
        </FormControl>

        {/* Camera Name */}
        <TextField
          label="Camera Name"
          placeholder="Enter Camera Name"
          value={cameraName}
          onChange={(e) => setCameraName(e.target.value)}
          fullWidth
          sx={{
            mb: 1, // Reduced bottom margin
            "& .MuiInputBase-root": {
              fontSize: "12px",
              backgroundColor: "#f5f5f5",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        />

        {/* Add Button */}
        <Button
          variant="contained"
          onClick={handleAddCamera}
          sx={{
            textTransform: "none",
            fontSize: "14px",
            backgroundColor: "#4caf50",
            color: "white",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#388e3c",
            },
            padding: "6px", // Reduced button padding to shrink the button size
          }}
        >
          Add
        </Button>
      </Box>

      {/* Snackbar for camera limit */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Only 4 cameras can be added"
      />
    </Box>
  );
};

export default CameraSettings;
//final befoee context
