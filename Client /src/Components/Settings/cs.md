import React, { useContext, useState } from "react";
import {
Box,
TextField,
Button,
Snackbar,
Alert,
Switch,
MenuItem,
FormControl,
Select,
InputLabel,
} from "@mui/material";
import { CameraContext } from "../CameraContext";

const CameraSettings = () => {
const { cameraSettings, setCameraSettings, isFrustumView, setIsFrustumView } =
useContext(CameraContext);

// Snackbar state
const [snackbarOpen, setSnackbarOpen] = useState(false);
//controller - Orbit
const [controllerType, setControllerType] = useState("Orbit");

const handlePositionChange = (axis, value) => {
setCameraSettings((prevSettings) => ({
...prevSettings,
position: { ...prevSettings.position, [axis]: parseFloat(value) },
}));
};

    const handleTargetChange = (axis, value) => {
    setCameraSettings((prevSettings) => ({
    ...prevSettings,
    target: { ...prevSettings.target, [axis]: parseFloat(value) },
    }));
    };

const toggleView = () => {
setIsFrustumView(!isFrustumView);
};

const handleFovChange = (value) => {
setCameraSettings((prevSettings) => ({
...prevSettings,
fov: parseFloat(value),
}));
};

const handleNearChange = (value) => {
setCameraSettings((prevSettings) => ({
...prevSettings,
near: parseFloat(value),
}));
};

const handleFarChange = (value) => {
setCameraSettings((prevSettings) => ({
...prevSettings,
far: parseFloat(value),
}));
};

const handleSetCamera = () => {
setSnackbarOpen(true);
};

const handleSnackbarClose = (event, reason) => {
if (reason === "clickaway") {
return;
}
setSnackbarOpen(false); // Close the Snackbar
};

//controller handler

const handleControllerChange = (event) => {
setControllerType(event.target.value);
};

const handleToggleChange = (setting) => {
setCameraSettings((prevSettings) => ({
...prevSettings,
[setting]: !prevSettings[setting],
}));
};
return (
<Box>

<h2>Camera Settings</h2>

      {/* Camera Position Inputs */}
      <h3>Camera Position</h3>
      {["x", "y", "z"].map((axis) => (
        <TextField
          key={axis}
          label={`Position ${axis.toUpperCase()}`}
          value={cameraSettings.position[axis]}
          onChange={(e) => handlePositionChange(axis, e.target.value)}
          type="number"
          fullWidth
          sx={{ mb: 2 }}
        />
      ))}

      {/* Target Position Inputs */}
      <h3>Target Position</h3>
      {["x", "y", "z"].map((axis) => (
        <TextField
          key={axis}
          label={`Target ${axis.toUpperCase()}`}
          value={cameraSettings.target[axis]}
          onChange={(e) => handleTargetChange(axis, e.target.value)}
          type="number"
          fullWidth
          sx={{ mb: 2 }}
        />
      ))}

      {/* FOV, Near, and Far Inputs */}
      <h3>Other Settings</h3>
      <TextField
        label="FOV"
        value={cameraSettings.fov}
        onChange={(e) => handleFovChange(e.target.value)}
        type="number"
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Near"
        value={cameraSettings.near}
        onChange={(e) => handleNearChange(e.target.value)}
        type="number"
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Far"
        value={cameraSettings.far}
        onChange={(e) => handleFarChange(e.target.value)}
        type="number"
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button variant="contained" color="primary" onClick={handleSetCamera}>
        Set Camera
      </Button>

      {/* Toggle Frustum View */}
      <Button
        variant="contained"
        color={isFrustumView ? "secondary" : "primary"}
        onClick={toggleView}
        sx={{ marginTop: 2 }}
      >
        {isFrustumView ? "View Model" : "View Camera"}
      </Button>

      {/* Controller dropdown */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Controller</InputLabel>
        <Select value={controllerType} onChange={handleControllerChange}>
          <MenuItem value="Orbit">Orbit</MenuItem>
          <MenuItem value="FirstPerson">FirstPerson</MenuItem>
        </Select>
      </FormControl>

      {/* Orbit controls: Show these only if the controller type is "Orbit" */}
      {controllerType === "Orbit" && (
        <>
          <h3>Orbit Controls</h3>

          {/* Toggle controls */}
          {[
            { label: "Rotation", setting: "rotation" },
            { label: "Zoom In/Out", setting: "zoomInOut" },
            { label: "Panning", setting: "panning" },
            { label: "Lock Upper Hemisphere", setting: "lockUpperHemisphere" },
          ].map(({ label, setting }) => (
            <Box
              display="flex"
              alignItems="center"
              key={setting}
              sx={{ mb: 2 }}
            >
              <span>{label}</span>
              <Switch
                checked={cameraSettings[setting] || false}
                onChange={() => handleToggleChange(setting)}
                sx={{ ml: "auto" }}
              />
            </Box>
          ))}

          {/* Input fields for zoom and angle */}
          {[
            { label: "Min Zoom", setting: "minZoom", type: "number" },
            { label: "Max Zoom", setting: "maxZoom", type: "number" },
            { label: "Min Azimuth Angle", setting: "minAzim", type: "number" },
            { label: "Max Azimuth Angle", setting: "maxAzim", type: "number" },
            { label: "Min Polar Angle", setting: "minPolar", type: "number" },
            { label: "Max Polar Angle", setting: "maxPolar", type: "number" },
            {
              label: "Damping Factor",
              setting: "dampingFactor",
              type: "number",
            },
          ].map(({ label, setting, type }) => (
            <TextField
              key={setting}
              label={label}
              value={cameraSettings[setting] || 0}
              onChange={(e) =>
                setCameraSettings((prev) => ({
                  ...prev,
                  [setting]: parseFloat(e.target.value),
                }))
              }
              type={type}
              fullWidth
              sx={{ mb: 2 }}
            />
          ))}
        </>
      )}

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Auto hide after 3 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Camera updated successfully!
        </Alert>
      </Snackbar>
    </Box>

);
};

export default CameraSettings;
//2 -
