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
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  ),
});

const STORAGE_KEY = "map-pinboard-pins";

export default function Home() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [center] = useState<[number, number]>([-37.8136, 144.9631]); // Melbourne, Australia
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load pins from localStorage on mount
  useEffect(() => {
    try {
      const savedPins = localStorage.getItem(STORAGE_KEY);
      if (savedPins) {
        const parsedPins = JSON.parse(savedPins);
        setPins(parsedPins);
      }
    } catch (error) {
      console.error("Error loading pins from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save pins to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
      } catch (error) {
        console.error("Error saving pins to localStorage:", error);
      }
    }
  }, [pins, isLoaded]);

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

  const handlePinDrag = async (id: string, lat: number, lng: number) => {
    // Update pin position immediately
    setPins((prev) =>
      prev.map((pin) =>
        pin.id === id
          ? {
              ...pin,
              lat,
              lng,
              address: "Updating address...",
              isGeocoding: true,
            }
          : pin
      )
    );

    // Fetch new address
    const address = await reverseGeocode(lat, lng);
    setPins((prev) =>
      prev.map((pin) =>
        pin.id === id ? { ...pin, address, isGeocoding: false } : pin
      )
    );
  };

  const deletePin = (id: string) => {
    setPins((prev) => prev.filter((pin) => pin.id !== id));
  };

  const clearAllPins = () => {
    if (window.confirm("Are you sure you want to clear all pins?")) {
      setPins([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Header - Centered */}
      <header className="absolute top-0 left-0 right-0 z-[1000] bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-center gap-3">
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <h1 className="text-xl font-semibold text-gray-900">Map Pinboard</h1>
        </div>
      </header>

      {/* Map - Full screen */}
      <div className="w-full h-full pt-[73px]">
        <MapView
          pins={pins}
          center={center}
          onMapClick={handleMapClick}
          onPinDrag={handlePinDrag}
          hoveredPinId={hoveredPinId}
        />
      </div>

      {/* Sidebar - Floating on left */}
      <div className="absolute left-6 top-[97px] bottom-6 w-96 z-[1000]">
        <PinList
          pins={pins}
          onDeletePin={deletePin}
          onPinHover={setHoveredPinId}
          onClearAll={clearAllPins}
        />
      </div>
    </div>
  );
}
