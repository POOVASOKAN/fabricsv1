/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState, useContext } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// eslint-disable-next-line no-unused-vars
import * as THREE from "three";
import { LightContext } from "./LightContext"; // Import the LightContext

const Preview = () => {
  const { lights } = useContext(LightContext);
  const [currentModel, setCurrentModel] = useState(null);
  const modelPath = "/Tetrad-Ruben-Midi-Standard.fbx"; // Your 3D model path

  useEffect(() => {
    const loadModel = async () => {
      if (currentModel) {
        // Dispose of the previous model before loading a new one
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

      setCurrentModel(loadedModel); // Set the newly loaded model
    };

    loadModel();
  }, [modelPath]);

  // Function to dynamically create light components based on the lights in the context
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

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 50 }}
        style={{ backgroundColor: "#EFEFEF" }}
      >
        {renderLights()}

        {currentModel && <primitive object={currentModel} />}

        <gridHelper args={[100, 100, "#ffffff", "#555555"]} />

        <OrbitControls />
      </Canvas>
    </>
  );
};

export default Preview;
//v3 - All UI updated
