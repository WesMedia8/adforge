// ============================================
// AdForge — Ad Preview Component (1080x1080 scaled)
// ============================================

'use client';

import React, { useMemo } from 'react';
import { Variation, TemplateSettings, LayoutType } from '@/lib/types';
import { buildAdHTML } from '@/lib/export';

interface AdPreviewProps {
  variation: Variation;
  settings: TemplateSettings;
  layout: LayoutType;
}

export default function AdPreview({ variation, settings, layout }: AdPreviewProps) {
  const scale = 440 / 1080;

  const html = useMemo(
    () => buildAdHTML(variation, settings, layout, scale),
    [variation, settings, layout, scale]
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-af-bg-primary relative dot-grid-bg">
      <div className="flex-1 flex items-center justify-center p-5 relative overflow-hidden">
        <div
          className="w-[440px] h-[440px] rounded-lg overflow-hidden shrink-0"
          style={{
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.5), 0 0 60px rgba(0,102,255,0.08)',
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}
