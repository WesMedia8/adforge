// ============================================
// AdForge — Template Customizer Component
// ============================================

'use client';

import React, { useState, useCallback } from 'react';
import { TemplateSettings, BgStyle } from '@/lib/types';
import { FONT_OPTIONS, SOLID_PRESETS, GRADIENT_PRESETS } from '@/lib/defaults';

interface TemplateCustomizerProps {
  settings: TemplateSettings;
  onUpdate: (partial: Partial<TemplateSettings>) => void;
}

function ColorPair({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const [textVal, setTextVal] = useState(value.toUpperCase());

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setTextVal(v.toUpperCase());
    onChange(v);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.trim();
    setTextVal(v);
    if (v.match(/^#?[0-9A-Fa-f]{6}$/)) {
      if (!v.startsWith('#')) v = '#' + v;
      onChange(v);
    }
  };

  const handleTextBlur = () => {
    if (!textVal.match(/^#[0-9A-Fa-f]{6}$/)) {
      setTextVal(value.toUpperCase());
    }
  };

  // Sync when parent changes
  React.useEffect(() => {
    setTextVal(value.toUpperCase());
  }, [value]);

  return (
    <div className="flex gap-[5px] items-center">
      <input
        type="color"
        value={value}
        onChange={handlePickerChange}
        className="w-[26px] h-[26px] border border-af-border-default rounded bg-af-bg-tertiary p-[1px] cursor-pointer shrink-0"
      />
      <input
        type="text"
        value={textVal}
        onChange={handleTextChange}
        onBlur={handleTextBlur}
        className="flex-1 bg-af-bg-tertiary border border-af-border-default rounded text-af-text-primary text-[11px] px-[7px] py-1 outline-none focus:border-af-accent min-w-0"
      />
    </div>
  );
}

export default function TemplateCustomizer({
  settings,
  onUpdate,
}: TemplateCustomizerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [bgPrompt, setBgPrompt] = useState('');
  const [generatingBg, setGeneratingBg] = useState(false);

  const applyPreset = (preset: string) => {
    if (SOLID_PRESETS[preset]) {
      const sp = SOLID_PRESETS[preset];
      const update: Partial<TemplateSettings> = {
        bgStyle: 'solid',
        bgColor: sp.bg,
        bgImageUrl: '',
      };
      if (sp.text) update.textColor = sp.text;
      onUpdate(update);
    } else if (GRADIENT_PRESETS[preset]) {
      const gp = GRADIENT_PRESETS[preset];
      onUpdate({
        bgStyle: 'gradient',
        gradColor1: gp.c1,
        gradColor2: gp.c2,
        gradDirection: gp.dir,
        bgImageUrl: '',
      });
    }
  };

  const handleGenerateBackground = async () => {
    if (!bgPrompt.trim()) return;
    setGeneratingBg(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: bgPrompt.trim(),
          type: 'background',
          width: 1080,
          height: 1080,
        }),
      });
      const data = await res.json();
      if (data.success && data.image_url) {
        onUpdate({ bgImageUrl: data.image_url });
      } else {
        alert('Failed to generate image: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Background generation failed:', err);
      alert('Failed to generate background image.');
    } finally {
      setGeneratingBg(false);
    }
  };

  const clearBgImage = () => {
    onUpdate({ bgImageUrl: '' });
  };

  return (
    <div className="bg-af-bg-secondary border-b border-af-border-subtle shrink-0">
      {/* Toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3.5 py-[7px] cursor-pointer text-[11.5px] font-medium text-af-text-secondary hover:text-af-text-primary transition-colors select-none"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6.5 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM1 3.5h4M8 3.5h7M11 6.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM1 8h8.5M12.5 8H15M4 11a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM1 12.5h1.5M5.5 12.5H15" />
        </svg>
        <span>Template Settings</span>
        <svg
          className={`ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="px-3.5 pb-3">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-y-2.5 gap-x-3.5">
            {/* Background */}
            <div className="flex flex-col gap-1">
              <label className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em]">
                Background
              </label>
              <div className="flex gap-[3px]">
                {(['solid', 'gradient', 'pattern'] as BgStyle[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => onUpdate({ bgStyle: s, bgImageUrl: '' })}
                    className={`flex-1 py-[3px] border rounded text-[10px] font-medium transition-all ${
                      settings.bgStyle === s && !settings.bgImageUrl
                        ? 'text-af-accent border-af-accent bg-af-accent-subtle'
                        : 'text-af-text-tertiary border-af-border-default bg-af-bg-tertiary hover:text-af-text-secondary'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              {/* Solid color */}
              {(settings.bgStyle === 'solid' || settings.bgStyle === 'pattern') && !settings.bgImageUrl && (
                <ColorPair
                  value={settings.bgColor}
                  onChange={(v) => onUpdate({ bgColor: v })}
                />
              )}

              {/* Gradient controls */}
              {settings.bgStyle === 'gradient' && !settings.bgImageUrl && (
                <div className="flex flex-col gap-[5px]">
                  <ColorPair
                    value={settings.gradColor1}
                    onChange={(v) => onUpdate({ gradColor1: v })}
                  />
                  <ColorPair
                    value={settings.gradColor2}
                    onChange={(v) => onUpdate({ gradColor2: v })}
                  />
                  <select
                    value={settings.gradDirection}
                    onChange={(e) => onUpdate({ gradDirection: e.target.value })}
                    className="bg-af-bg-tertiary border border-af-border-default rounded text-af-text-primary text-[11px] px-[7px] py-[5px] outline-none cursor-pointer w-full focus:border-af-accent"
                  >
                    <option value="to bottom">Top → Bottom</option>
                    <option value="to right">Left → Right</option>
                    <option value="to bottom right">Diagonal ↘</option>
                    <option value="to bottom left">Diagonal ↙</option>
                    <option value="135deg">135°</option>
                  </select>
                </div>
              )}

              {/* BG Image indicator */}
              {settings.bgImageUrl && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-af-accent truncate flex-1">AI Background active</span>
                  <button
                    onClick={clearBgImage}
                    className="text-[9px] text-af-text-tertiary hover:text-af-danger transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Presets */}
            <div className="flex flex-col gap-1">
              <label className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em]">
                Presets
              </label>
              <div className="flex gap-1 flex-wrap">
                <button onClick={() => applyPreset('dark-navy')} className="w-[22px] h-[22px] rounded-[3px] border border-af-border-default hover:scale-[1.15] hover:border-af-border-bright transition-all shrink-0" style={{ background: '#0a0a1a' }} title="Dark Navy" />
                <button onClick={() => applyPreset('pure-black')} className="w-[22px] h-[22px] rounded-[3px] border border-af-border-default hover:scale-[1.15] hover:border-af-border-bright transition-all shrink-0" style={{ background: '#000000' }} title="Pure Black" />
                <button onClick={() => applyPreset('charcoal')} className="w-[22px] h-[22px] rounded-[3px] border border-af-border-default hover:scale-[1.15] hover:border-af-border-bright transition-all shrink-0" style={{ background: '#1a1a2e' }} title="Charcoal" />
                <button onClick={() => applyPreset('white')} className="w-[22px] h-[22px] rounded-[3px] border border-[#333] hover:scale-[1.15] hover:border-af-border-bright transition-all shrink-0" style={{ background: '#ffffff' }} title="White" />
                <button onClick={() => applyPreset('warm-dark')} className="w-[22px] h-[22px] rounded-[3px] border border-af-border-default hover:scale-[1.15] hover:border-af-border-bright transition-all shrink-0" style={{ background: '#1a0e0a' }} title="Warm Dark" />
                <button onClick={() => applyPreset('blue-gradient')} className="w-[22px] h-[22px] rounded-[3px] border border-af-border-default hover:scale-[1.15] hover:border-af-border-bright transition-all shrink-0" style={{ background: 'linear-gradient(135deg,#0a0a2e,#1a1a4a)' }} title="Blue Gradient" />
                <button onClick={() => applyPreset('sunset-gradient')} className="w-[22px] h-[22px] rounded-[3px] border border-af-border-default hover:scale-[1.15] hover:border-af-border-bright transition-all shrink-0" style={{ background: 'linear-gradient(135deg,#1a0a1a,#2a1a0a)' }} title="Sunset Gradient" />
                <button onClick={() => applyPreset('ocean-gradient')} className="w-[22px] h-[22px] rounded-[3px] border border-af-border-default hover:scale-[1.15] hover:border-af-border-bright transition-all shrink-0" style={{ background: 'linear-gradient(135deg,#0a1a2a,#0a2a1a)' }} title="Ocean Gradient" />
              </div>
            </div>

            {/* Accent Color */}
            <div className="flex flex-col gap-1">
              <label className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em]">
                Accent Color
              </label>
              <ColorPair
                value={settings.accentColor}
                onChange={(v) => onUpdate({ accentColor: v })}
              />
            </div>

            {/* Text Color */}
            <div className="flex flex-col gap-1">
              <label className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em]">
                Text Color
              </label>
              <ColorPair
                value={settings.textColor}
                onChange={(v) => onUpdate({ textColor: v })}
              />
            </div>

            {/* Font Family */}
            <div className="flex flex-col gap-1">
              <label className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em]">
                Font Family
              </label>
              <select
                value={settings.fontFamily}
                onChange={(e) => onUpdate({ fontFamily: e.target.value })}
                className="bg-af-bg-tertiary border border-af-border-default rounded text-af-text-primary text-[11px] px-[7px] py-[5px] outline-none cursor-pointer w-full focus:border-af-accent"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Headline Size */}
            <div className="flex flex-col gap-1">
              <label className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em]">
                Headline Size{' '}
                <span className="text-af-text-secondary font-normal normal-case tracking-normal">
                  {settings.headlineSize}px
                </span>
              </label>
              <input
                type="range"
                min="36"
                max="72"
                value={settings.headlineSize}
                onChange={(e) => onUpdate({ headlineSize: +e.target.value })}
              />
            </div>

            {/* Subtext Size */}
            <div className="flex flex-col gap-1">
              <label className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em]">
                Subtext Size{' '}
                <span className="text-af-text-secondary font-normal normal-case tracking-normal">
                  {settings.subtextSize}px
                </span>
              </label>
              <input
                type="range"
                min="16"
                max="32"
                value={settings.subtextSize}
                onChange={(e) => onUpdate({ subtextSize: +e.target.value })}
              />
            </div>

            {/* Padding */}
            <div className="flex flex-col gap-1">
              <label className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em]">
                Padding{' '}
                <span className="text-af-text-secondary font-normal normal-case tracking-normal">
                  {settings.padding}px
                </span>
              </label>
              <input
                type="range"
                min="20"
                max="200"
                value={settings.padding}
                onChange={(e) => onUpdate({ padding: +e.target.value })}
              />
            </div>

            {/* Text Position X */}
            <div className="flex flex-col gap-1">
              <label className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em]">
                Text X Offset{' '}
                <span className="text-af-text-secondary font-normal normal-case tracking-normal">
                  {settings.textPositionX ?? 0}px
                </span>
              </label>
              <input
                type="range"
                min="-400"
                max="400"
                step="10"
                value={settings.textPositionX ?? 0}
                onChange={(e) => onUpdate({ textPositionX: +e.target.value })}
              />
            </div>

            {/* Text Position Y */}
            <div className="flex flex-col gap-1">
              <label className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em]">
                Text Y Offset{' '}
                <span className="text-af-text-secondary font-normal normal-case tracking-normal">
                  {settings.textPositionY ?? 0}px
                </span>
              </label>
              <input
                type="range"
                min="-400"
                max="400"
                step="10"
                value={settings.textPositionY ?? 0}
                onChange={(e) => onUpdate({ textPositionY: +e.target.value })}
              />
            </div>

            {/* Vertical Align */}
            <div className="flex flex-col gap-1">
              <label className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em]">
                Vertical Align
              </label>
              <div className="flex bg-af-bg-tertiary rounded-md border border-af-border-default overflow-hidden">
                {(['top', 'center', 'bottom'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => onUpdate({ verticalAlign: v })}
                    className={`flex-1 py-[3px] border-r border-af-border-subtle last:border-r-0 text-[10px] font-medium transition-all ${
                      (settings.verticalAlign ?? 'top') === v
                        ? 'text-af-accent bg-af-accent-subtle'
                        : 'text-af-text-tertiary hover:text-af-text-secondary hover:bg-af-bg-hover'
                    }`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo URL */}
            <div className="flex flex-col gap-1">
              <label className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em]">
                Logo URL
              </label>
              <input
                type="text"
                value={settings.logoUrl}
                onChange={(e) => onUpdate({ logoUrl: e.target.value.trim() })}
                placeholder="https://your-logo.png"
                className="bg-af-bg-tertiary border border-af-border-default rounded text-af-text-primary text-[11px] px-[7px] py-[5px] outline-none w-full focus:border-af-accent"
              />
            </div>

            {/* Logo Position */}
            <div className="flex flex-col gap-1">
              <label className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em]">
                Logo Position
              </label>
              <select
                value={settings.logoPosition}
                onChange={(e) =>
                  onUpdate({ logoPosition: e.target.value as any })
                }
                className="bg-af-bg-tertiary border border-af-border-default rounded text-af-text-primary text-[11px] px-[7px] py-[5px] outline-none cursor-pointer w-full focus:border-af-accent"
              >
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-1">
              <label className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em]">
                CTA Button
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.ctaText}
                  onChange={(e) =>
                    onUpdate({ ctaText: e.target.value || 'Learn More' })
                  }
                  placeholder="Button text"
                  className="flex-1 bg-af-bg-tertiary border border-af-border-default rounded text-af-text-primary text-[11px] px-[7px] py-[5px] outline-none focus:border-af-accent"
                />
                <label className="relative w-[30px] h-[16px] shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.ctaVisible}
                    onChange={(e) => onUpdate({ ctaVisible: e.target.checked })}
                    className="sr-only peer"
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            {/* AI Background Generator */}
            <div className="flex flex-col gap-1 col-span-full">
              <label className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" className="text-af-accent">
                  <path d="M8 1l2 4 4.5.7-3.2 3.2.8 4.6L8 11.3 3.9 13.5l.8-4.6L1.5 5.7 6 5z" />
                </svg>
                AI Background
              </label>
              <div className="flex gap-[5px]">
                <input
                  type="text"
                  value={bgPrompt}
                  onChange={(e) => setBgPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGenerateBackground();
                  }}
                  placeholder="e.g. abstract dark gradient with blue particles"
                  className="flex-1 bg-af-bg-tertiary border border-af-border-default rounded text-af-text-primary text-[11px] px-[7px] py-[5px] outline-none focus:border-af-accent"
                />
                <button
                  onClick={handleGenerateBackground}
                  disabled={generatingBg || !bgPrompt.trim()}
                  className="px-3 py-[5px] rounded text-[10px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all disabled:opacity-40 whitespace-nowrap"
                >
                  {generatingBg ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
