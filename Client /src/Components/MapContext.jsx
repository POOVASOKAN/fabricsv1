/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { createContext, useState } from "react";

export const MapContext = createContext();

const MapProvider = ({ children, initialMaterialParams = {} }) => {
  const [connectedMaps, setConnectedMaps] = useState({});

  const [materialParams, setMaterialParams] = useState({
    bumpScale: initialMaterialParams.bumpScale || 0.0,
    sheen: initialMaterialParams.sheen || 0.0,
    displacementScale: initialMaterialParams.displacementScale || 0.0,
    emissiveIntensity: initialMaterialParams.emissiveIntensity || 0.0,
    metalness: initialMaterialParams.metalness || 0.0,
    roughness: initialMaterialParams.roughness || 1.0,
    displacementBias: initialMaterialParams.displacementBias || 0.0,
    flatShading: initialMaterialParams.flatShading || false,
    aoMapIntensity: initialMaterialParams.aoMapIntensity || 0.0,
    clearcoat: initialMaterialParams.clearcoat || 0.0,
    normalScale: {
      x: initialMaterialParams.normalScaleX || 1.0,
      y: initialMaterialParams.normalScaleY || 1.0,
    },
  });

  const updateConnectedMaps = (mapType, file) => {
    setConnectedMaps((prev) => ({
      ...prev,
      [mapType]: file,
    }));
  };

  return (
    <MapContext.Provider
      value={{
        connectedMaps,
        updateConnectedMaps,
        materialParams,
        setMaterialParams,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
