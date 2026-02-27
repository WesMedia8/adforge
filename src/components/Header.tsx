// ============================================
// AdForge — Header Component
// ============================================

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LayoutType } from '@/lib/types';

export type ActiveTab = 'editor' | 'ai-studio' | 'research' | 'competitor-spy' | 'ads-manager';

interface HeaderProps {
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  variationCount: number;
  onDownloadCurrent: () => void;
  onDownloadAll: () => void;
  exporting: boolean;
  supabaseReady: boolean;
  currentProjectName: string | null;
  onOpenProjects: () => void;
  onTabChange: (tab: ActiveTab) => void;
  activeTab: ActiveTab;
}

const primaryLayouts: { key: LayoutType; label: string; icon: React.ReactNode }[] = [
  {
    key: 'classic',
    label: 'Classic',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="2" y="2" width="12" height="3" rx="1" />
        <rect x="2" y="7" width="12" height="2" rx="0.5" opacity="0.5" />
        <rect x="4" y="12" width="8" height="2" rx="1" opacity="0.3" />
      </svg>
    ),
  },
  {
    key: 'centered',
    label: 'Centered',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="3" y="4" width="10" height="2" rx="0.5" />
        <rect x="4" y="7.5" width="8" height="1.5" rx="0.5" opacity="0.5" />
        <rect x="5" y="11" width="6" height="2" rx="1" opacity="0.3" />
      </svg>
    ),
  },
  {
    key: 'bold',
    label: 'Bold',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="2" y="2" width="12" height="7" rx="1" />
        <rect x="3" y="11" width="10" height="1.5" rx="0.5" opacity="0.4" />
        <rect x="5" y="13.5" width="6" height="1.5" rx="0.75" opacity="0.2" />
      </svg>
    ),
  },
];

const moreLayouts: { key: LayoutType; label: string; icon: React.ReactNode }[] = [
  {
    key: 'features',
    label: 'Features',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="2" y="2" width="12" height="2" rx="0.5" />
        <circle cx="3.5" cy="7" r="1" />
        <rect x="6" y="6.25" width="8" height="1.5" rx="0.5" opacity="0.6" />
        <circle cx="3.5" cy="10.5" r="1" />
        <rect x="6" y="9.75" width="8" height="1.5" rx="0.5" opacity="0.6" />
        <circle cx="3.5" cy="14" r="1" />
        <rect x="6" y="13.25" width="6" height="1.5" rx="0.5" opacity="0.6" />
      </svg>
    ),
  },
  {
    key: 'benefits',
    label: 'Benefits',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="2" y="2" width="12" height="2" rx="0.5" />
        <rect x="2" y="6" width="5.5" height="4" rx="1" opacity="0.7" />
        <rect x="8.5" y="6" width="5.5" height="4" rx="1" opacity="0.7" />
        <rect x="2" y="11.5" width="5.5" height="3" rx="1" opacity="0.4" />
        <rect x="8.5" y="11.5" width="5.5" height="3" rx="1" opacity="0.4" />
      </svg>
    ),
  },
  {
    key: 'testimonial',
    label: 'Testimonial',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M3 4h2v3H3a2 2 0 000-3zm5 0h2v3H8a2 2 0 000-3z" opacity="0.9" />
        <rect x="2" y="10" width="12" height="1.5" rx="0.5" opacity="0.5" />
        <rect x="5" y="13" width="6" height="1.5" rx="0.75" opacity="0.3" />
      </svg>
    ),
  },
  {
    key: 'listicle',
    label: 'Listicle',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="2" y="2" width="12" height="2" rx="0.5" />
        <rect x="2" y="6.5" width="2" height="2" rx="0.3" opacity="0.8" />
        <rect x="5.5" y="6.5" width="8.5" height="2" rx="0.5" opacity="0.6" />
        <rect x="2" y="10" width="2" height="2" rx="0.3" opacity="0.8" />
        <rect x="5.5" y="10" width="8.5" height="2" rx="0.5" opacity="0.6" />
        <rect x="2" y="13.5" width="2" height="2" rx="0.3" opacity="0.8" />
        <rect x="5.5" y="13.5" width="5.5" height="2" rx="0.5" opacity="0.4" />
      </svg>
    ),
  },
  {
    key: 'before-after',
    label: 'Before/After',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="3" width="6" height="10" rx="1" opacity="0.4" />
        <rect x="9" y="3" width="6" height="10" rx="1" opacity="0.8" />
        <path d="M7 8l2-2v1.2h0V8.8h0V10L7 8z" opacity="0.9" />
      </svg>
    ),
  },
  {
    key: 'stats',
    label: 'Stats',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <text x="2" y="11" fontSize="10" fontWeight="900" opacity="0.9">97</text>
        <text x="10" y="11" fontSize="7" fontWeight="700" opacity="0.9">%</text>
        <rect x="2" y="12.5" width="12" height="1.5" rx="0.5" opacity="0.3" />
      </svg>
    ),
  },
];

export default function Header({
  layout,
  onLayoutChange,
  variationCount,
  onDownloadCurrent,
  onDownloadAll,
  exporting,
  supabaseReady,
  currentProjectName,
  onOpenProjects,
  onTabChange,
  activeTab,
}: HeaderProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!moreOpen) return;
    const handle = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [moreOpen]);

  const isMoreActive = moreLayouts.some((l) => l.key === layout);

  return (
    <header className="h-[46px] flex items-center justify-between px-3.5 bg-af-bg-secondary border-b border-af-border-subtle shrink-0 z-50">
      {/* Left */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="9" height="9" rx="2" fill="#0066FF" />
            <rect x="13" y="2" width="9" height="9" rx="2" fill="#0066FF" opacity="0.5" />
            <rect x="2" y="13" width="9" height="9" rx="2" fill="#0066FF" opacity="0.5" />
            <rect x="13" y="13" width="9" height="9" rx="2" fill="#0066FF" opacity="0.25" />
          </svg>
        </div>
        <span className="font-bold text-[15px] tracking-[-0.04em] text-af-text-primary">
          AdForge
        </span>
        <span className="text-[8.5px] font-semibold tracking-[0.1em] uppercase text-af-accent bg-af-accent-subtle px-[7px] py-[2px] rounded-[3px] border border-[rgba(0,102,255,0.15)]">
          BULK GENERATOR
        </span>

        {/* Project indicator */}
        {supabaseReady && (
          <button
            onClick={onOpenProjects}
            className="flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded bg-af-bg-tertiary border border-af-border-default text-af-text-secondary text-[11px] font-medium hover:text-af-text-primary hover:border-af-border-bright transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2h5l2 2h5v10H2V2z" />
            </svg>
            {currentProjectName || 'Projects'}
            <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" opacity="0.5">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
        )}
      </div>

      {/* Center — Tabs + Layout */}
      <div className="flex items-center gap-3">
        {/* Tab switcher */}
        <div className="flex bg-af-bg-tertiary rounded-md border border-af-border-subtle overflow-hidden mr-2">
          <button
            onClick={() => onTabChange('editor')}
            className={`flex items-center gap-1.5 px-3 py-[5px] text-[11px] font-medium border-r border-af-border-subtle transition-all ${
              activeTab === 'editor'
                ? 'text-af-accent bg-af-accent-subtle'
                : 'text-af-text-tertiary hover:text-af-text-secondary hover:bg-af-bg-hover'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="14" height="14" rx="2" opacity="0.3" />
              <rect x="3" y="4" width="10" height="2" rx="0.5" />
              <rect x="3" y="8" width="7" height="1.5" rx="0.5" opacity="0.5" />
            </svg>
            Editor
          </button>
          <button
            onClick={() => onTabChange('ai-studio')}
            className={`flex items-center gap-1.5 px-3 py-[5px] text-[11px] font-medium border-r border-af-border-subtle transition-all ${
              activeTab === 'ai-studio'
                ? 'text-af-accent bg-af-accent-subtle'
                : 'text-af-text-tertiary hover:text-af-text-secondary hover:bg-af-bg-hover'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6" />
              <ellipse cx="8" cy="8" rx="3" ry="6" />
              <line x1="2" y1="8" x2="14" y2="8" />
            </svg>
            Smart Generator
          </button>
          <button
            onClick={() => onTabChange('research')}
            className={`flex items-center gap-1.5 px-3 py-[5px] text-[11px] font-medium border-r border-af-border-subtle transition-all ${
              activeTab === 'research'
                ? 'text-af-accent bg-af-accent-subtle'
                : 'text-af-text-tertiary hover:text-af-text-secondary hover:bg-af-bg-hover'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="1" width="10" height="13" rx="1.5" />
              <line x1="4.5" y1="4.5" x2="9.5" y2="4.5" strokeLinecap="round" />
              <line x1="4.5" y1="7" x2="9.5" y2="7" strokeLinecap="round" />
              <line x1="4.5" y1="9.5" x2="7.5" y2="9.5" strokeLinecap="round" />
              <circle cx="13" cy="13" r="2.5" />
              <line x1="11.2" y1="11.2" x2="9.5" y2="9.5" strokeLinecap="round" />
            </svg>
            Research
          </button>
          <button
            onClick={() => onTabChange('competitor-spy')}
            className={`flex items-center gap-1.5 px-3 py-[5px] text-[11px] font-medium border-r border-af-border-subtle transition-all ${
              activeTab === 'competitor-spy'
                ? 'text-af-accent bg-af-accent-subtle'
                : 'text-af-text-tertiary hover:text-af-text-secondary hover:bg-af-bg-hover'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <ellipse cx="8" cy="8" rx="6" ry="3.5" />
              <circle cx="8" cy="8" r="1.8" fill="currentColor" stroke="none" />
              <line x1="2" y1="8" x2="3.5" y2="8" strokeLinecap="round" />
              <line x1="12.5" y1="8" x2="14" y2="8" strokeLinecap="round" />
            </svg>
            Competitor Spy
          </button>
          <button
            onClick={() => onTabChange('ads-manager')}
            className={`flex items-center gap-1.5 px-3 py-[5px] text-[11px] font-medium transition-all ${
              activeTab === 'ads-manager'
                ? 'text-af-accent bg-af-accent-subtle'
                : 'text-af-text-tertiary hover:text-af-text-secondary hover:bg-af-bg-hover'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="12" height="10" rx="1.5" />
              <path d="M5 7l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Ads Manager
          </button>
        </div>

        {/* Layout Switcher (only visible in editor tab) */}
        {activeTab === 'editor' && (
          <div className="flex items-center">
            {/* Primary layouts */}
            <div className="flex bg-af-bg-tertiary rounded-l-md border border-af-border-subtle overflow-hidden">
              {primaryLayouts.map((l) => (
                <button
                  key={l.key}
                  onClick={() => onLayoutChange(l.key)}
                  className={`flex items-center gap-[5px] px-3.5 py-[5px] text-[11px] font-medium border-r border-af-border-subtle transition-all ${
                    layout === l.key
                      ? 'text-af-accent bg-af-accent-subtle'
                      : 'text-af-text-tertiary hover:text-af-text-secondary hover:bg-af-bg-hover'
                  }`}
                >
                  {l.icon}
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
            {/* More Layouts dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen((o) => !o)}
                className={`flex items-center gap-[5px] px-3 py-[5px] text-[11px] font-medium border border-l-0 border-af-border-subtle rounded-r-md transition-all ${
                  isMoreActive || moreOpen
                    ? 'text-af-accent bg-af-accent-subtle border-af-accent/30'
                    : 'text-af-text-tertiary bg-af-bg-tertiary hover:text-af-text-secondary hover:bg-af-bg-hover'
                }`}
              >
                {isMoreActive ? (
                  <span className="font-semibold">
                    {moreLayouts.find((l) => l.key === layout)?.label}
                  </span>
                ) : (
                  <span>More</span>
                )}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className={`transition-transform duration-150 ${moreOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </button>
              {moreOpen && (
                <div className="absolute top-full right-0 mt-1 w-[160px] bg-af-bg-elevated border border-af-border-default rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                  {moreLayouts.map((l) => (
                    <button
                      key={l.key}
                      onClick={() => { onLayoutChange(l.key); setMoreOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-[7px] text-[11px] font-medium transition-all ${
                        layout === l.key
                          ? 'text-af-accent bg-af-accent-subtle'
                          : 'text-af-text-secondary hover:text-af-text-primary hover:bg-af-bg-hover'
                      }`}
                    >
                      {l.icon}
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <div className="text-[11px] text-af-text-tertiary px-1.5">
          <span className="text-af-text-primary font-semibold">{variationCount}</span> variations
        </div>
        <button
          onClick={onDownloadCurrent}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3.5 py-[6px] border border-af-border-default rounded-md bg-af-bg-tertiary text-af-text-secondary text-[11.5px] font-medium hover:border-af-border-bright hover:text-af-text-primary hover:bg-af-bg-hover transition-all disabled:opacity-50 whitespace-nowrap"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 2v8M8 10L5 7M8 10l3-3M3 13h10" />
          </svg>
          Download Current
        </button>
        <button
          onClick={onDownloadAll}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3.5 py-[6px] rounded-md bg-af-accent border border-af-accent text-white text-[11.5px] font-medium hover:bg-af-accent-hover hover:border-af-accent-hover transition-all disabled:opacity-50 whitespace-nowrap"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 2v8M8 10L5 7M8 10l3-3M3 13h10" />
          </svg>
          Download All ZIP
        </button>
      </div>
    </header>
  );
}
