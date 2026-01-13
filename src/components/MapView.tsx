"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import { Pin } from "@/types/pin";
import MapClickHandler from "./MapClickHandler";
import PinMarkers from "./PinMarkers";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  pins: Pin[];
  center: [number, number];
  onMapClick: (lat: number, lng: number) => void;
  onPinDrag: (id: string, lat: number, lng: number) => void;
  hoveredPinId: string | null;
  selectedPinId: string | null;
  onPinSelect: (pinId: string | null) => void;
}

export default function MapView({
  pins,
  center,
  onMapClick,
  onPinDrag,
  hoveredPinId,
  selectedPinId,
  onPinSelect,
}: MapViewProps) {
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
          selectedPinId={selectedPinId}
          onPinDrag={onPinDrag}
          onPinSelect={onPinSelect}
        />
      </MapContainer>
    </div>
  );
}
