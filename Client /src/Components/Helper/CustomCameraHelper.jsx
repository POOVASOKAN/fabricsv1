/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const CustomCameraHelper = ({ cameraSettings }) => {
  const { scene } = useThree();
  const cameraHelperRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!cameraSettings) return;

    const {
      fov = 50,
      near = 0.1,
      far = 1000,
      position = { x: 0, y: 5, z: 10 },
      target = { x: 0, y: 0, z: 0 },
    } = cameraSettings;

    if (!cameraRef.current) {
      // Create a new perspective camera based on settings -
      cameraRef.current = new THREE.PerspectiveCamera(
        fov,
        window.innerWidth / window.innerHeight,
        near,
        far
      );
      cameraRef.current.position.set(position.x, position.y, position.z);
      cameraRef.current.lookAt(target.x, target.y, target.z);

      // Create CameraHelper and add to the scene
      cameraHelperRef.current = new THREE.CameraHelper(cameraRef.current);
      scene.add(cameraHelperRef.current);
    }

    // Update camera and helper when camera settings change
    cameraRef.current.position.set(position.x, position.y, position.z);
    cameraRef.current.lookAt(target.x, target.y, target.z);
    cameraRef.current.fov = fov;
    cameraRef.current.near = near;
    cameraRef.current.far = far;
    cameraRef.current.updateProjectionMatrix();

    // Update CameraHelper
    cameraHelperRef.current.update();
  }, [cameraSettings, scene]);

  return null;
};

export default CustomCameraHelper;
//1 camera full working with context + menu
