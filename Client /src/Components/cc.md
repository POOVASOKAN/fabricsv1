import React, { createContext, useState } from "react";

export const CameraContext = createContext();

export const CameraProvider = ({ children }) => {
const [cameraSettings, setCameraSettings] = useState({
position: { x: 0, y: 5, z: 10 }, // Initial camera position
target: { x: 0, y: 0, z: 0 }, // Initial target position (new)
fov: 50, // Initial field of view
near: 0.1, // Initial near plane
far: 1000, // Initial far plane
// Orbit control settings
rotation: true,
zoomInOut: true,
panning: true,
minZoom: 1,
maxZoom: 10,
lockUpperHemisphere: false,
minAzim: -Infinity,
maxAzim: Infinity,
minPolar: 0,
maxPolar: Math.PI,
dampingFactor: 0.25,
});

const [isFrustumView, setIsFrustumView] = useState(false);
const [isControllerView, setIsControllerView] = useState(false);

return (
<CameraContext.Provider
value={{
        cameraSettings,
        setCameraSettings,
        isFrustumView,
        setIsFrustumView,
        isControllerView,
        setIsControllerView,
      }} >
{children}
</CameraContext.Provider>
);
};
