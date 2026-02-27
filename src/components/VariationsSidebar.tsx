// ============================================
// VariationsSidebar Component
// ============================================

'use client';

import React from 'react';

interface AdVariation {
  id: string;
  name: string;
  headline: string;
  subtext: string;
  cta: string;
  color: string;
  emoji: string;
}

interface VariationsSidebarProps {
  variations: AdVariation[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onUpdate: (index: number, updates: Partial<AdVariation>) => void;
}

export default function VariationsSidebar({
  variations,
  selectedIndex,
  onSelect,
}: VariationsSidebarProps) {
  return (
    <div className="w-56 border-r border-gray-800 flex flex-col bg-gray-900">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Variations</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {variations.map((variation, index) => (
          <button
            key={variation.id}
            onClick={() => onSelect(index)}
            className={`w-full text-left rounded-lg p-3 transition-all ${
              selectedIndex === index
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-sm"
                style={{ backgroundColor: variation.color }}
              >
                {variation.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{variation.name}</div>
                <div
                  className={`text-xs truncate ${
                    selectedIndex === index ? 'text-indigo-200' : 'text-gray-500'
                  }`}
                >
                  {variation.headline}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="p-3 border-t border-gray-800">
        <button className="w-full text-xs text-gray-500 hover:text-gray-300 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          + Add Variation
        </button>
      </div>
    </div>
  );
}
