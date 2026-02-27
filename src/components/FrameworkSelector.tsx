'use client';

// ============================================
// AdForge — Framework Selector Component
// Visual card picker for copywriting frameworks
// ============================================

import React, { useState } from 'react';
import { CopyFramework } from '@/lib/types';

const FRAMEWORKS: Array<{
  id: CopyFramework;
  name: string;
  tagline: string;
  steps: string[];
  color: string;
  description: string;
}> = [
  {
    id: 'PAS',
    name: 'PAS',
    tagline: 'Problem → Agitate → Solve',
    steps: ['Problem', 'Agitate', 'Solution'],
    color: '#ff3366',
    description:
      'Identify the pain point, intensify it, then present your product as the relief. High-converting for pain-driven audiences.',
  },
  {
    id: 'AIDA',
    name: 'AIDA',
    tagline: 'Attention → Interest → Desire → Action',
    steps: ['Attention', 'Interest', 'Desire', 'Action'],
    color: '#0066ff',
    description:
      'Guide the reader from awareness to conversion in four deliberate steps. Classic structure for awareness campaigns.',
  },
  {
    id: 'BAB',
    name: 'BAB',
    tagline: 'Before → After → Bridge',
    steps: ['Before', 'After', 'Bridge'],
    color: '#00cc66',
    description:
      'Show where your audience is now, paint the dream outcome, then position your product as the path between them.',
  },
  {
    id: 'EPIC',
    name: 'EPIC',
    tagline: 'Empathy → Promise → Info → Call',
    steps: ['Empathy', 'Promise', 'Info', 'Call'],
    color: '#9933ff',
    description:
      'Open with empathy, make a bold promise, back it with proof, and end with a clear call to action.',
  },
  {
    id: 'FOUR_Ps',
    name: '4 Ps',
    tagline: 'Promise → Picture → Proof → Push',
    steps: ['Promise', 'Picture', 'Proof', 'Push'],
    color: '#ff9900',
    description:
      'Lead with your promise, paint a vivid picture of the outcome, back it with proof, then push for the action.',
  },
  {
    id: '4Cs',
    name: '4 Cs',
    tagline: 'Clear → Concise → Compelling → Credible',
    steps: ['Clear', 'Concise', 'Compelling', 'Credible'],
    color: '#ddcc00',
    description:
      'A quality-first framework ensuring every word earns its place. Best for premium or trust-sensitive products.',
  },
];

interface FrameworkSelectorProps {
  value: CopyFramework;
  onChange: (framework: CopyFramework) => void;
}

export default function FrameworkSelector({
  value,
  onChange,
}: FrameworkSelectorProps) {
  const [expanded, setExpanded] = useState<CopyFramework | null>(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-af-bg-primary">
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex items-center gap-2 mb-5">
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-af-accent"
          >
            <rect x="2" y="2" width="5" height="5" rx="1" />
            <rect x="9" y="2" width="5" height="5" rx="1" />
            <rect x="2" y="9" width="5" height="5" rx="1" />
            <rect x="9" y="9" width="5" height="5" rx="1" />
          </svg>
          <h2 className="text-[14px] font-semibold text-af-text-primary">
            Copywriting Framework
          </h2>
        </div>

        <div className="flex flex-col gap-2.5">
          {FRAMEWORKS.map((fw) => {
            const isSelected = value === fw.id;
            const isExpanded = expanded === fw.id;

            return (
              <div
                key={fw.id}
                className="rounded-lg border cursor-pointer transition-all overflow-hidden"
                style={{
                  background: isSelected
                    ? `${fw.color}10`
                    : 'var(--bg-secondary)',
                  borderColor: isSelected ? `${fw.color}40` : 'var(--border-subtle)',
                }}
                onClick={() => onChange(fw.id)}
              >
                {/* Card header */}
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Radio circle */}
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      borderColor: isSelected ? fw.color : 'var(--border-default)',
                      background: isSelected ? fw.color : 'transparent',
                    }}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>

                  {/* Name + tagline */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[13px] font-bold"
                        style={{ color: isSelected ? fw.color : 'var(--text-primary)' }}
                      >
                        {fw.name}
                      </span>
                      <span className="text-[10px] text-af-text-tertiary">
                        {fw.tagline}
                      </span>
                    </div>

                    {/* Step pills */}
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {fw.steps.map((step, i) => (
                        <React.Fragment key={step}>
                          <span
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                            style={{
                              background: isSelected
                                ? `${fw.color}20`
                                : 'var(--bg-tertiary)',
                              color: isSelected ? fw.color : 'var(--text-tertiary)',
                            }}
                          >
                            {step}
                          </span>
                          {i < fw.steps.length - 1 && (
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              className="text-af-text-tertiary"
                            >
                              <path d="M2 4h4M4 2l2 2-2 2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Info toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(isExpanded ? null : fw.id);
                    }}
                    className="w-6 h-6 flex items-center justify-center rounded text-af-text-tertiary hover:text-af-text-primary hover:bg-af-bg-tertiary transition-all flex-shrink-0"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'none',
                        transition: '150ms',
                      }}
                    >
                      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {/* Expanded description */}
                {isExpanded && (
                  <div
                    className="px-4 pb-3 text-[11px] text-af-text-tertiary leading-relaxed border-t"
                    style={{ borderColor: `${fw.color}20` }}
                  >
                    <div className="pt-2.5">{fw.description}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div className="mt-5 p-3 rounded-md bg-af-bg-secondary border border-af-border-subtle">
          <p className="text-[10.5px] text-af-text-tertiary leading-relaxed">
            <span className="font-semibold text-af-text-secondary">Tip:</span> Framework affects how AI structures your ad copy. PAS works best for pain-driven products; AIDA for brand awareness; BAB for transformational claims.
          </p>
        </div>

        {/* Current selection summary */}
        {(() => {
          const current = FRAMEWORKS.find((fw) => fw.id === value);
          if (!current) return null;
          return (
            <div
              className="mt-3 p-3 rounded-md border"
              style={{
                background: `${current.color}0a`,
                borderColor: `${current.color}25`,
              }}
            >
              <p className="text-[10.5px] leading-relaxed" style={{ color: current.color }}>
                <span className="font-semibold">{current.name}</span>: {current.description}
              </p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
