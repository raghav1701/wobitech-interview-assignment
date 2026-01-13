"use client";

import { useEffect, useState } from "react";
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Import Leaflet CSS only on client side
    import("leaflet/dist/leaflet.css");

    // Trigger fade-in animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div
      className={`w-full lg:w-2/3 h-1/2 lg:h-full relative transition-opacity duration-500
      ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <MapContainer
        key="map-container"
        center={center}
        zoom={13}
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

      <div
        className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-[1000]
        transition-all duration-300 hover:shadow-xl hover:scale-105 animate-scale-in"
      >
        <h2 className="font-bold text-lg mb-2 transition-colors duration-200">
          Map Pinboard
        </h2>
        <p className="text-sm text-gray-600 transition-all duration-200">
          Click anywhere on the map to drop a pin
        </p>
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 transition-all duration-200">
          <span className="animate-pulse">💡</span>
          Drag pins to reposition them
        </p>
      </div>
    </div>
  );
}
