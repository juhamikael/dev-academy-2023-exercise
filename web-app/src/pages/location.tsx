//TODO - Fix Typescript errors
// Parsing error : Cannot read file ....'\tsconfig.json'
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { modifySeconds, modifyDistance } from "../utils/functions/rides-by-day";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";

const splitCoordinates = (coordinates: string) => {
  return coordinates.split(",");
};
const replaceHyphenFromDate = (date: string) => {
  return date.replace(/-/g, "/");
};

const Location = () => {
  const apikey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apikey || "",
  });

  const router = useRouter();

  // Getting the multiple values from the query string and storing them in variables
  const {
    start_station_location,
    end_station_location,
    distance_m,
    date,
    start_station_name,
    duration_s,
    end_station_name,
    id,
  } = router.query;

  const startStationLocation = start_station_location?.toString();
  const endStationLocation = end_station_location?.toString();
  const dateFromQuery = date?.toString();
  const durationFromQuery = duration_s?.toString() ?? "";
  const distanceFromQuery = distance_m?.toString() ?? "";
  const startStationNameFromQuery = start_station_name?.toString();
  const endStationNameFromQuery = end_station_name?.toString();
  const idFromQuery = id?.toString();

  const parsedDuration = parseInt(durationFromQuery);

  const startTimeFromQuery = router.query.start_time?.toString();

  // Declare states for the coordinates
  const [startStationLatitude, setStartStationLatitude] = useState(0);
  const [startStationLongitude, setStartStationLongitude] = useState(0);
  const [endStationLatitude, setEndStationLatitude] = useState(0);
  const [endStationLongitude, setEndStationLongitude] = useState(0);

  // Declare states for the distance and duration
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);


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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setDirections(result);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setDistance(result.routes[0].legs[0].distance.value);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
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
          <div className="flex flex-col justify-center space-y-4">
            <div className="border-grey-200/20 mt-5 flex flex-col rounded-xl border-2 p-4 text-xl font-bold ">
              <h1 className="text-3xl font-bold">Recommended route for: </h1>
              <div className="text-xl font-bold">
                {startStationNameFromQuery} - {endStationNameFromQuery}
              </div>

              <h1 className="mt-5 text-2xl font-bold">
                Distance {modifyDistance(distance)} km
              </h1>
              <h1 className="text-2xl font-bold">
                Expected travel time: {modifySeconds(duration)}
              </h1>
            </div>
            <div className="border-grey-200/20 mt-5 flex flex-col rounded-xl border-2 p-4 text-xl font-bold text-green-600">
              <div>
                <span className="text-black">Ride ID </span>#{idFromQuery}
              </div>
              <div>
                <span className="text-black">Start time </span>
                {replaceHyphenFromDate(dateFromQuery || "")} -{" "}
                {startTimeFromQuery}
              </div>
              <div>
                <span className="text-black">Distance </span>
                {modifyDistance(parseInt(distanceFromQuery))} km{" "}
              </div>
              <div>
                <span className="text-black">Duration </span>
                {modifySeconds(parsedDuration)}
              </div>
              {(parseInt(distanceFromQuery) < 120 &&
                parseInt(durationFromQuery) > 480) ||
              distance < 50 ? (
                <div className="mt-5 text-red-400">Probably a broken bike</div>
              ) : null}
            </div>
            <div>
              <button
                className=" w-full rounded-xl bg-blue-500 p-5 font-bold text-white hover:bg-blue-400"
                onClick={() => {
                  router.push(
                    // TODO: 1. When going back from location view, return to correct page.
                    `/rides-by-day?date=${dateFromQuery}`
                  );
                }}
              >
                Back
              </button>
            </div>
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
