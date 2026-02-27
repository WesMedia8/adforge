'use client';

// ============================================
// AdForge — Framework Selector Component
// Visual card picker for copywriting frameworks
// ============================================

import React, { useState } from 'react';
import { CopyFramework } from '@/lib/types';

interface FrameworkSelectorProps {
  value: CopyFramework | null;
  onChange: (framework: CopyFramework) => void;
}

const FRAMEWORKS: Array<{
  key: CopyFramework;
  name: string;
  tagline: string;
  structure: string[];
  color: string;
  bgAlpha: string;
  borderAlpha: string;
  description: string;
  bestFor: string;
}> = [
  {
    key: 'PAS',
    name: 'PAS',
    tagline: 'Problem → Agitate → Solution',
    structure: ['Problem', 'Agitate', 'Solution'],
    color: '#ff5577',
    bgAlpha: 'rgba(255,51,85,0.08)',
    borderAlpha: 'rgba(255,51,85,0.2)',
    description: 'Identify the pain point, amplify the frustration, then present your product as the rescue.',
    bestFor: 'Pain-point-driven products, problem-aware audiences',
  },
  {
    key: 'AIDA',
    name: 'AIDA',
    tagline: 'Attention → Interest → Desire → Action',
    structure: ['Attention', 'Interest', 'Desire', 'Action'],
    color: '#3399ff',
    bgAlpha: 'rgba(0,102,255,0.08)',
    borderAlpha: 'rgba(0,102,255,0.2)',
    description: 'Classic funnel formula: hook attention, build interest, create desire, drive action.',
    bestFor: 'Cold audiences, brand awareness campaigns',
  },
  {
    key: 'EPIC',
    name: 'EPIC',
    tagline: 'Engage → Problem → Inform → Call',
    structure: ['Engage', 'Problem', 'Inform', 'Call-to-Action'],
    color: '#aa66ff',
    bgAlpha: 'rgba(153,51,255,0.08)',
    borderAlpha: 'rgba(153,51,255,0.2)',
    description: 'Start with engagement, surface the problem, inform with solutions, end with a clear CTA.',
    bestFor: 'Educational content, SaaS products',
  },
  {
    key: '4Ps',
    name: '4 Ps',
    tagline: 'Promise → Picture → Proof → Push',
    structure: ['Promise', 'Picture', 'Proof', 'Push'],
    color: '#ff9900',
    bgAlpha: 'rgba(255,153,0,0.08)',
    borderAlpha: 'rgba(255,153,0,0.2)',
    description: 'Make a bold promise, paint the vision, back it with proof, push them to act.',
    bestFor: 'High-ticket offers, conversion campaigns',
  },
  {
    key: 'BAB',
    name: 'BAB',
    tagline: 'Before → After → Bridge',
    structure: ['Before', 'After', 'Bridge'],
    color: '#00cc66',
    bgAlpha: 'rgba(0,204,102,0.08)',
    borderAlpha: 'rgba(0,204,102,0.2)',
    description: "Show where the customer is now, where they could be, and your product as the bridge.",
    bestFor: 'Transformation products, fitness, finance',
  },
  {
    key: '4Cs',
    name: '4 Cs',
    tagline: 'Clear → Concise → Compelling → Credible',
    structure: ['Clear', 'Concise', 'Compelling', 'Credible'],
    color: '#ddcc00',
    bgAlpha: 'rgba(255,221,0,0.08)',
    borderAlpha: 'rgba(255,221,0,0.2)',
    description: 'Ensure messaging is crystal clear, to the point, emotionally compelling, and credible.',
    bestFor: 'B2B, professional services, trust-building',
  },
];

export default function FrameworkSelector({ value, onChange }: FrameworkSelectorProps) {
  const [expanded, setExpanded] = useState<CopyFramework | null>(null);

  return (
    <div className="flex flex-col gap-0">
      {/* Section label */}
      <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-af-border-subtle shrink-0">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-af-accent">
          <path d="M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zm2 3v6h2V5H5zm4 0v6h2V5H9z" />
        </svg>
        <span className="text-[10.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.08em]">
          Copy Framework
        </span>
        {value && (
          <span
            className="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded"
            style={{
              background: FRAMEWORKS.find((f) => f.key === value)?.bgAlpha,
              color: FRAMEWORKS.find((f) => f.key === value)?.color,
              border: `1px solid ${FRAMEWORKS.find((f) => f.key === value)?.borderAlpha}`,
            }}
          >
            {value}
          </span>
        )}
      </div>

      {/* Framework cards */}
      <div className="flex flex-col gap-0 overflow-y-auto" style={{ maxHeight: 340 }}>
        {FRAMEWORKS.map((fw) => {
          const isSelected = value === fw.key;
          const isExpanded = expanded === fw.key;

          return (
            <div
              key={fw.key}
              className="border-b border-af-border-subtle last:border-b-0 transition-all"
              style={{
                background: isSelected ? fw.bgAlpha : 'transparent',
              }}
            >
              {/* Main row */}
              <div
                className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer select-none"
                onClick={() => onChange(fw.key)}
              >
                {/* Selection indicator */}
                <div
                  className="w-[14px] h-[14px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                  style={{
                    borderColor: isSelected ? fw.color : 'var(--border-default)',
                    background: isSelected ? fw.color : 'transparent',
                  }}
                >
                  {isSelected && (
                    <svg width="7" height="7" viewBox="0 0 8 8" fill="white">
                      <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                {/* Badge */}
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
                  style={{
                    background: isSelected ? fw.bgAlpha : 'var(--bg-tertiary)',
                    color: isSelected ? fw.color : 'var(--text-tertiary)',
                    border: `1px solid ${isSelected ? fw.borderAlpha : 'var(--border-default)'}`,
                    minWidth: 28,
                    textAlign: 'center',
                  }}
                >
                  {fw.name}
                </span>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[11px] font-medium truncate"
                    style={{ color: isSelected ? fw.color : 'var(--text-secondary)' }}
                  >
                    {fw.tagline}
                  </div>
                </div>

                {/* Expand button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(isExpanded ? null : fw.key);
                  }}
                  className="w-[20px] h-[20px] flex items-center justify-center text-af-text-tertiary hover:text-af-text-primary transition-all shrink-0"
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className={`transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </button>
              </div>

              {/* Expanded detail */}
              {isExpanded && (() => {
                return (
                  <div
                    className="px-3.5 pb-3 flex flex-col gap-2"
                    style={{ borderTop: `1px solid ${fw.borderAlpha}`, background: fw.bgAlpha }}
                  >
                    {/* Structure */}
                    <div className="flex items-center gap-1 pt-2.5">
                      {fw.structure.map((step, i) => (
                        <React.Fragment key={step}>
                          <span
                            className="text-[9.5px] font-semibold px-1.5 py-[2px] rounded"
                            style={{ background: fw.bgAlpha, color: fw.color, border: `1px solid ${fw.borderAlpha}` }}
                          >
                            {step}
                          </span>
                          {i < fw.structure.length - 1 && (
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" style={{ color: fw.color, opacity: 0.5 }}>
                              <path d="M2 4h4M4 2l2 2-2 2" />
                            </svg>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-[10px] text-af-text-secondary leading-[1.5]">{fw.description}</p>

                    {/* Best for */}
                    <div className="flex items-center gap-1.5">
                      <svg width="9" height="9" viewBox="0 0 16 16" fill="currentColor" style={{ color: fw.color }}>
                        <path d="M8 1l2 4 4.5.7-3.2 3.2.8 4.6L8 11.3 3.9 13.5l.8-4.6L1.5 5.7 6 5z" />
                      </svg>
                      <span className="text-[9.5px] text-af-text-tertiary">{fw.bestFor}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
