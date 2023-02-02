import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { modifySeconds, modifyDistance } from "../utils/functions/rides-by-day";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";

const splitCoordinates = (coordinates: string) => {
  const splitCoordinates = coordinates.split(",");
  return splitCoordinates;
};

const Location = () => {
  const apikey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apikey || "",
  });

  const router = useRouter();

  // Getting the coordinates from the query string and storing them in variables
  const { start_station_location, end_station_location } = router.query;
  const startStationLocation = start_station_location?.toString();
  const endStationLocation = end_station_location?.toString();

  // Declare states for the coordinates
  const [startStationLatitude, setStartStationLatitude] = useState(0);
  const [startStationLongitude, setStartStationLongitude] = useState(0);
  const [endStationLatitude, setEndStationLatitude] = useState(0);
  const [endStationLongitude, setEndStationLongitude] = useState(0);

  // Declare states for the distance and duration
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [directions, setDirections] = useState(null);

  // Splitting the coordinates into latitude and longitude
  useEffect(() => {
    if (startStationLocation) {
      const [lat, lng] = splitCoordinates(startStationLocation);
      setStartStationLatitude(Number(lat));
      setStartStationLongitude(Number(lng));
    }
    if (endStationLocation) {
      const [lat, lng] = splitCoordinates(endStationLocation);
      setEndStationLatitude(Number(lat));
      setEndStationLongitude(Number(lng));
    }
  }, [startStationLocation, endStationLocation]);

  // Getting the directions from the Google Maps API
  useEffect(() => {
    if (isLoaded && startStationLocation && endStationLocation) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: new google.maps.LatLng(
            startStationLatitude,
            startStationLongitude
          ),
          destination: new google.maps.LatLng(
            endStationLatitude,
            endStationLongitude
          ),
          travelMode: google.maps.TravelMode.BICYCLING,
        },

        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            // TODO - Fix Typescript errors
            setDirections(result);
            setDistance(result.routes[0].legs[0].distance.value);
            setDuration(result.routes[0].legs[0].duration.value);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [isLoaded, startStationLocation, endStationLocation]);
  const center = {
    lat: (startStationLatitude + endStationLatitude) / 2,
    lng: (startStationLongitude + endStationLongitude) / 2,
  };

  return isLoaded ? (
    <div>
      <div className="grid grid-cols-2">
        <div className="flex justify-center">
          <div className="flex flex-col justify-center">
            <div>
              <button
                className=" w-full rounded-xl bg-blue-500 p-5 font-bold text-white hover:bg-blue-400"
                onClick={() => router.back()}
              >
                Back
              </button>
            </div>
            <h1 className="text-2xl font-bold">
              Distance {modifyDistance(distance)} km
            </h1>
            <h1 className="text-2xl font-bold">
              Expected travel time {modifySeconds(duration)}
            </h1>
          </div>
        </div>
        <div className="">
          <div className="flex justify-center ">
            <GoogleMap
              mapContainerClassName="min-h-2/4 h-[95vh] w-full space-x-2 mx-5 rounded-xl"
              center={center}
              zoom={14}
            >
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Location;
