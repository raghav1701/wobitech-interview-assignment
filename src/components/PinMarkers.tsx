"use client";

import { useEffect, useRef, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Pin } from "@/types/pin";

interface PinMarkersProps {
  pins: Pin[];
  hoveredPinId: string | null;
  onPinDrag: (id: string, lat: number, lng: number) => void;
}

export default function PinMarkers({
  pins,
  hoveredPinId,
  onPinDrag,
}: PinMarkersProps) {
  const map = useMap();
  const [isDragging, setIsDragging] = useState(false);

  // Create highlighted icon
  const highlightedIcon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [35, 57],
    iconAnchor: [17, 57],
    popupAnchor: [1, -34],
    shadowSize: [57, 57],
    className: "highlighted-marker",
  });

  const normalIcon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Pan to hovered pin with smooth animation
  useEffect(() => {
    if (hoveredPinId && !isDragging) {
      const hoveredPin = pins.find((pin) => pin.id === hoveredPinId);
      if (hoveredPin) {
        map.flyTo([hoveredPin.lat, hoveredPin.lng], map.getZoom(), {
          duration: 0.5,
          easeLinearity: 0.25,
        });
      }
    }
  }, [hoveredPinId, pins, map, isDragging]);

  return (
    <>
      {pins.map((pin) => {
        const handleDragStart = () => {
          setIsDragging(true);
        };

        const handleDragEnd = (e: L.DragEndEvent) => {
          const marker = e.target as L.Marker;
          const position = marker.getLatLng();
          onPinDrag(pin.id, position.lat, position.lng);
          setTimeout(() => setIsDragging(false), 300);
        };

        return (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={hoveredPinId === pin.id ? highlightedIcon : normalIcon}
            draggable={true}
            autoPan={true}
            eventHandlers={{
              dragstart: handleDragStart,
              dragend: handleDragEnd,
            }}
          >
            <Popup className="animate-scale-in">
              <div className="text-sm">
                <p className="font-semibold mb-1">Pin Location</p>
                <p className="text-gray-600">{pin.address}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                </p>
                <p className="text-xs text-blue-500 mt-2 flex items-center gap-1">
                  <span>✨</span>
                  Drag to reposition
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
