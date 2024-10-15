import React, { useContext, useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import \* as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { CameraContext } from "../Components/CameraContext";
import { LightContext } from "../Components/LightContext";
import { Box, Button } from "@mui/material"; // Import MUI Button

// Helper component to visualize the camera frustum
const CameraHelperComponent = ({ camera, isControllerView }) => {
const { scene } = useThree();
const helperRef = useRef();

useEffect(() => {
if (camera && !helperRef.current) {
const cameraHelper = new THREE.CameraHelper(camera);
helperRef.current = cameraHelper;
scene.add(cameraHelper);
console.log("CameraHelper added to the scene", cameraHelper);
}

    return () => {
      if (helperRef.current) {
        scene.remove(helperRef.current);
        console.log("CameraHelper removed from the scene");
      }
    };

}, [camera, scene]);

useEffect(() => {
if (helperRef.current) {
helperRef.current.update();
console.log("CameraHelper updated", helperRef.current);
}
}, [camera]);

return null;
};

const Preview = () => {
const {
cameraSettings,
isFrustumView,
isControllerView,
setIsControllerView,
} = useContext(CameraContext);
const { lights } = useContext(LightContext);
const [currentModel, setCurrentModel] = useState(null);
const cameraRef = useRef();
const orbitControlsRef = useRef();

const modelPath = "/Tetrad-Ruben-Midi-Standard.fbx";

// Load the model
useEffect(() => {
const loadModel = async () => {
if (currentModel) {
currentModel.traverse((child) => {
if (child.isMesh) {
child.geometry.dispose();
if (child.material.isMaterial) {
child.material.dispose();
}
}
});
setCurrentModel(null);
}

      const loadedModel = await new Promise((resolve, reject) => {
        const loader = new FBXLoader();
        loader.load(modelPath, resolve, undefined, reject);
      });

      setCurrentModel(loadedModel);
      console.log("Model loaded:", loadedModel);
    };

    loadModel();

}, [modelPath]);

// Apply camera settings and lookAt target
useEffect(() => {
if (cameraRef.current) {
// Set the camera position and target
cameraRef.current.position.set(
cameraSettings.position.x,
cameraSettings.position.y,
cameraSettings.position.z
);
cameraRef.current.lookAt(
cameraSettings.target.x,
cameraSettings.target.y,
cameraSettings.target.z
);
cameraRef.current.fov = cameraSettings.fov;
cameraRef.current.near = cameraSettings.near;
cameraRef.current.far = cameraSettings.far;
cameraRef.current.updateProjectionMatrix();

      console.log("Camera updated with settings:", cameraSettings);

      // Update OrbitControls to use the new target and camera position
      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.set(
          cameraSettings.target.x,
          cameraSettings.target.y,
          cameraSettings.target.z
        );
        orbitControlsRef.current.update();
      }
    }

}, [cameraSettings, isControllerView]);

// Rendering lights
const renderLights = () => {
return lights.map((light) => {
switch (light.type.toUpperCase()) {
case "AMBIENT":
return (
<ambientLight
key={light.id}
intensity={light.intensity}
color={light.color || "#ffffff"}
/>
);
case "DIRECTIONAL":
return (
<directionalLight
key={light.id}
intensity={light.intensity}
position={[
light.position?.x || 0,
light.position?.y || 0,
light.position?.z || 0,
]}
castShadow={light.castShadow || false}
/>
);
case "SPOT":
return (
<spotLight
key={light.id}
intensity={light.intensity}
position={[
light.position?.x || 0,
light.position?.y || 0,
light.position?.z || 0,
]}
angle={light.angle || Math.PI / 6}
decay={light.decay || 1}
castShadow={light.castShadow || false}
/>
);
case "HEMISPHERE":
return (
<hemisphereLight
key={light.id}
intensity={light.intensity}
color={light.color || "#ffffff"}
groundColor={light.groundColor || "#aaaaaa"}
/>
);
default:
return null;
}
});
};

// Handle "View Controller" button click
const handleViewController = () => {
console.log("View Controller triggered with settings:", cameraSettings);
setIsControllerView(true);
};

return (
<>
<Canvas
shadows
camera={{ position: [0, 5, 10], fov: 50, near: 0.1, far: 100 }}
style={{ height: "100vh", backgroundColor: "#EFEFEF" }} >
<ambientLight intensity={0.5} />
<directionalLight position={[0, 10, 5]} castShadow />

        {/* Dynamically controlled PerspectiveCamera */}
        <perspectiveCamera ref={cameraRef} />

        {/* Render the camera frustum if the frustum view is enabled */}
        {isFrustumView && cameraRef.current && (
          <CameraHelperComponent camera={cameraRef.current} />
        )}

        {/* Render the loaded model */}
        {currentModel && <primitive object={currentModel} />}

        {renderLights()}

        <axesHelper args={[5]} />
        <gridHelper args={[20, 20]} />

        <OrbitControls
          ref={orbitControlsRef}
          enableRotate={cameraSettings.rotation}
          enableZoom={cameraSettings.zoomInOut}
          enablePan={cameraSettings.panning}
          minZoom={cameraSettings.minZoom}
          maxZoom={cameraSettings.maxZoom}
          minAzimuthAngle={cameraSettings.minAzim}
          maxAzimuthAngle={cameraSettings.maxAzim}
          minPolarAngle={cameraSettings.minPolar}
          maxPolarAngle={cameraSettings.maxPolar}
          dampingFactor={cameraSettings.dampingFactor}
          target={[
            cameraSettings.target.x,
            cameraSettings.target.y,
            cameraSettings.target.z,
          ]}
          enableDamping
        />
      </Canvas>

      {/* View Controller Button */}
      {/* <Box
        textAlign="center"
        sx={{ position: "absolute", bottom: 20, width: "100%" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewController}
        >
          View
        </Button>
      </Box> */}
    </>

);
};

export default Preview;
