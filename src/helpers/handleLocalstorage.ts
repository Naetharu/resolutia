interface resolutionData {
  resolutionName: string;
  resolutionDifficulty: number;
  resolutionDuration: number;
}

export const saveToLocalStorage = (newResolution: resolutionData) => {
  let currentData: resolutionData[] = [];
  const rawData = localStorage.getItem("resolutionData");

  if (rawData !== null) {
    currentData = JSON.parse(rawData);
  }

  // Check if this named resolution already exists
  const doesExist = currentData.some(
    (resolution) => resolution.resolutionName === newResolution.resolutionName
  );

  let updateData: resolutionData[];

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
