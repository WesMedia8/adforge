// ============================================
// ExportBar Component
// ============================================

'use client';

import React from 'react';

interface AdVariation {
  headline: string;
  cta: string;
}

interface Template {
  name: string;
  platform: string;
  size: string;
}

interface ExportBarProps {
  variation: AdVariation;
  template: Template;
}

export default function ExportBar({ variation, template }: ExportBarProps) {
  return (
    <div className="border-t border-gray-800 bg-gray-900 px-6 py-3 flex items-center gap-3">
      <div className="text-xs text-gray-500">
        {template.platform} · {template.size} · {variation.headline}
      </div>
      <div className="flex-1" />
      <button className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
        Save Draft
      </button>
      <button className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
        Copy Link
      </button>
      <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-1.5 rounded-lg transition-colors font-medium">
        Export PNG
      </button>
    </div>
  );
}
