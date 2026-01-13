"use client";

import { Pin } from "@/types/pin";
import PinListItem from "./PinListItem";

interface PinListProps {
  pins: Pin[];
  onDeletePin: (id: string) => void;
  onPinHover: (id: string | null) => void;
  onClearAll: () => void;
  isDraggable?: boolean;
}

export default function PinList({
  pins,
  onDeletePin,
  onPinHover,
  onClearAll,
  isDraggable,
}: PinListProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 lg:px-6 py-3 lg:py-5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
            Pin Lists
          </h2>
          {pins.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs lg:text-sm text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-3 lg:px-4">
        {pins.length === 0 ? (
          <div className="text-center py-12 lg:py-16">
            <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 rounded-full bg-gray-50 flex items-center justify-center">
              <svg
                className="h-6 w-6 lg:h-8 lg:w-8 text-gray-400"
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
            </div>
            <h3 className="text-sm lg:text-base font-medium text-gray-700 mb-1">
              No pins yet
            </h3>
            <p className="text-xs lg:text-sm text-gray-500">
              Click on the map to add a pin
            </p>
          </div>
        ) : (
          <div>
            {pins.map((pin, index) => (
              <PinListItem
                key={pin.id}
                pin={pin}
                index={index}
                onDelete={onDeletePin}
                onHover={onPinHover}
                isLast={index === pins.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
