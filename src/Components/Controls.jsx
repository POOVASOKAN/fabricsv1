/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import VideocamIcon from "@mui/icons-material/Videocam";
import CachedIcon from "@mui/icons-material/Cached";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CheckIcon from "@mui/icons-material/Check";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import CustomSlider from "./Styles/CustomSlider.jsx";
import CameraSettings from "./Settings/CameraSettings";
import ColorPicker from "./Styles/ColorPicker.jsx";
import LightSettings from "./Settings/LightSettings.jsx";

const Controls = () => {
  const [open, setOpen] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState("materials");
  const [bumpScale, setBumpScale] = useState(0.5);
  const [normalX, setNormalX] = useState(1);
  const [normalY, setNormalY] = useState(1);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [displacementScale, setDisplacementScale] = useState(1);
  const [displacementBias, setDisplacementBias] = useState(0);
  const [metalness, setMetalness] = useState(0.0);
  const [roughness, setRoughness] = useState(0.0);
  const [emissive, setEmissive] = useState(0);
  const [envIntensity, setEnvIntensity] = useState(0);
  const [specular, setSpecular] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [ao, setAo] = useState(1);
  const [sheenIntensity, setSheenIntensity] = useState(0);
  const [sheenRoughness, setSheenRoughness] = useState(1);
  const handleToggle = () => {
    setOpen(!open);
  };

  // Handler to set the selected icon
  const handleIconSelect = (iconName) => {
    setSelectedIcon(iconName);
  };

  // Handlers for sliders
  const handleBumpScaleChange = (event, newValue) => {
    setBumpScale(newValue);
  };

  const handleNormalXChange = (event, newValue) => {
    setNormalX(newValue);
  };

  const handleNormalYChange = (event, newValue) => {
    setNormalY(newValue);
  };

  const handleScaleXChange = (event, newValue) => {
    setScaleX(newValue);
  };

  const handleScaleYChange = (event, newValue) => {
    setScaleY(newValue);
  };

  const handleDisplacementScaleChange = (event, newValue) => {
    setDisplacementScale(newValue);
  };

  const handleDisplacementBiasChange = (event, newValue) => {
    setDisplacementBias(newValue);
  };

  const handleMetalnessChange = (event, newValue) => {
    setMetalness(newValue);
  };

  const handleRoughnessChange = (event, newValue) => {
    setRoughness(newValue);
  };

  const handleEmissiveChange = (event, newValue) => {
    setEmissive(newValue);
  };
  const handleEnvIntensityChange = (event, newValue) => {
    setEnvIntensity(newValue);
  };

  const handleSpecularChange = (event, newValue) => {
    setSpecular(newValue);
  };
  const handleOpacityChange = (event, newValue) => {
    setOpacity(newValue);
  };
  const handleAoChange = (event, newValue) => {
    setAo(newValue);
  };
  const handleSheenIntensityChange = (event, newValue) => {
    setSheenIntensity(newValue);
  };

  const handleSheenRoughnessChange = (event, newValue) => {
    setSheenRoughness(newValue);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "97vh",
        margin: "10px auto",
        backgroundColor: "white",
        display: "flex",

        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Sidebar Icon */}
      <IconButton
        onClick={handleToggle}
        sx={{
          position: "fixed",
          right: open ? "280px" : "0px",
          top: "10px",
          zIndex: 1300,
          padding: "4px",
          color: "black",
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        <MenuOpenIcon fontSize="small" />
      </IconButton>

      {/* Drawer Panel */}
      <Box
        sx={{
          position: "fixed",
          right: open ? 0 : "-280px",
          top: 0,
          width: "280px",
          height: "97vh",
          backgroundColor: "#f5f5f5",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          transition: "right 0.3s ease",
          zIndex: 1200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <AppBar
          position="static"
          sx={{ backgroundColor: "black", padding: "5px", height: "65px" }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" component="div" sx={{ fontSize: "12px" }}>
              {selectedIcon === "sun"
                ? "Light Scene Name"
                : selectedIcon === "camera"
                ? "Camera Setting Name"
                : "Materials"}
            </Typography>
            <Box sx={{ display: "flex", gap: "5px" }}>
              <IconButton
                sx={{
                  color: selectedIcon === "materials" ? "white" : "white",
                  padding: "6px",
                  borderRadius: "50%",
                  backgroundColor:
                    selectedIcon === "materials" ? "green" : "transparent",
                  border:
                    selectedIcon === "materials" ? "0.5px solid white" : "none",
                  "&:hover": {
                    backgroundColor:
                      selectedIcon === "materials"
                        ? "darkgreen"
                        : "rgba(255, 255, 255, 0.1)",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                  "&:focus-visible": {
                    outline: "none",
                  },
                }}
                onClick={() => handleIconSelect("materials")}
              >
                <BackupTableIcon fontSize="small" />
              </IconButton>

              {/* Sun Icon */}
              <IconButton
                sx={{
                  color: selectedIcon === "sun" ? "white" : "white",
                  padding: "6px",
                  borderRadius: "50%",
                  backgroundColor:
                    selectedIcon === "sun" ? "green" : "transparent",
                  border: selectedIcon === "sun" ? "0.5px solid white" : "none",
                  "&:hover": {
                    backgroundColor:
                      selectedIcon === "sun"
                        ? "darkgreen"
                        : "rgba(255, 255, 255, 0.1)",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                  "&:focus-visible": {
                    outline: "none",
                  },
                }}
                onClick={() => handleIconSelect("sun")}
              >
                <WbSunnyIcon />
              </IconButton>

              {/* Camera Icon */}
              <IconButton
                sx={{
                  color: selectedIcon === "camera" ? "white" : "white",
                  padding: "6px",
                  borderRadius: "50%",
                  backgroundColor:
                    selectedIcon === "camera" ? "green" : "transparent",
                  border:
                    selectedIcon === "camera" ? "0.5px solid white" : "none",
                  "&:hover": {
                    backgroundColor:
                      selectedIcon === "camera"
                        ? "darkgreen"
                        : "rgba(255, 255, 255, 0.1)",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                  "&:focus-visible": {
                    outline: "none",
                  },
                }}
                onClick={() => handleIconSelect("camera")}
              >
                <VideocamIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            padding: "5px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            overflowY: "hidden",
          }}
        >
          <Box className="container">
            {/* Material Name */}
            <TextField
              label={
                selectedIcon === "sun"
                  ? "Light Scene Name"
                  : selectedIcon === "camera"
                  ? "Camera Setting Name"
                  : "Material Name"
              }
              variant="outlined"
              className="custom-text-field"
              InputLabelProps={{
                shrink: true,
                style: {
                  transform: "translate(14px, -6px) scale(0.75)",
                  backgroundColor: "white",
                  padding: "0 4px",
                },
              }}
            />
          </Box>

          {/* Render Material Settings  */}
          {selectedIcon === "materials" ? (
            <Box>
              {/* Accordion Section for materials */}
              {[
                "DIFFUSE",
                "ENVIRONMENT",
                "REFRACTION",
                "BUMP",
                "NORMAL",
                "DISPLACEMENT",
                "SPECULAR",
                "SHEEN",
                "EMISSIVE",
                "OPACITY",
                "AO",
                "METALNESS",
                "ROUGHNESS",
              ].map((control) => (
                <Box key={control}>
                  <Accordion
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
                      <ExpandMoreIcon
                        sx={{ fontSize: "12px", paddingRight: "3px" }}
                      />
                      <Typography
                        sx={{
                          fontSize: "8px",
                          fontWeight: "normal",
                          margin: 0,
                        }}
                      >
                        {control}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        padding: "0px",
                        marginTop: "2px",
                        maxHeight: "120px",
                        overflowY: "auto",
                      }}
                    >
                      {control === "BUMP" && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          <CustomSlider
                            value={bumpScale}
                            onChange={handleBumpScaleChange}
                            label="bumpScale"
                          />
                        </Box>
                      )}
                      {control === "DIFFUSE" && (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomSlider
                              value={scaleX}
                              onChange={handleScaleXChange}
                              label="scaleX"
                            />
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomSlider
                              value={scaleY}
                              onChange={handleScaleYChange}
                              label="scaleY"
                            />
                          </Box>
                        </>
                      )}

                      {control === "NORMAL" && (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomSlider
                              value={normalX}
                              onChange={handleNormalXChange}
                              label="NormalX"
                            />
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomSlider
                              value={normalY}
                              onChange={handleNormalYChange}
                              label="NormalY"
                            />
                          </Box>
                        </>
                      )}

                      {control === "DISPLACEMENT" && (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomSlider
                              value={displacementScale}
                              onChange={handleDisplacementScaleChange}
                              label="Scale"
                            />
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomSlider
                              value={displacementBias}
                              onChange={handleDisplacementBiasChange}
                              label="Bias"
                            />
                          </Box>
                        </>
                      )}
                      {control === "METALNESS" && (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomSlider
                              value={metalness}
                              onChange={handleMetalnessChange}
                              label="metalness"
                            />
                          </Box>
                        </>
                      )}

                      {control === "ROUGHNESS" && (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomSlider
                              value={roughness}
                              onChange={handleRoughnessChange}
                              label="Roughness"
                            />
                          </Box>
                        </>
                      )}

                      {control === "EMISSIVE" && (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomSlider
                              value={emissive}
                              onChange={handleEmissiveChange}
                              label="Emissive"
                            />
                          </Box>
                        </>
                      )}
                      {control === "ENVIRONMENT" && (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomSlider
                              value={envIntensity}
                              onChange={handleEnvIntensityChange}
                              label="Intensity"
                            />
                          </Box>
                        </>
                      )}

                      {control === "SPECULAR" && (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomSlider
                              value={specular}
                              onChange={handleSpecularChange}
                              label="Intensity"
                            />
                          </Box>
                        </>
                      )}
                      {control === "OPACITY" && (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomSlider
                              value={opacity}
                              onChange={handleOpacityChange}
                              label="opacity"
                            />
                          </Box>
                        </>
                      )}
                      {control === "AO" && (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomSlider
                              value={ao}
                              onChange={handleAoChange}
                              label="Intensity"
                            />
                          </Box>
                        </>
                      )}

                      {control === "SHEEN" && (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomSlider
                              value={sheenIntensity}
                              onChange={handleSheenIntensityChange}
                              label="Sheen"
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomSlider
                              value={sheenRoughness}
                              onChange={handleSheenRoughnessChange}
                              label="R.ness"
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <ColorPicker />
                          </Box>
                        </>
                      )}
                    </AccordionDetails>
                  </Accordion>
                  <Divider
                    sx={{
                      borderBottomWidth: "0.5px",
                      backgroundColor: "#ccc",
                      width: "90%",
                      margin: "0 auto",
                    }}
                  />
                </Box>
              ))}
            </Box>
          ) : selectedIcon === "camera" ? (
            <CameraSettings />
          ) : selectedIcon === "sun" ? (
            <LightSettings />
          ) : null}
        </Box>

        {/* Footer Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#333",
            padding: "5px",
            gap: "10px",
            minHeight: "50px",
          }}
        >
          <IconButton
            sx={{
              color: "white",
              padding: "6px",
              border: "1px solid white",
              borderRadius: "50%",
              backgroundColor: "transparent",
            }}
          >
            <CachedIcon sx={{ fontSize: "14px" }} />
          </IconButton>

          {/* Load button */}
          <Button
            variant="outlined"
            sx={{
              borderRadius: "10px",
              flexGrow: 1,
              marginRight: "5px",
              fontSize: "10px",
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "lightgray",
                color: "lightgray",
              },
            }}
          >
            Load
          </Button>

          {/* Save button  */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "green",
              color: "white",
              borderRadius: "10px",
              flexGrow: 1,
              fontSize: "10px",
              padding: "5px 10px",
              "&:hover": {
                backgroundColor: "darkgreen",
              },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            startIcon={<CheckIcon sx={{ fontSize: "12px" }} />}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Controls;
//v3 - All UI updated
