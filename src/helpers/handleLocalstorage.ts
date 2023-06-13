import { resolutionDataType } from "../types";

export const saveToLocalStorage = (newResolution: resolutionDataType) => {
  let currentData: resolutionDataType[] = [];
  const rawData = localStorage.getItem("resolutionData");

  if (rawData !== null) {
    currentData = JSON.parse(rawData);
  }

  // Check if this named resolution already exists
  const doesExist = currentData.some(
    (resolution) => resolution.resolutionName === newResolution.resolutionName
  );

  let updateData: resolutionDataType[];

  if (doesExist) {
    updateData = currentData.map((resolution) => {
      if (resolution.resolutionName === newResolution.resolutionName) {
        return newResolution;
      } else {
        return resolution;
      }
    });
  } else {
    updateData = [...currentData, newResolution];
  }

  localStorage.setItem("resolutionData", JSON.stringify(updateData));
};

export const loadFromLocalStorage = () => {
  const rawData = localStorage.getItem("resolutionData");

  if (rawData !== null) {
    return JSON.parse(rawData);
  } else {
    return [];
  }
};

export const deleteFromLocalStorage = (resolutionName: string) => {
  // Load the Local Storage Data
  let currentData: resolutionDataType[];
  const rawData = localStorage.getItem("resolutionData");

  if (rawData !== null) {
    currentData = JSON.parse(rawData);
    const newData = currentData.filter(
      (entry: resolutionDataType) => entry.resolutionName !== resolutionName
    );

    if (newData.length === 0) {
      localStorage.removeItem("resolutionData");
    } else {
      localStorage.setItem("resolutionData", JSON.stringify(newData));
    }
  }
};
