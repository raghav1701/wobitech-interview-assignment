"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Pin } from "@/types/pin";
import { reverseGeocode } from "@/lib/geocoding";
import PinList from "@/components/PinList";

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full lg:w-2/3 h-1/2 lg:h-full bg-gray-200 flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  ),
});

export default function Home() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [center] = useState<[number, number]>([40.7128, -74.006]); // NYC default
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  useEffect(() => {
    // Import and initialize Leaflet icons only on client side
    import("@/lib/leaflet-config").then((module) => {
      module.initializeLeafletIcons();
    });
  }, []);

  const handleMapClick = async (lat: number, lng: number) => {
    const newPin: Pin = {
      id: Date.now().toString(),
      lat,
      lng,
      address: "Loading address...",
      isGeocoding: true,
    };

    setPins((prev) => [...prev, newPin]);

    const address = await reverseGeocode(lat, lng);
    setPins((prev) =>
      prev.map((pin) =>
        pin.id === newPin.id ? { ...pin, address, isGeocoding: false } : pin
      )
    );
  };

  const deletePin = (id: string) => {
    setPins((prev) => prev.filter((pin) => pin.id !== id));
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <MapView
        pins={pins}
        center={center}
        onMapClick={handleMapClick}
        hoveredPinId={hoveredPinId}
      />
      <PinList
        pins={pins}
        onDeletePin={deletePin}
        onPinHover={setHoveredPinId}
      />
    </div>
  );
}
