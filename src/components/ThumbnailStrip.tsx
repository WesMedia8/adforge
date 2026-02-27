// ============================================
// AdForge — Thumbnail Strip Component
// ============================================

'use client';

import React from 'react';
import { Variation, TemplateSettings } from '@/lib/types';
import { getBgCSS, highlightFirst, escHTML } from '@/lib/export';

interface ThumbnailStripProps {
  variations: Variation[];
  activeIndex: number;
  settings: TemplateSettings;
  onSelect: (index: number) => void;
}

export default function ThumbnailStrip({
  variations,
  activeIndex,
  settings,
  onSelect,
}: ThumbnailStripProps) {
  const bg = getBgCSS(settings);
  const tc = settings.textColor;
  const ac = settings.accentColor;
  const ff = settings.fontFamily;

  return (
    <div className="h-[76px] min-h-[76px] flex items-center gap-[7px] px-3.5 overflow-x-auto bg-af-bg-secondary border-t border-af-border-subtle relative z-[1]">
      {variations.map((v, i) => (
        <div
          key={i}
          onClick={() => onSelect(i)}
          className={`w-[52px] h-[52px] min-w-[52px] rounded cursor-pointer border-2 transition-all relative bg-af-bg-tertiary overflow-hidden ${
            i === activeIndex
              ? 'border-af-accent shadow-[0_0_10px_var(--accent-glow)]'
              : 'border-transparent hover:border-af-border-bright'
          }`}
        >
          <div
            className="w-full h-full flex flex-col justify-center items-center p-1"
            style={{
              background: bg,
              color: tc,
              fontFamily: ff,
            }}
          >
            <div
              className="text-[4.5px] font-bold text-center leading-[1.2] overflow-hidden max-h-[22px]"
              dangerouslySetInnerHTML={{
                __html: highlightFirst(escHTML(v.headline), ac),
              }}
            />
            <div className="text-[3px] text-center mt-[1px] opacity-50 leading-[1.2] overflow-hidden max-h-[8px]">
              {v.subtext}
            </div>
          </div>
          <span className="absolute bottom-[1px] right-[2px] text-[7px] font-bold text-white/50 [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]">
            {String(i + 1).padStart(2, '0')}
          </span>
        </div>
      ))}
    </div>
  );
}
