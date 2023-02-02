import React from "react";
import { useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const MapView: React.FC<MapViewProps> = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC4aBlcIlmq-EiMTVZ_IJlnnbNa6hZ5Ppc",
  });

  const [latitude] = useState(60.2064915569171);
  const [longitude] = useState(24.9770790121958);

  const center = {
    lat: latitude,
    lng: longitude,
  };
  //   const circleOptions = {
  //     strokeOpacity: 0.5,
  //     fillOpacity: 0.5,
  //     strokeColor: "#C7D7FF",
  //     fillColor: "#C7D7FF",
  //   };
  return isLoaded ? (
    <GoogleMap
      mapContainerClassName="w-[50%] h-[100VH]"
      center={center}
      zoom={18}
    >
      <Marker position={{ lat: latitude, lng: longitude }} />
      {/* <Circle center={center} radius={30} options={circleOptions} /> */}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
};

export default MapView;
