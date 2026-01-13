"use client";

import { Pin } from "@/types/pin";
import PinListItem from "./PinListItem";

interface PinListProps {
  pins: Pin[];
  onDeletePin: (id: string) => void;
  onPinHover: (id: string | null) => void;
}

export default function PinList({
  pins,
  onDeletePin,
  onPinHover,
}: PinListProps) {
  return (
    <div className="w-full lg:w-1/3 h-1/2 lg:h-full bg-white shadow-lg overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800">Pins</h2>
          <span
            className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold
            transition-all duration-300 hover:scale-110 hover:bg-blue-600"
          >
            {pins.length}
          </span>
        </div>

        {pins.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <p className="mt-4 text-gray-500">No pins yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Click on the map to add your first pin
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pins.map((pin, index) => (
              <PinListItem
                key={pin.id}
                pin={pin}
                index={index}
                onDelete={onDeletePin}
                onHover={onPinHover}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
