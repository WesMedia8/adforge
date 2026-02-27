// ============================================
// ThumbnailStrip Component
// ============================================

'use client';

import React from 'react';

interface AdVariation {
  id: string;
  name: string;
  headline: string;
  color: string;
  emoji: string;
}

interface ThumbnailStripProps {
  variations: AdVariation[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function ThumbnailStrip({ variations, selectedIndex, onSelect }: ThumbnailStripProps) {
  return (
    <div className="border-t border-gray-800 bg-gray-900 px-4 py-2 flex gap-2 overflow-x-auto">
      {variations.map((variation, index) => (
        <button
          key={variation.id}
          onClick={() => onSelect(index)}
          className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
            selectedIndex === index
              ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-gray-900'
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          <div
            className="w-16 h-16 flex flex-col items-center justify-center p-1"
            style={{ backgroundColor: variation.color }}
          >
            <div className="text-lg">{variation.emoji}</div>
            <div className="text-white text-xs font-semibold text-center line-clamp-1 mt-0.5">
              {variation.name}
            </div>
          </div>
        </button>
      ))}
      <button className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-600 hover:border-gray-600 hover:text-gray-500 transition-colors">
        +
      </button>
    </div>
  );
}
