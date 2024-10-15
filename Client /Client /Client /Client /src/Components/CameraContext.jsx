import React, { createContext, useState } from "react";

export const CameraContext = createContext();

export const CameraProvider = ({ children }) => {
  const [cameras, setCameras] = useState([]);
  const [activeCameraIndex, setActiveCameraIndex] = useState(0);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [cameraHelpers, setCameraHelpers] = useState([]); //1

  const maxCameras = 4;

  const renameCamera = (index, newName) => {
    setCameras((prevCameras) => {
      const updatedCameras = [...prevCameras];
      updatedCameras[index] = { ...updatedCameras[index], name: newName };
      return updatedCameras;
    });
  };

  const deleteCamera = (index) => {
    setCameras((prevCameras) => prevCameras.filter((_, i) => i !== index));
    if (activeCameraIndex === index && cameras.length > 1) {
      setActiveCamera(0);
    }
  }; //

  // const deleteCamera = (index, scene) => {
  //   console.log("Attempting to delete camera at index:", index);
  //   console.log("Scene object:", scene);
  //   console.log("Camera helpers:", cameraHelpers);

  //   setCameras((prevCameras) => {
  //     const updatedCameras = prevCameras.filter((_, i) => i !== index);

  //     // Safely remove the camera helper from the scene if it exists
  //     if (scene && cameraHelpers[index]) {
  //       console.log(
  //         "Removing camera helper from the scene:",
  //         cameraHelpers[index]
  //       );
  //       scene.remove(cameraHelpers[index]);
  //       cameraHelpers[index].dispose(); // Clean up resources
  //     } else {
  //       console.log("Camera helper or scene not found, skipping removal.");
  //     }

  //     // Update cameraHelpers state to reflect the changes
  //     setCameraHelpers((prevHelpers) =>
  //       prevHelpers.filter((_, i) => i !== index)
  //     );

  //     // Adjust the active camera index if needed
  //     if (updatedCameras.length === 0) {
  //       setActiveCameraIndex(-1);
  //     } else if (activeCameraIndex === index) {
  //       setActiveCameraIndex(0);
  //     } else if (activeCameraIndex > index) {
  //       setActiveCameraIndex((prevIndex) => prevIndex - 1);
  //     }

  //     // Return the updated cameras list
  //     return updatedCameras;
  //   });

  //   // Trigger a re-render to update the camera display
  //   setUpdateTrigger((prev) => !prev);
  // };

  const duplicateCamera = (index) => {
    const cameraToDuplicate = cameras[index];
    const newCamera = {
      ...cameraToDuplicate,
      name: `${cameraToDuplicate.name} (Copy)`,
    };

    if (cameras.length < maxCameras) {
      addCamera(newCamera);
    } else {
      alert("Camera limit reached! Cannot duplicate further.");
    }
  };

  // update the active camera settings
  const updateActiveCameraSettings = (newSettings) => {
    setCameras((prevCameras) => {
      const updatedCameras = [...prevCameras];
      updatedCameras[activeCameraIndex].settings = {
        ...updatedCameras[activeCameraIndex].settings,
        ...newSettings,
      };
      return updatedCameras;
    });
  };

  const addCamera = (newCamera) => {
    setCameras((prevCameras) => [...prevCameras, newCamera]);
    setActiveCameraIndex(cameras.length);
  };

  const setActiveCamera = (index) => {
    setActiveCameraIndex(index);
  };

  const handleViewCamera = () => {
    setUpdateTrigger((prev) => !prev); // Toggle the state to force re-render
  };

  const resetUpdateTrigger = () => {
    setUpdateTrigger(false);
  };

  const saveCameraSettings = () => {
    console.log("Camera settings saved.");
  };

  return (
    <CameraContext.Provider
      value={{
        cameras,
        activeCameraIndex,
        addCamera,
        setActiveCamera,
        handleViewCamera,
        saveCameraSettings,
        updateTrigger,
        resetUpdateTrigger,
        updateActiveCameraSettings,
        renameCamera,
        deleteCamera,
        duplicateCamera,
        setCameraHelpers,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};
//1 camera full working with context + menu
//v4 - with UI with figma
