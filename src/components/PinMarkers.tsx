"use client";

import { Marker, Popup } from "react-leaflet";
import { Pin } from "@/types/pin";

interface PinMarkersProps {
  pins: Pin[];
}

export default function PinMarkers({ pins }: PinMarkersProps) {
  return (
    <>
      {pins.map((pin) => (
        <Marker key={pin.id} position={[pin.lat, pin.lng]}>
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
