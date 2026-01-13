"use client";

import { useEffect, useRef } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Pin } from "@/types/pin";

interface PinMarkersProps {
  pins: Pin[];
  hoveredPinId: string | null;
  selectedPinId: string | null;
  onPinDrag: (id: string, lat: number, lng: number) => void;
  onPinSelect: (pinId: string | null) => void;
}

export default function PinMarkers({
  pins,
  hoveredPinId,
  selectedPinId,
  onPinDrag,
  onPinSelect,
}: PinMarkersProps) {
  const map = useMap();
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const previousHoveredId = useRef<string | null>(null);

  // Create custom icons with opacity
  const createIcon = (isHighlighted: boolean, isFaded: boolean) => {
    return new L.Icon({
      iconUrl: isHighlighted ? "/pin-red.svg" : "/pin.svg",
      iconRetinaUrl: isHighlighted ? "/pin-red.svg" : "/pin.svg",
      shadowUrl: "",
      iconSize: isHighlighted ? [40, 40] : [32, 32],
      iconAnchor: isHighlighted ? [20, 40] : [16, 32],
      popupAnchor: [0, isHighlighted ? -40 : -32],
      className: isFaded ? "faded-marker" : "",
    });
  };

  // Pan to hovered pin and manage popups (desktop)
  useEffect(() => {
    // Close previous popup if there was one
    if (
      previousHoveredId.current &&
      previousHoveredId.current !== hoveredPinId
    ) {
      const previousMarker = markersRef.current[previousHoveredId.current];
      if (previousMarker) {
        previousMarker.closePopup();
      }
    }

    if (hoveredPinId) {
      const hoveredPin = pins.find((pin) => pin.id === hoveredPinId);
      if (hoveredPin) {
        map.flyTo([hoveredPin.lat, hoveredPin.lng], map.getZoom(), {
          duration: 0.5,
        });

        // Open the popup for hovered pin
        const marker = markersRef.current[hoveredPinId];
        if (marker) {
          marker.openPopup();
        }
      }
      previousHoveredId.current = hoveredPinId;
    } else {
      // Close all popups when nothing is hovered
      Object.values(markersRef.current).forEach((marker) => {
        if (marker) {
          marker.closePopup();
        }
      });
      previousHoveredId.current = null;
    }
  }, [hoveredPinId, pins, map]);

  // Manage selected pin popup (mobile)
  useEffect(() => {
    if (selectedPinId) {
      const marker = markersRef.current[selectedPinId];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedPinId]);

  // Convert coordinates to degrees, minutes, seconds format
  const formatCoordinate = (value: number, isLatitude: boolean) => {
    const absolute = Math.abs(value);
    const degrees = Math.floor(absolute);
    const minutesDecimal = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = ((minutesDecimal - minutes) * 60).toFixed(1);

    const direction = isLatitude
      ? value >= 0
        ? "N"
        : "S"
      : value >= 0
      ? "E"
      : "W";

    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  return (
    <>
      {pins.map((pin, index) => {
        const handleDragEnd = (e: L.DragEndEvent) => {
          const marker = e.target as L.Marker;
          const position = marker.getLatLng();
          onPinDrag(pin.id, position.lat, position.lng);
        };

        const handleClick = () => {
          // Toggle selection on mobile
          if (selectedPinId === pin.id) {
            onPinSelect(null);
          } else {
            onPinSelect(pin.id);
          }
        };

        const formattedLat = formatCoordinate(pin.lat, true);
        const formattedLng = formatCoordinate(pin.lng, false);

        const isHighlighted =
          hoveredPinId === pin.id || selectedPinId === pin.id;
        const isFaded = selectedPinId !== null && selectedPinId !== pin.id;

        return (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={createIcon(isHighlighted, isFaded)}
            draggable={true}
            autoPan={true}
            opacity={isFaded ? 0.3 : 1}
            ref={(ref) => {
              if (ref) {
                markersRef.current[pin.id] = ref as unknown as L.Marker;
              }
            }}
            eventHandlers={{
              dragend: handleDragEnd,
              click: handleClick,
            }}
          >
            <Popup
              className="custom-popup-compact"
              minWidth={180}
              closeButton={false}
            >
              <div className="py-1 px-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                  Pin #{index + 1}
                </h3>

                <div className="flex items-start gap-1.5 text-xs text-gray-500">
                  <svg
                    className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="font-normal leading-tight">
                    {formattedLat} {formattedLng}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
