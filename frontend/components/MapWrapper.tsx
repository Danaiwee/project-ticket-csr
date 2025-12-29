"use client"; // ต้องมีบรรทัดนี้

import dynamic from "next/dynamic";

// ย้ายการทำ dynamic import มาไว้ที่นี่
const LocationMap = dynamic(() => import("./LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-100 w-full bg-gray-100 animate-pulse rounded-2xl" />
  ),
});

interface MapWrapperProps {
  lat: number;
  lng: number;
  name: string;
}

const MapWrapper = ({ lat, lng, name }: MapWrapperProps) => {
  return <LocationMap lat={lat} lng={lng} name={name} />;
};

export default MapWrapper;
