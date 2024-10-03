import React, { useState, useContext } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  IconButton,
  Menu,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomSlider from "../Styles/CustomSlider";
import { CameraContext } from "../CameraContext";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const CameraSettings = () => {
  const {
    cameras,
    addCamera,
    setActiveCamera,
    handleViewCamera,
    saveCameraSettings,
    updateActiveCameraSettings,
    renameCamera,
    deleteCamera,
    duplicateCamera,
  } = useContext(CameraContext);

  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openWarningSnackbar, setOpenWarningSnackbar] = useState(false);
  const [cameraType, setCameraType] = useState("perspective");
  const [cameraName, setCameraName] = useState("");

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedCameraIndex, setSelectedCameraIndex] = useState(null);
  const [cameraChanged, setCameraChanged] = useState(false);
  //  rename dialog
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameInput, setRenameInput] = useState("");

  const maxCameras = 4;

  const handleAddCamera = () => {
    if (cameras.length >= 4) {
      setSnackbarMessage("Max camera limit reached");
      setOpenWarningSnackbar(true);
      return;
    }

    const newCamera = {
      name: cameraName || `Camera ${cameras.length + 1}`,
      type: cameraType,
      settings: {
        position: { x: 0, y: 5, z: 10 },
        target: { x: 0, y: 0, z: 0 },
        near: 0.1,
        far: 1000,
        fov: 50,
      },
    };

    addCamera(newCamera);
    setOpenSuccessSnackbar(true);
    setCameraName("");
  };

  const handleViewCameraClick = (index) => {
    if (cameraChanged) {
      setUnsavedCameraSnackbar(true); // Show warning snackbar if unsaved changes exist
    } else {
      setActiveCamera(index);
      handleViewCamera();
    }
  };

  const handleSetCamera = () => {
    saveCameraSettings();
    setCameraChanged(false); // Reset camera change tracker
  };
  // Snackbar close handlers
  const handleSuccessSnackbarClose = () => {
    setOpenSuccessSnackbar(false);
  };
  const handleWarningSnackbarClose = () => {
    setOpenWarningSnackbar(false);
  };

  // const showSnackbarMessage = (message) => {
  //   setSnackbarMessage(message);
  //   setOpenSnackbar(true);
  // };

  const handleMenuOpen = (event, index) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedCameraIndex(index);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedCameraIndex(null);
  };

  // const handleRename = () => {
  //   const newName = prompt("Enter new name:");
  //   if (newName && selectedCameraIndex !== null) {
  //     renameCamera(selectedCameraIndex, newName);
  //   }
  //   handleMenuClose();
  // };
  const handleRenameOpenDialog = () => {
    if (selectedCameraIndex !== null) {
      setRenameInput(cameras[selectedCameraIndex]?.name || "");
      setRenameDialogOpen(true);
    }
  };

  const handleRenameCloseDialog = () => {
    setRenameDialogOpen(false);
  };

  const handleRenameSubmit = () => {
    if (renameInput.trim() && selectedCameraIndex !== null) {
      renameCamera(selectedCameraIndex, renameInput.trim());
    }
    setRenameDialogOpen(false);
    handleMenuClose();
  };
  const handleDelete = () => {
    if (selectedCameraIndex !== null) {
      deleteCamera(selectedCameraIndex);
    }
    handleMenuClose();
  };

  const handleDuplicate = () => {
    if (selectedCameraIndex !== null) {
      const typeCount = cameras.length;

      if (typeCount >= maxCameras) {
        setSnackbarMessage("Max camera limit reached");
        setOpenWarningSnackbar(true);
        handleMenuClose();
        return;
      }

      duplicateCamera(selectedCameraIndex);
      handleMenuClose();
    }
  };

  // Handlers for sliders
  const handlePositionChange = (axis, newValue) => {
    setCameraChanged(true);
    updateActiveCameraSettings({
      position: {
        ...cameras[0]?.settings.position,
        [axis]: newValue,
      },
    });
  };

  const handleTargetChange = (axis, newValue) => {
    setCameraChanged(true);
    updateActiveCameraSettings({
      target: {
        ...cameras[0]?.settings.target,
        [axis]: newValue,
      },
    });
  };

  const handleNearChange = (event, newValue) => {
    setCameraChanged(true);
    updateActiveCameraSettings({ near: newValue });
  };

  const handleFarChange = (event, newValue) => {
    setCameraChanged(true);
    updateActiveCameraSettings({ far: newValue });
  };

  const handleFovChange = (event, newValue) => {
    setCameraChanged(true);
    updateActiveCameraSettings({ fov: newValue });
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: "5px",
        display: "flex",
        flexDirection: "column",
        overflowY: "hidden",
        height: "100vh",
      }}
    >
      {/* Camera Settings Accordion List */}
      <Box
        sx={{
          height: "calc(100vh - 450px)",
          overflowY: "auto",
          paddingRight: "10px",
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "green",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
        }}
      >
        {cameras.map((camera, index) => (
          <Accordion
            key={index}
            disableGutters
            elevation={0}
            sx={{
              border: "none",
              padding: "0px",
              "& .MuiAccordionSummary-root": {
                minHeight: "10px",
                padding: "0px",
              },
              "& .MuiAccordionDetails-root": {
                padding: "2px",
              },
            }}
          >
            <AccordionSummary
              sx={{ minHeight: "20px", padding: "0px", margin: 0 }}
            >
              <ExpandMoreIcon sx={{ fontSize: "12px", paddingRight: "3px" }} />
              <Typography
                sx={{ fontSize: "8px", fontWeight: "normal", margin: 0 }}
              >
                {camera.name} SETTINGS
              </Typography>
              {/* Menu  Position for renmae , delete , duplicate camera  */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  marginLeft: "auto",
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, index)}
                >
                  <MoreVertIcon sx={{ fontSize: "12px" }} />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleRenameOpenDialog}>Rename</MenuItem>
                  <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  <MenuItem
                    onClick={handleDuplicate}
                    disabled={cameras.length >= 4}
                  >
                    Duplicate
                  </MenuItem>
                </Menu>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "0px", marginTop: "2px" }}>
              {/* Camera Position Sliders */}
              <Typography sx={{ fontSize: "10px", mb: 1 }}>Position</Typography>
              {["x", "y", "z"].map((axis) => (
                <CustomSlider
                  key={`position-${axis}`}
                  value={camera.settings.position[axis]}
                  onChange={(e, newValue) =>
                    handlePositionChange(axis, newValue)
                  }
                  label={`Position ${axis.toUpperCase()}`}
                  min={0}
                  max={100}
                  step={0.01}
                />
              ))}

              {/* Target Position Sliders */}
              <Typography sx={{ fontSize: "10px", mt: 2 }}>
                Target Position
              </Typography>
              {["x", "y", "z"].map((axis) => (
                <CustomSlider
                  key={`target-${axis}`}
                  value={camera.settings.target[axis]}
                  onChange={(e, newValue) => handleTargetChange(axis, newValue)}
                  label={`Target ${axis.toUpperCase()}`}
                  min={0}
                  max={100}
                  step={0.01}
                />
              ))}

              {/* Far, Near, FOV Sliders */}
              <CustomSlider
                value={camera.settings.near}
                onChange={handleNearChange}
                label="Near"
                min={0.01}
                max={10}
                step={0.01}
              />
              <CustomSlider
                value={camera.settings.far}
                onChange={handleFarChange}
                label="Far"
                min={camera.settings.near + 0.01}
                max={2000}
                step={1}
              />
              <CustomSlider
                value={camera.settings.fov}
                onChange={handleFovChange}
                label="FOV"
                min={10}
                max={100}
                step={0.1}
              />

              {/* View Camera and Set Camera Buttons */}
              <Box display="flex" flexDirection="column" gap={2} mt={2}>
                <Tooltip
                  title="Make sure to click 'Set Camera' to save changes before switching cameras"
                  placement="top"
                  arrow
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewCameraClick(index)}
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
                </Tooltip>
                <Button
                  variant="contained"
                  size="small"
                  onClick={saveCameraSettings}
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
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Add Camera Form - */}
      <Box
        sx={{
          position: "absolute",
          bottom: 65,
          marginTop: "10px",
          width: "100%",
          padding: "10px",
          backgroundColor: "#f1f1f1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "70px",
        }}
      >
        <FormControl
          variant="outlined"
          className="custom-text-field"
          sx={{ marginBottom: 3, width: "70%" }}
        >
          <InputLabel
            shrink={true}
            sx={{
              transform: "translate(14px, -6px) scale(0.75)",
              backgroundColor: "white",
              padding: "0 4px",
            }}
          >
            Camera Type
          </InputLabel>
          <Select
            value={cameraType}
            onChange={(e) => setCameraType(e.target.value)}
            label="Camera Type"
          >
            <MenuItem value="perspective">Perspective</MenuItem>
          </Select>
        </FormControl>

        <TextField
          variant="outlined"
          className="custom-text-field"
          label="Camera Name"
          value={cameraName}
          onChange={(e) => setCameraName(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2, width: "70%" }}
          InputLabelProps={{
            shrink: true,
            style: {
              transform: "translate(14px, -6px) scale(0.75)",
              backgroundColor: "white",
              padding: "0 4px",
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleAddCamera}
          disabled={cameras.length >= 4}
          sx={{
            backgroundColor: "green",
            color: "white",
            borderRadius: "10px",
            flexGrow: 1,
            fontSize: "10px",
            padding: "5px 10px",
            "&:hover": { backgroundColor: "darkgreen" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Add Camera
        </Button>
      </Box>

      {/* Snackbar for Save Confirmation */}
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={3000}
        onClose={handleSuccessSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSuccessSnackbarClose} severity="success">
          Camera added successfully!
        </Alert>
      </Snackbar>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openWarningSnackbar}
        autoHideDuration={3000}
        onClose={handleWarningSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleWarningSnackbarClose} severity="warning">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Rename Camera Dialog */}
      <Dialog open={renameDialogOpen} onClose={handleRenameCloseDialog}>
        <DialogTitle>Rename Camera</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Camera Name"
            type="text"
            fullWidth
            variant="outlined"
            value={renameInput}
            onChange={(e) => setRenameInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRenameSubmit} color="primary">
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CameraSettings;
//1 camera full working with context + menu
//
