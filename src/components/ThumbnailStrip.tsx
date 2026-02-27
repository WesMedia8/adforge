// ============================================
// AdForge — Thumbnail Strip Component
// ============================================

'use client';

import React from 'react';
import { Variation, TemplateSettings, LayoutType } from '@/lib/types';
import { buildAdHTML } from '@/lib/export';

interface ThumbnailStripProps {
  variations: Variation[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  settings: TemplateSettings;
  layout: LayoutType;
}

export default function ThumbnailStrip({
  variations,
  selectedIndex,
  onSelect,
  settings,
  layout,
}: ThumbnailStripProps) {
  const thumbScale = 80 / 1080;

  return (
    <div className="flex flex-col items-center gap-2 px-2 py-3 bg-af-bg-secondary border-r border-af-border-subtle overflow-y-auto">
      {variations.map((variation, i) => {
        const html = buildAdHTML(variation, settings, layout, thumbScale);
        return (
          <button
            key={variation.id || i}
            onClick={() => onSelect(i)}
            className={`w-[80px] h-[80px] rounded overflow-hidden border-2 transition-all flex-shrink-0 ${
              selectedIndex === i
                ? 'border-af-accent'
                : 'border-transparent hover:border-af-border-bright'
            }`}
          >
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </button>
        );
      })}
    </div>
  );
}
