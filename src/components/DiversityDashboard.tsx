'use client';

// ============================================
// AdForge — Diversity Dashboard Component
// Shows creative diversity score for a batch of ads
// ============================================

import React, { useMemo } from 'react';
import { Variation, TemplateSettings, LayoutType } from '@/lib/types';

interface DiversityDashboardProps {
  variations: Variation[];
  settings: TemplateSettings;
  layout: LayoutType;
}

type DimensionScore = {
  name: string;
  score: number;
  detail: string;
  color: string;
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function avgPairwiseDiversity(items: string[][]): number {
  if (items.length < 2) return 1;
  let total = 0;
  let count = 0;
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      total += 1 - jaccardSimilarity(items[i], items[j]);
      count++;
    }
  }
  return count === 0 ? 1 : total / count;
}

function getLengthCategory(text: string): string {
  const words = tokenize(text).length;
  if (words <= 5) return 'short';
  if (words <= 12) return 'medium';
  return 'long';
}

function getSentimentCategory(text: string): string {
  const positive = /\b(best|top|amazing|incredible|powerful|boost|grow|win|love|fast|easy|free|save|profit|success|proven|trusted|now|today)\b/i.test(text);
  const negative = /\b(stop|avoid|never|without|no more|tired|struggle|problem|fail|losing|waste|risk|fear)\b/i.test(text);
  if (positive && !negative) return 'positive';
  if (negative && !positive) return 'negative';
  if (negative && positive) return 'contrast';
  return 'neutral';
}

function getStartWord(text: string): string {
  return tokenize(text)[0] ?? '';
}

export default function DiversityDashboard({
  variations,
  settings,
  layout,
}: DiversityDashboardProps) {
  const dimensions = useMemo((): DimensionScore[] => {
    if (variations.length < 2) {
      return [
        { name: 'Vocabulary', score: 0, detail: 'Need 2+ variations', color: '#5a5a70' },
        { name: 'Structure',  score: 0, detail: 'Need 2+ variations', color: '#5a5a70' },
        { name: 'Tone',       score: 0, detail: 'Need 2+ variations', color: '#5a5a70' },
        { name: 'Length Mix', score: 0, detail: 'Need 2+ variations', color: '#5a5a70' },
        { name: 'Hook Style', score: 0, detail: 'Need 2+ variations', color: '#5a5a70' },
      ];
    }

    const headlines = variations.map((v) => tokenize(v.headline));
    const subtexts  = variations.map((v) => tokenize(v.subtext));
    const combined  = variations.map((v) => tokenize(v.headline + ' ' + v.subtext));

    // 1. Vocabulary diversity
    const vocabScore = Math.round(
      ((avgPairwiseDiversity(headlines) * 0.6 + avgPairwiseDiversity(subtexts) * 0.4)) * 100
    );

    // 2. Structural diversity (sentence openings & phrase patterns)
    const openings = variations.map((v) => [
      getStartWord(v.headline),
      getStartWord(v.subtext),
    ]);
    const structScore = Math.round(avgPairwiseDiversity(openings) * 100);

    // 3. Tone diversity
    const tones = variations.map((v) => getSentimentCategory(v.headline + ' ' + v.subtext));
    const uniqueTones = new Set(tones).size;
    const toneScore = Math.min(100, Math.round((uniqueTones / Math.max(variations.length, 1)) * 100 * 1.5));

    // 4. Length mix
    const headlineLengths = variations.map((v) => getLengthCategory(v.headline));
    const subtextLengths  = variations.map((v) => getLengthCategory(v.subtext));
    const uniqueHLen = new Set(headlineLengths).size;
    const uniqueSLen = new Set(subtextLengths).size;
    const lengthScore = Math.min(100, Math.round(
      ((uniqueHLen / 3 + uniqueSLen / 3) / 2) * 100
    ));

    // 5. Hook style (first word of headline variety)
    const startWords = variations.map((v) => [getStartWord(v.headline)]);
    const hookScore = Math.round(avgPairwiseDiversity(startWords) * 100);

    const scoreToColor = (s: number) => {
      if (s >= 70) return '#00cc66';
      if (s >= 40) return '#ff9900';
      return '#ff3355';
    };

    const toneDetail = () => {
      const counts: Record<string, number> = {};
      for (const t of tones) counts[t] = (counts[t] || 0) + 1;
      return Object.entries(counts)
        .map(([t, c]) => `${c}× ${t}`)
        .join(', ');
    };

    const lengthDetail = () => {
      const counts: Record<string, number> = {};
      for (const l of headlineLengths) counts[l] = (counts[l] || 0) + 1;
      return Object.entries(counts)
        .map(([l, c]) => `${c}× ${l}`)
        .join(', ');
    };

    return [
      {
        name: 'Vocabulary',
        score: vocabScore,
        detail: `${vocabScore >= 70 ? 'Strong' : vocabScore >= 40 ? 'Moderate' : 'Weak'} word variety`,
        color: scoreToColor(vocabScore),
      },
      {
        name: 'Structure',
        score: structScore,
        detail: `${structScore >= 70 ? 'Varied' : structScore >= 40 ? 'Some repetition' : 'Repetitive'} openings`,
        color: scoreToColor(structScore),
      },
      {
        name: 'Tone',
        score: toneScore,
        detail: toneDetail(),
        color: scoreToColor(toneScore),
      },
      {
        name: 'Length Mix',
        score: lengthScore,
        detail: lengthDetail(),
        color: scoreToColor(lengthScore),
      },
      {
        name: 'Hook Style',
        score: hookScore,
        detail: `${hookScore >= 70 ? 'Distinct' : hookScore >= 40 ? 'Overlapping' : 'Similar'} hooks`,
        color: scoreToColor(hookScore),
      },
    ];
  }, [variations]);

  const overallScore = useMemo(() => {
    const valid = dimensions.filter((d) => d.score > 0);
    if (valid.length === 0) return 0;
    return Math.round(valid.reduce((s, d) => s + d.score, 0) / valid.length);
  }, [dimensions]);

  const overallColor =
    overallScore >= 70 ? '#00cc66' :
    overallScore >= 40 ? '#ff9900' : '#ff3355';

  const overallLabel =
    overallScore >= 70 ? 'Strong Diversity' :
    overallScore >= 40 ? 'Moderate Diversity' : 'Low Diversity';

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-af-bg-primary">
      <div className="flex-1 overflow-y-auto p-6">

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-af-accent">
            <circle cx="8" cy="8" r="6" />
            <path d="M8 4v4l3 2" strokeLinecap="round" />
          </svg>
          <h2 className="text-[15px] font-semibold text-af-text-primary">Creative Diversity</h2>
          <span className="text-[10px] text-af-text-tertiary bg-af-bg-tertiary border border-af-border-default rounded px-2 py-0.5">
            {variations.length} variation{variations.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Overall Score */}
        <div
          className="rounded-lg p-5 mb-6 border"
          style={{
            background: `${overallColor}0f`,
            borderColor: `${overallColor}30`,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-af-text-secondary">Overall Score</span>
            <span
              className="text-[28px] font-bold leading-none"
              style={{ color: overallColor }}
            >
              {variations.length < 2 ? '—' : `${overallScore}`}
            </span>
          </div>
          {variations.length >= 2 && (
            <>
              <div className="w-full bg-af-bg-tertiary rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${overallScore}%`, background: overallColor }}
                />
              </div>
              <p className="text-[11px] mt-2" style={{ color: overallColor }}>
                {overallLabel}
              </p>
            </>
          )}
          {variations.length < 2 && (
            <p className="text-[11px] text-af-text-tertiary">
              Add at least 2 variations to see your diversity score.
            </p>
          )}
        </div>

        {/* Dimension Breakdown */}
        <div className="flex flex-col gap-4">
          {dimensions.map((dim) => (
            <div key={dim.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-medium text-af-text-primary">{dim.name}</span>
                <span className="text-[11px]" style={{ color: dim.color }}>
                  {variations.length < 2 ? '—' : `${dim.score}/100`}
                </span>
              </div>
              <div className="w-full bg-af-bg-tertiary rounded-full h-1.5 overflow-hidden mb-1">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: variations.length < 2 ? '0%' : `${dim.score}%`,
                    background: dim.color,
                  }}
                />
              </div>
              <p className="text-[10px] text-af-text-tertiary">{dim.detail}</p>
            </div>
          ))}
        </div>

        {/* Tips */}
        {variations.length >= 2 && overallScore < 70 && (
          <div className="mt-6 p-4 rounded-lg bg-af-bg-secondary border border-af-border-subtle">
            <p className="text-[11px] font-semibold text-af-text-secondary mb-2">Tips to improve diversity:</p>
            <ul className="flex flex-col gap-1.5">
              {overallScore < 50 && (
                <li className="text-[11px] text-af-text-tertiary flex items-start gap-1.5">
                  <span style={{ color: '#ff9900' }}>•</span>
                  Try starting headlines with different words (questions, numbers, verbs, names)
                </li>
              )}
              {dimensions.find((d) => d.name === 'Tone')?.score ?? 0 < 60 && (
                <li className="text-[11px] text-af-text-tertiary flex items-start gap-1.5">
                  <span style={{ color: '#ff9900' }}>•</span>
                  Mix emotional tones: fear-based, aspirational, curiosity, social proof
                </li>
              )}
              {dimensions.find((d) => d.name === 'Length Mix')?.score ?? 0 < 60 && (
                <li className="text-[11px] text-af-text-tertiary flex items-start gap-1.5">
                  <span style={{ color: '#ff9900' }}>•</span>
                  Vary headline length: some short punchy, some medium descriptive
                </li>
              )}
              {dimensions.find((d) => d.name === 'Vocabulary')?.score ?? 0 < 60 && (
                <li className="text-[11px] text-af-text-tertiary flex items-start gap-1.5">
                  <span style={{ color: '#ff9900' }}>•</span>
                  Use synonyms and different power words across variations
                </li>
              )}
            </ul>
          </div>
        )}

        {variations.length >= 2 && overallScore >= 70 && (
          <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(0,204,102,0.08)', border: '1px solid rgba(0,204,102,0.2)' }}>
            <p className="text-[11px] text-[#00cc66] font-medium">
              Great diversity! Your variations are testing meaningfully different creative angles.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
