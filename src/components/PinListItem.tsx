"use client";

import { Pin } from "@/types/pin";

interface PinListItemProps {
  pin: Pin;
  index: number;
  onDelete: (id: string) => void;
  onHover: (id: string | null) => void;
}

export default function PinListItem({
  pin,
  index,
  onDelete,
  onHover,
}: PinListItemProps) {
  return (
    <div
      className="bg-gray-50 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 border border-gray-200 cursor-pointer"
      onMouseEnter={() => onHover(pin.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
              #{index + 1}
            </span>
            <span className="text-xs text-gray-500">
              {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
            </span>
            {pin.isGeocoding && (
              <span className="text-xs text-orange-500 animate-pulse">●</span>
            )}
          </div>
          {pin.isGeocoding ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>{pin.address}</span>
            </div>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed">
              {pin.address}
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(pin.id)}
          className="ml-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2 transition-colors"
          aria-label="Delete pin"
        >
          <svg
            className="h-5 w-5"
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
  );
}
