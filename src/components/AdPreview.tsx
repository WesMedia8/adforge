// ============================================
// AdPreview Component
// ============================================

'use client';

import React from 'react';

interface AdVariation {
  headline: string;
  subtext: string;
  cta: string;
  color: string;
  emoji: string;
}

interface Template {
  name: string;
  platform: string;
  size: string;
}

interface AdPreviewProps {
  variation: AdVariation;
  template: Template;
}

export default function AdPreview({ variation, template }: AdPreviewProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gray-950">
      <div className="relative">
        {/* Canvas */}
        <div
          className="w-80 h-80 rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-2xl"
          style={{ backgroundColor: variation.color }}
        >
          <div className="text-5xl mb-4">{variation.emoji}</div>
          <h2 className="text-white font-bold text-xl mb-2">{variation.headline}</h2>
          <p className="text-white/80 text-sm mb-6">{variation.subtext}</p>
          <button className="bg-white text-gray-900 font-semibold px-6 py-2 rounded-full text-sm hover:bg-gray-100 transition-colors">
            {variation.cta}
          </button>
        </div>

        {/* Platform badge */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-700">
          {template.platform} · {template.size}
        </div>
      </div>
    </div>
  );
}
