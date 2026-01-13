"use client";

import { useEffect, useRef } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Pin } from "@/types/pin";

interface PinMarkersProps {
  pins: Pin[];
  hoveredPinId: string | null;
}

export default function PinMarkers({ pins, hoveredPinId }: PinMarkersProps) {
  const map = useMap();
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Create highlighted icon
  const highlightedIcon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [35, 57], // Larger size
    iconAnchor: [17, 57],
    popupAnchor: [1, -34],
    shadowSize: [57, 57],
    className: "hovered-marker",
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

  // Pan to hovered pin
  useEffect(() => {
    if (hoveredPinId) {
      const hoveredPin = pins.find((pin) => pin.id === hoveredPinId);
      if (hoveredPin) {
        map.flyTo([hoveredPin.lat, hoveredPin.lng], map.getZoom(), {
          duration: 0.5,
        });
      }
    }
  }, [hoveredPinId, pins, map]);

  return (
    <>
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.lat, pin.lng]}
          icon={hoveredPinId === pin.id ? highlightedIcon : normalIcon}
          ref={(ref) => {
            if (ref) {
              markersRef.current[pin.id] = ref as unknown as L.Marker;
            }
          }}
          eventHandlers={{
            add: (e) => {
              if (hoveredPinId === pin.id) {
                const marker = e.target as L.Marker;
                marker.openPopup();
              }
            },
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold mb-1">Pin Location</p>
              <p className="text-gray-600">{pin.address}</p>
              <p className="text-xs text-gray-500 mt-1">
                {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
