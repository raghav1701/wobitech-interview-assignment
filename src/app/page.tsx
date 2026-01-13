"use client";

import { useState, useEffect, useRef } from "react";
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
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const startY = useRef(0);
  const startHeight = useRef(50);

  // Check if mounted (client-side)
  useEffect(() => {
    setIsMounted(true);

    const checkOrientation = () => {
      if (typeof window !== "undefined") {
        setIsPortrait(
          window.matchMedia("(orientation: portrait)").matches &&
            window.innerWidth < 1024
        );
      }
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

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
    // Deselect any selected pin when clicking map
    setSelectedPinId(null);

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

    const address = await reverseGeocode(lat, lng);
    setPins((prev) =>
      prev.map((pin) =>
        pin.id === id ? { ...pin, address, isGeocoding: false } : pin
      )
    );
  };

  const deletePin = (id: string) => {
    setPins((prev) => prev.filter((pin) => pin.id !== id));
    if (selectedPinId === id) {
      setSelectedPinId(null);
    }
  };

  const clearAllPins = () => {
    if (window.confirm("Are you sure you want to clear all pins?")) {
      setPins([]);
      setSelectedPinId(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handlePinSelect = (pinId: string | null) => {
    setSelectedPinId(pinId);
  };

  // Touch/drag handlers for bottom sheet
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startY.current = clientY;
    startHeight.current = sheetHeight;
  };

  const handleDragMove = (e: TouchEvent | MouseEvent) => {
    if (!isDragging) return;

    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const deltaY = startY.current - clientY;
    const windowHeight = window.innerHeight;
    const deltaPercent = (deltaY / windowHeight) * 100;

    let newHeight = startHeight.current + deltaPercent;
    newHeight = Math.max(20, Math.min(95, newHeight)); // Min 20%, Max 95%

    setSheetHeight(newHeight);
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    // Snap to positions
    if (sheetHeight < 35) {
      setSheetHeight(20); // Minimized
    } else if (sheetHeight < 65) {
      setSheetHeight(50); // Half
    } else {
      setSheetHeight(90); // Full
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove);
      window.addEventListener("touchend", handleDragEnd);

      return () => {
        window.removeEventListener("mousemove", handleDragMove);
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchmove", handleDragMove);
        window.removeEventListener("touchend", handleDragEnd);
      };
    }
  }, [isDragging, sheetHeight]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-[1001] bg-white border-b border-gray-200">
        <div className="px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-center">
          <div className="flex items-center gap-2 lg:gap-3">
            <svg
              className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700"
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
            <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
              Map Pinboard
            </h1>
          </div>
        </div>
      </header>

      {/* Map - Full screen */}
      <div className="w-full h-full pt-[57px] lg:pt-[73px]">
        <MapView
          pins={pins}
          center={center}
          onMapClick={handleMapClick}
          onPinDrag={handlePinDrag}
          hoveredPinId={hoveredPinId}
          selectedPinId={selectedPinId}
          onPinSelect={handlePinSelect}
        />
      </div>

      {/* Sidebar/Bottom Sheet - Responsive */}
      <div
        className="
          fixed z-[1000] bg-white shadow-2xl
          
          /* Mobile Portrait - Bottom sheet with drag */
          portrait:bottom-0 portrait:left-0 portrait:right-0 
          portrait:rounded-t-3xl
          
          /* Landscape - Left floating sidebar */
          landscape:top-[97px] landscape:bottom-6 landscape:left-6 
          landscape:w-80 landscape:rounded-2xl
          
          /* Desktop - Left floating sidebar */
          lg:top-[97px] lg:bottom-6 lg:left-6 lg:w-96 lg:rounded-2xl
          
          transition-all duration-200 ease-out
        "
        style={{
          height: isPortrait ? `${sheetHeight}vh` : "auto",
        }}
      >
        {/* Drag handle - Portrait only */}
        <div
          className="portrait:flex landscape:hidden lg:hidden justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        <PinList
          pins={pins}
          onDeletePin={deletePin}
          onPinHover={setHoveredPinId}
          onClearAll={clearAllPins}
          isDraggable={true}
        />
      </div>
    </div>
  );
}
