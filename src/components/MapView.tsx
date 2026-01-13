"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Pin } from "@/types/pin";
import MapClickHandler from "./MapClickHandler";
import PinMarkers from "./PinMarkers";

interface MapViewProps {
  pins: Pin[];
  center: [number, number];
  onMapClick: (lat: number, lng: number) => void;
  onPinDrag: (id: string, lat: number, lng: number) => void;
  hoveredPinId: string | null;
}

export default function MapView({
  pins,
  center,
  onMapClick,
  onPinDrag,
  hoveredPinId,
}: MapViewProps) {
  useEffect(() => {
    import("leaflet/dist/leaflet.css");
  }, []);

  return (
    <div className="w-full h-full">
      <MapContainer
        key="map-container"
        center={center}
        zoom={11}
        className="h-full w-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={onMapClick} />
        <PinMarkers
          pins={pins}
          hoveredPinId={hoveredPinId}
          onPinDrag={onPinDrag}
        />
      </MapContainer>
    </div>
  );
}
