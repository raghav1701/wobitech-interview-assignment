"use client";

import { useState, useEffect } from "react";
import { Pin } from "@/types/pin";

interface PinListItemProps {
  pin: Pin;
  index: number;
  onDelete: (id: string) => void;
  onHover: (id: string | null) => void;
  isLast: boolean;
}

export default function PinListItem({
  pin,
  index,
  onDelete,
  onHover,
  isLast,
}: PinListItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 50);
    return () => clearTimeout(timer);
  }, [index]);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(pin.id);
    }, 300);
  };

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

  const formattedLat = formatCoordinate(pin.lat, true);
  const formattedLng = formatCoordinate(pin.lng, false);

  return (
    <div
      className={`cursor-pointer transform transition-all duration-300 ease-out
        ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
        ${isDeleting ? "opacity-0 translate-x-8 scale-95" : ""}
      `}
      onMouseEnter={() => onHover(pin.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="py-4 px-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
        <div className="flex items-start justify-between gap-3">
          {/* Pin badge */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                #{index + 1}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Pin #{index + 1}
            </h3>

            <div className="flex items-start gap-1.5 text-sm text-gray-500">
              <svg
                className="w-4 h-4 flex-shrink-0 mt-0.5"
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
              <span className="font-normal">
                {formattedLat} {formattedLng}
              </span>
            </div>
          </div>

          {/* Delete button - Red circular with bin icon */}
          <button
            onClick={handleDelete}
            className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-white-200
              hover:bg-red-500 hover:border-red-500 flex items-center justify-center
              transition-all duration-200 group"
            aria-label="Delete pin"
          >
            <svg
              className="h-5 w-5 text-red-500 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Line separator - only if not last item */}
      {!isLast && <div className="h-px bg-gray-200 mx-2"></div>}
    </div>
  );
}
