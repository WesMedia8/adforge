// ============================================
// AdForge — Export Bar Component
// ============================================

'use client';

import React from 'react';
import { Variation, TemplateSettings, LayoutType } from '@/lib/types';
import { exportAllVariationsAsZip } from '@/lib/export';

interface ExportBarProps {
  variations: Variation[];
  settings: TemplateSettings;
  layout: LayoutType;
}

export default function ExportBar({ variations, settings, layout }: ExportBarProps) {
  const handleExportAll = async () => {
    await exportAllVariationsAsZip(variations, settings, layout);
  };

  return (
    <div className="px-4 py-3 border-t border-af-border-subtle bg-af-bg-secondary flex items-center justify-between gap-3">
      <span className="text-[11px] text-af-text-tertiary">
        {variations.length} variation{variations.length !== 1 ? 's' : ''}
      </span>
      <button
        onClick={handleExportAll}
        disabled={variations.length === 0}
        className="flex items-center gap-2 px-4 py-2 rounded-md text-[12px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all disabled:opacity-40"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 2v8M8 10L5 7M8 10l3-3M3 13h10" />
        </svg>
        Export All
      </button>
    </div>
  );
}
