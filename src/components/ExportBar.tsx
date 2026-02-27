// ============================================
// AdForge — Export Bar (Progress Indicator)
// ============================================

'use client';

import React from 'react';

interface ExportBarProps {
  exporting: boolean;
  progress: { current: number; total: number };
  progressMessage: string;
}

export default function ExportBar({
  exporting,
  progress,
  progressMessage,
}: ExportBarProps) {
  if (!exporting) return null;

  const pct = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <div className="relative h-[26px] bg-af-bg-secondary border-b border-af-border-subtle overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full progress-gradient transition-[width] duration-200"
        style={{ width: `${pct}%` }}
      />
      <span className="relative z-[1] flex items-center justify-center h-full text-[11px] font-medium text-white">
        {progressMessage}
      </span>
    </div>
  );
}
