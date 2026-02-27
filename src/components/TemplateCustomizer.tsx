// ============================================
// TemplateCustomizer Component
// ============================================

'use client';

import React, { useState } from 'react';

interface AdVariation {
  headline: string;
  subtext: string;
  cta: string;
  color: string;
  emoji: string;
}

interface Template {
  id: string;
  name: string;
  platform: string;
  size: string;
  layout: string;
}

interface TemplateCustomizerProps {
  template: Template;
  variation: AdVariation;
  onTemplateChange: (template: Template) => void;
  onVariationChange: (updates: Partial<AdVariation>) => void;
}

const TEMPLATES = [
  { id: '1', name: 'Social Square', platform: 'Instagram', size: '1080x1080', layout: 'centered' },
  { id: '2', name: 'Story Format', platform: 'Instagram', size: '1080x1920', layout: 'top-bottom' },
  { id: '3', name: 'Feed Banner', platform: 'Facebook', size: '1200x628', layout: 'left-right' },
  { id: '4', name: 'LinkedIn Post', platform: 'LinkedIn', size: '1200x627', layout: 'centered' },
  { id: '5', name: 'Google Display', platform: 'Google', size: '728x90', layout: 'minimal' },
];

const COLOR_PRESETS = [
  '#6366f1', '#8b5cf6', '#06b6d4', '#10b981',
  '#f59e0b', '#ef4444', '#ec4899', '#1e293b',
];

export default function TemplateCustomizer({
  template,
  variation,
  onTemplateChange,
  onVariationChange,
}: TemplateCustomizerProps) {
  const [activePanel, setActivePanel] = useState<'template' | 'copy' | 'style'>('template');

  return (
    <div className="w-72 border-l border-gray-800 flex flex-col bg-gray-900">
      {/* Panel Tabs */}
      <div className="flex border-b border-gray-800">
        {(['template', 'copy', 'style'] as const).map((panel) => (
          <button
            key={panel}
            onClick={() => setActivePanel(panel)}
            className={`flex-1 py-3 text-xs font-medium capitalize transition-colors ${
              activePanel === panel
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {panel}
          </button>
        ))}
      </div>

      {/* Template Panel */}
      {activePanel === 'template' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Templates</h3>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onTemplateChange(t)}
              className={`w-full text-left rounded-lg border p-3 transition-all ${
                template.id === t.id
                  ? 'border-indigo-500 bg-indigo-900/20'
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="font-medium text-sm text-white">{t.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {t.platform} · {t.size}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Copy Panel */}
      {activePanel === 'copy' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Ad Copy</h3>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Headline</label>
            <input
              type="text"
              value={variation.headline}
              onChange={(e) => onVariationChange({ headline: e.target.value })}
              className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Subtext</label>
            <textarea
              value={variation.subtext}
              onChange={(e) => onVariationChange({ subtext: e.target.value })}
              rows={3}
              className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">CTA Button</label>
            <input
              type="text"
              value={variation.cta}
              onChange={(e) => onVariationChange({ cta: e.target.value })}
              className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Emoji</label>
            <input
              type="text"
              value={variation.emoji}
              onChange={(e) => onVariationChange({ emoji: e.target.value })}
              className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Style Panel */}
      {activePanel === 'style' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Style</h3>

          <div>
            <label className="block text-xs text-gray-500 mb-2">Background Color</label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  onClick={() => onVariationChange({ color })}
                  className={`w-full h-8 rounded-lg transition-all ${
                    variation.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Custom Color</label>
            <input
              type="color"
              value={variation.color}
              onChange={(e) => onVariationChange({ color: e.target.value })}
              className="w-full h-10 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
