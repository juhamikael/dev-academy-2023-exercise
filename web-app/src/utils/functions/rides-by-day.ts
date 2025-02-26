import type { IRide } from "../types/RidesByDay";

const coordinatesWithoutSpaces = (cordinates: string) => {
  return cordinates.replace(/\s/g, "");
};

const getStartTimeFromDate = (date: Date | string | undefined) => {
  // And format it to hh:mm:ss
  if (!date) {
    return "00:00:00";
  }
  const startTime = new Date(date);
  startTime.setHours(startTime.getHours() - 3);
  const hours = startTime.getHours();
  const minutes = startTime.getMinutes();
  const seconds = startTime.getSeconds();
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const modifyDistance = (distance: number) => {
  const distanceInKm = distance / 1000;
  const formattedDistance = distanceInKm.toFixed(2);
  return formattedDistance.toString();
};

const modifySeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const secondsLeft = seconds % 60;
  const minutesLeft = minutes % 60;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutesLeft
    .toString()
    .padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;
  return formattedTime.toString();
};

const modifyTime = (time: Date | string | undefined) => {
  if (!time) {
    return "00:00:00";
  }
  const newTime = new Date(time);
  newTime.setHours(newTime.getHours() - 3);
  const hours = newTime.getHours();
  const minutes = newTime.getMinutes();
  const seconds = newTime.getSeconds();
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return formattedTime.toString();
};

const replaceNordics = (text: string) => {
  return text.replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o");
};

const splitDataIntoLists = (data: IRide[]) => {
  const dataLength = data.length;

  // Splitting the data into lists of 20
  const completeDataList: IRide[][] = [];
  let tempList: IRide[] = [];
  for (let i = 0; i < dataLength; i++) {
    if (i % 20 === 0 && i !== 0) {
      completeDataList.push(tempList);
      tempList = [];
    }
    const item = data[i];
    if (item) {
      tempList.push(item);
    }
  }
  completeDataList.push(tempList);
  return completeDataList;
};

export {
  coordinatesWithoutSpaces,
  getStartTimeFromDate,
  modifyDistance,
  modifySeconds,
  modifyTime,
  replaceNordics,
  splitDataIntoLists,
};
