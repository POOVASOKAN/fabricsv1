import React, { useEffect, useState, useContext } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";
import { LightContext } from "./LightContext";
import { MapContext } from "./MapContext";
import { CameraContext } from "../Components/CameraContext";
import CustomCameraHelper from "../Components/Helper/CustomCameraHelper";

const CameraUpdater = () => {
  const { camera } = useThree();
  const { cameras, activeCameraIndex, updateTrigger, resetUpdateTrigger } =
    useContext(CameraContext);

  useEffect(() => {
    if (updateTrigger && cameras.length > 0) {
      const activeCameraSettings = cameras[activeCameraIndex].settings;

      console.log(
        "Updating active camera with new settings:",
        activeCameraSettings
      );

      camera.position.set(
        activeCameraSettings.position.x,
        activeCameraSettings.position.y,
        activeCameraSettings.position.z
      );
      camera.lookAt(
        activeCameraSettings.target.x,
        activeCameraSettings.target.y,
        activeCameraSettings.target.z
      );
      camera.near = activeCameraSettings.near;
      camera.far = activeCameraSettings.far;
      camera.fov = activeCameraSettings.fov;
      camera.updateProjectionMatrix();

      resetUpdateTrigger(); // Reset the trigger once the update is done
    }
  }, [cameras, activeCameraIndex, updateTrigger, camera, resetUpdateTrigger]);

  return null;
};

const Preview = () => {
  const { lights } = useContext(LightContext);
  const { connectedMaps, materialParams } = useContext(MapContext);
  const { cameras, activeCameraIndex, cameraSettings, orbitSettings } =
    useContext(CameraContext);
  const [currentModel, setCurrentModel] = useState(null);
  const modelPath = "/Tetrad-Ruben-Midi-Standard.fbx";

  // Load model
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
    };

    loadModel();
  }, [modelPath]);

  useEffect(() => {
    const applyMaterial = () => {
      if (currentModel && Object.keys(connectedMaps).length > 0) {
        const loader = new THREE.TextureLoader();

        currentModel.traverse((child) => {
          if (child.isMesh) {
            const materialConfig = {
              bumpScale: materialParams.bumpScale,
              normalScale: new THREE.Vector2(
                materialParams.normalX,
                materialParams.normalY
              ),
              displacementScale: materialParams.displacementScale,
              displacementBias: materialParams.displacementBias,
              metalness: materialParams.metalness,
              roughness: materialParams.roughness,
              emissiveIntensity: materialParams.emissive,
              envMapIntensity: materialParams.envIntensity,
              specularIntensity: materialParams.specular,
              opacity: materialParams.opacity,
              aoMapIntensity: materialParams.ao,
              sheenIntensity: materialParams.sheenIntensity,
              sheenRoughness: materialParams.sheenRoughness,
              side: THREE.DoubleSide,
            };

            Object.entries(connectedMaps).forEach(([mapType, file]) => {
              if (file) {
                loader.load(URL.createObjectURL(file), (texture) => {
                  texture.encoding = THREE.sRGBEncoding;
                  texture.wrapS = THREE.RepeatWrapping;
                  texture.wrapT = THREE.RepeatWrapping;
                  texture.needsUpdate = true;

                  switch (mapType.toUpperCase()) {
                    case "DIFFUSE":
                      materialConfig.map = texture;
                      break;
                    case "BUMP":
                      materialConfig.bumpMap = texture;
                      break;
                    case "NORMAL":
                      materialConfig.normalMap = texture;
                      break;
                    case "DISPLACEMENT":
                      materialConfig.displacementMap = texture;
                      break;
                    case "EMISSIVE":
                      materialConfig.emissiveMap = texture;
                      break;
                    case "AO":
                      materialConfig.aoMap = texture;
                      break;
                    case "METALNESS":
                      materialConfig.metalnessMap = texture;
                      break;
                    case "ROUGHNESS":
                      materialConfig.roughnessMap = texture;
                      break;
                    default:
                      break;
                  }

                  child.material = new THREE.MeshPhysicalMaterial(
                    materialConfig
                  );
                  child.material.needsUpdate = true;
                });
              }
            });

            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }
    };

    applyMaterial();
  }, [currentModel, connectedMaps, materialParams]);

  // Light Context
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
        camera={{
          position: [
            cameras[activeCameraIndex]?.settings?.position.x || 0,
            cameras[activeCameraIndex]?.settings?.position.y || 5,
            cameras[activeCameraIndex]?.settings?.position.z || 10,
          ],
          fov: cameras[activeCameraIndex]?.settings?.fov || 50,
          near: cameras[activeCameraIndex]?.settings?.near || 0.1,
          far: cameras[activeCameraIndex]?.settings?.far || 1000,
        }}
        style={{ backgroundColor: "#FFFF" }}
      >
        {renderLights()}

        {currentModel && <primitive object={currentModel} />}

        <gridHelper args={[100, 100, "#ffffff", "#333"]} />

        <OrbitControls
          zoomSpeed={1.0}
          minDistance={1}
          maxDistance={1000} //
          // target={[
          //   cameraSettings.target.x,
          //   cameraSettings.target.y,
          //   cameraSettings.target.z,
          // ]}
          // enableDamping={orbitSettings.dampFactor > 0}
          // dampingFactor={orbitSettings.dampFactor}
          // enableRotate={orbitSettings.rotation}
          // enableZoom={orbitSettings.zoomInOut}
          // enablePan={orbitSettings.panning}
          // minAzimuthAngle={THREE.MathUtils.degToRad(orbitSettings.minAzim)}
          // maxAzimuthAngle={THREE.MathUtils.degToRad(orbitSettings.maxAzim)}
          // minPolarAngle={THREE.MathUtils.degToRad(orbitSettings.minPolar)}
          // maxPolarAngle={THREE.MathUtils.degToRad(orbitSettings.maxPolar)}
          // minDistance={orbitSettings.minZoom}
          // maxDistance={orbitSettings.maxZoom}
        />

        {/* Render helpers for each camera */}
        {cameras.map((camera, index) => (
          <CustomCameraHelper key={index} cameraSettings={camera.settings} />
        ))}
        <CameraUpdater />
      </Canvas>
    </>
  );
};

export default Preview;
//1 camera full working with context + menu
