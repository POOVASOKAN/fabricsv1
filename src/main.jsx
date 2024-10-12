import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CameraProvider } from "./Components/CameraContext.jsx";
import { LightProvider } from "./Components/LightContext.jsx";
import { MapProvider } from "./Components/MapContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MapProvider>
      <LightProvider>
        <CameraProvider>
          <App />
        </CameraProvider>
      </LightProvider>
    </MapProvider>
  </StrictMode>
);
//v4 with figma style
