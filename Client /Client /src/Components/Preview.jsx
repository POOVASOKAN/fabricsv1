/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState, useContext, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import {
  MeshPhysicalMaterial,
  TextureLoader,
  SRGBColorSpace,
  LinearSRGBColorSpace,
  DoubleSide,
  Vector2,
  Color,
  RepeatWrapping,
} from "three";
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

      resetUpdateTrigger();
    }
  }, [cameras, activeCameraIndex, updateTrigger, camera, resetUpdateTrigger]);

  return null;
};

//model loading issue fix
const PreviewScene = ({ model, setCurrentModel }) => {
  const { scene } = useThree();

  useEffect(() => {
    if (model) {
      console.log("Adding new model to scene", model);
      scene.add(model);
      setCurrentModel(model);
      return () => {
        console.log("Removing previous model from scene", model);
        scene.remove(model);
        model.traverse((child) => {
          if (child.isMesh) {
            console.log("Disposing geometry and material of:", child.name);
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      };
    }
  }, [model, scene, setCurrentModel]);

  return null;
};

const Preview = ({ uploadedModelPath }) => {
  const { lights } = useContext(LightContext);
  const { connectedMaps, materialParams, updateTrigger1 } =
    useContext(MapContext);
  const { cameras, activeCameraIndex, cameraSettings } =
    useContext(CameraContext);
  const [currentModel, setCurrentModel] = useState(null);

  const [currentMaterials, setCurrentMaterials] = useState([]);

  const defaultModelPath = "/Tetrad-Ruben-Midi-Standard.fbx";

  const textureLoader = useRef(new TextureLoader()).current;

  // Load model
  useEffect(() => {
    const modelPath = uploadedModelPath || defaultModelPath;

    const loadModel = () => {
      console.log("Starting to load model from path:", modelPath);
      const loader = new FBXLoader();
      loader.load(
        modelPath,
        (loadedModel) => {
          console.log("Model loaded successfully:", loadedModel);
          // Clear previous model and materials -logic moved up
          // if (currentModel) {
          //   console.log("Clearing previous model");

          //   currentModel.traverse((child) => {
          //     if (child.isMesh) {
          //       console.log("Disposing geometry and material of:", child.name);
          //       child.geometry.dispose();
          //       if (child.material) {
          //         if (Array.isArray(child.material)) {
          //           child.material.forEach((material) => material.dispose());
          //         } else {
          //           child.material.dispose();
          //         }
          //       }
          //     }
          //   });
          // }

          loadedModel.traverse((child, index) => {
            if (child.isMesh) {
              const material = currentMaterials[index] || createMaterial();
              child.material = material;
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          console.log("Setting the new model as currentModel");
          setCurrentModel(loadedModel);
        },
        undefined,
        (error) => {
          console.error("Failed to load FBX model:", error);
        }
      );
    };

    loadModel();
  }, [uploadedModelPath]);

  useEffect(() => {
    if (currentModel) {
      const newMaterials = [];
      currentModel.traverse((child) => {
        if (child.isMesh && child.material) {
          updateMaterialProperties(child.material);
          updateTextures(child.material);
          newMaterials.push(child.material);
        }
      });
      setCurrentMaterials(newMaterials);
    }
  }, [currentModel, updateTrigger1, connectedMaps, materialParams]);

  // Create a new material based on materialParams
  const createMaterial = () => {
    return new MeshPhysicalMaterial({
      color: 0xffffff,
      side: DoubleSide,
      ...extractMaterialProperties(),
    });
  };

  // Extract material properties from materialParams for easy assignment -
  const extractMaterialProperties = () => {
    const sheenColor = new Color(
      materialParams.sheenColor?.r || 0,
      materialParams.sheenColor?.g || 0,
      materialParams.sheenColor?.b || 0
    );

    const emissiveColor = new Color(
      materialParams.emissiveColor?.r || 0,
      materialParams.emissiveColor?.g || 0,
      materialParams.emissiveColor?.b || 0
    );

    return {
      metalness: materialParams.metalness || 0,
      roughness: materialParams.roughness || 1,
      bumpScale: materialParams.bumpScale || 0,
      sheen: materialParams.sheenEnabled || false,
      sheenRoughness: materialParams.sheenRoughness || 1.0,
      sheenColor: sheenColor,
      displacementScale: materialParams.displacementScale || 0,
      displacementBias: materialParams.displacementBias || 0,
      aoMapIntensity: materialParams.aoMapIntensity || 1,
      emissive: emissiveColor,
      emissiveIntensity: materialParams.emissiveIntensity || 0,
      clearcoat: materialParams.clearcoat || 0,
      envMapIntensity: materialParams.envMapIntensity || 0,
      anisotropy: materialParams.anisotropy || 0,
    };
  };

  const updateMaterialProperties = (material) => {
    Object.assign(material, extractMaterialProperties());
    material.normalScale = new Vector2(
      materialParams.normalScaleX || 1,
      materialParams.normalScaleY || 1
    );
    material.side = DoubleSide;
    material.needsUpdate = true;
  };

  const updateTextures = (material) => {
    const currentMapTypes = Object.keys(connectedMaps);

    currentMapTypes.forEach((mapType) => {
      const file = connectedMaps[mapType];

      if (file instanceof Blob || file instanceof File) {
        textureLoader.load(
          URL.createObjectURL(file),
          (texture) => {
            texture.colorSpace = ["DIFFUSE", "EMISSIVE"].includes(
              mapType.toUpperCase()
            )
              ? SRGBColorSpace
              : LinearSRGBColorSpace;

            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;

            if (mapType.toUpperCase() === "DIFFUSE") {
              texture.repeat.set(
                materialParams.scaleX || 1,
                materialParams.scaleY || 1
              );
            }

            const maxAnisotropy =
              textureLoader.manager?.renderer?.capabilities?.getMaxAnisotropy() ||
              1;
            texture.anisotropy = Math.min(
              maxAnisotropy,
              materialParams.anisotropy || 1
            );

            texture.needsUpdate = true;

            assignTextureToMaterial(material, mapType, texture);
          },
          undefined,
          (error) => {
            console.error(`Failed to load texture for ${mapType}:`, error);
          }
        );
      } else {
        resetSpecificMap(material, mapType);
      }
    });

    const allMapTypes = [
      "DIFFUSE",
      "SHEEN",
      "CLEARCOAT",
      "BUMP",
      "NORMAL",
      "DISPLACEMENT",
      "EMISSIVE",
      "AO",
      "METALNESS",
      "ROUGHNESS",
      "ENVIRONMENT",
      "ANISOTROPY",
    ];
    allMapTypes.forEach((mapType) => {
      if (!currentMapTypes.includes(mapType)) {
        resetSpecificMap(material, mapType);
      }
    });
  };

  const resetSpecificMap = (material, mapType) => {
    switch (mapType.toUpperCase()) {
      case "DIFFUSE":
        material.map = null;
        break;
      case "SHEEN":
        material.sheenColorMap = null;
        break;
      case "CLEARCOAT":
        material.clearcoatMap = null;
        break;
      case "BUMP":
        material.bumpMap = null;
        break;
      case "NORMAL":
        material.normalMap = null;
        break;
      case "DISPLACEMENT":
        material.displacementMap = null;
        break;
      case "EMISSIVE":
        material.emissiveMap = null;
        break;
      case "AO":
        material.aoMap = null;
        break;
      case "METALNESS":
        material.metalnessMap = null;
        break;
      case "ROUGHNESS":
        material.roughnessMap = null;
        break;
      case "ENVIRONMENT":
        material.envMap = null;
        break;
      case "ANISOTROPY":
        material.anisotropyMap = null;
        break;
      default:
        console.warn(`Unknown map type: ${mapType}`);
        break;
    }
    material.needsUpdate = true;
  };

  const assignTextureToMaterial = (material, mapType, texture) => {
    switch (mapType.toUpperCase()) {
      case "DIFFUSE":
        material.map = texture;
        break;
      case "SHEEN":
        material.sheenColorMap = texture;
        break;
      case "CLEARCOAT":
        material.clearcoatMap = texture;
        break;
      case "BUMP":
        material.bumpMap = texture;
        break;
      case "NORMAL":
        material.normalMap = texture;
        break;
      case "DISPLACEMENT":
        material.displacementMap = texture;
        break;
      case "EMISSIVE":
        material.emissiveMap = texture;
        break;
      case "AO":
        material.aoMap = texture;
        break;
      case "METALNESS":
        material.metalnessMap = texture;
        break;
      case "ROUGHNESS":
        material.roughnessMap = texture;
        break;
      case "ENVIRONMENT":
        material.envMap = texture;
        break;
      case "ANISOTROPY":
        material.anisotropyMap = texture;
        break;
      default:
        console.warn(`Unknown map type: ${mapType}`);
        break;
    }
    material.needsUpdate = true;
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
        {lights.map((light) => {
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
                  bias={0.0001}
                />
              );
            default:
              return null;
          }
        })}

        {currentModel && (
          <PreviewScene
            model={currentModel}
            setCurrentModel={setCurrentModel}
          />
        )}

        {/* {currentModel && <primitive object={currentModel} />} */}

        <gridHelper args={[100, 100, "#ffffff", "#333"]} />

        <OrbitControls zoomSpeed={1.0} minDistance={1} maxDistance={1000} />

        {cameras.map((camera, index) => (
          <CustomCameraHelper key={index} cameraSettings={camera.settings} />
        ))}

        <CameraUpdater />
      </Canvas>
    </>
  );
};

export default Preview;
//v4 with Ui update figma -
//model upload fix
