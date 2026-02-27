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

// ---- Types ----
type ToneLabel = 'Urgency' | 'Question' | 'Benefit' | 'Feature' | 'Social Proof' | 'Story' | 'Neutral';
type LengthBucket = 'Short' | 'Medium' | 'Long';
type EmotionLabel = 'Fear' | 'Excitement' | 'Trust' | 'Curiosity' | 'Relief' | 'Pride';

interface VariationMetrics {
  tone: ToneLabel;
  lengthBucket: LengthBucket;
  emotions: EmotionLabel[];
  wordCount: number;
  hasQuestion: boolean;
  hasSocialProof: boolean;
  hasUrgency: boolean;
  hasBenefit: boolean;
}

// ---- Helpers ----
function detectTone(text: string): ToneLabel {
  const lower = text.toLowerCase();
  if (lower.includes('now') || lower.includes('today') || lower.includes('limited') || lower.includes('last chance') || lower.includes('hurry') || lower.includes('expires')) return 'Urgency';
  if (text.includes('?')) return 'Question';
  if (lower.includes('proof') || lower.includes('reviews') || lower.includes('customers') || lower.includes('trusted') || lower.includes('rated') || lower.includes('users')) return 'Social Proof';
  if (lower.includes('because') || lower.includes('story') || lower.includes('imagine') || lower.includes('when i') || lower.includes('before')) return 'Story';
  if (lower.includes('get') || lower.includes('save') || lower.includes('boost') || lower.includes('increase') || lower.includes('reduce') || lower.includes('improve') || lower.includes('grow') || lower.includes('unlock')) return 'Benefit';
  if (lower.includes('feature') || lower.includes('built') || lower.includes('powered') || lower.includes('system') || lower.includes('tool') || lower.includes('platform') || lower.includes('technology')) return 'Feature';
  return 'Neutral';
}

function getLengthBucket(text: string): LengthBucket {
  const words = text.trim().split(/\s+/).length;
  if (words <= 15) return 'Short';
  if (words <= 35) return 'Medium';
  return 'Long';
}

function detectEmotions(text: string): EmotionLabel[] {
  const lower = text.toLowerCase();
  const emotions: EmotionLabel[] = [];
  if (lower.includes('miss') || lower.includes('lose') || lower.includes('risk') || lower.includes('fail') || lower.includes('afraid') || lower.includes('scared') || lower.includes('danger')) emotions.push('Fear');
  if (lower.includes('amazing') || lower.includes('excited') || lower.includes('incredible') || lower.includes('wow') || lower.includes('fantastic') || lower.includes('breakthrough')) emotions.push('Excitement');
  if (lower.includes('guarantee') || lower.includes('proven') || lower.includes('secure') || lower.includes('safe') || lower.includes('reliable') || lower.includes('trusted') || lower.includes('verified')) emotions.push('Trust');
  if (text.includes('?') || lower.includes('wonder') || lower.includes('discover') || lower.includes('secret') || lower.includes('revealed') || lower.includes('hidden')) emotions.push('Curiosity');
  if (lower.includes('relief') || lower.includes('finally') || lower.includes('no more') || lower.includes('stop struggling') || lower.includes('end of') || lower.includes('solve')) emotions.push('Relief');
  if (lower.includes('achieve') || lower.includes('proud') || lower.includes('success') || lower.includes('win') || lower.includes('top') || lower.includes('best') || lower.includes('elite')) emotions.push('Pride');
  return emotions;
}

function analyzeVariation(v: Variation): VariationMetrics {
  const combined = `${v.headline} ${v.subtext}`;
  const lower = combined.toLowerCase();
  return {
    tone: detectTone(combined),
    lengthBucket: getLengthBucket(combined),
    emotions: detectEmotions(combined),
    wordCount: combined.trim().split(/\s+/).length,
    hasQuestion: combined.includes('?'),
    hasSocialProof: lower.includes('proof') || lower.includes('customers') || lower.includes('trusted') || lower.includes('rated'),
    hasUrgency: lower.includes('now') || lower.includes('today') || lower.includes('limited') || lower.includes('last chance'),
    hasBenefit: lower.includes('get') || lower.includes('save') || lower.includes('boost') || lower.includes('grow') || lower.includes('unlock'),
  };
}

// ---- Diversity Score ----
function computeDiversityScore(metrics: VariationMetrics[]): number {
  if (metrics.length <= 1) return metrics.length === 0 ? 0 : 50;

  const tones = new Set(metrics.map((m) => m.tone));
  const lengths = new Set(metrics.map((m) => m.lengthBucket));
  const emotionSet = new Set(metrics.flatMap((m) => m.emotions));

  const toneScore = Math.min(tones.size / 4, 1) * 35;  // max 35 pts from 4+ tones
  const lengthScore = Math.min(lengths.size / 3, 1) * 25; // max 25 pts from 3 lengths
  const emotionScore = Math.min(emotionSet.size / 4, 1) * 25; // max 25 pts from 4+ emotions

  const hasQuestion = metrics.some((m) => m.hasQuestion);
  const hasSocialProof = metrics.some((m) => m.hasSocialProof);
  const hasUrgency = metrics.some((m) => m.hasUrgency);
  const hasBenefit = metrics.some((m) => m.hasBenefit);
  const techniqueScore = ([hasQuestion, hasSocialProof, hasUrgency, hasBenefit].filter(Boolean).length / 4) * 15;

  return Math.round(toneScore + lengthScore + emotionScore + techniqueScore);
}

// ---- Circular Progress Ring ----
function CircularScore({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color =
    score >= 75 ? '#00cc66' :
    score >= 50 ? '#0066FF' :
    score >= 30 ? '#ff9900' :
    '#ff3355';

  return (
    <div className="flex flex-col items-center justify-center shrink-0">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        {/* Track */}
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        {/* Progress */}
        <circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          style={{ transition: 'stroke-dasharray 0.6s ease, stroke 0.4s ease' }}
        />
      </svg>
      <div className="-mt-[68px] flex flex-col items-center">
        <span className="text-[26px] font-bold leading-none" style={{ color }}>{score}</span>
        <span className="text-[9px] text-af-text-tertiary uppercase tracking-[0.07em] mt-0.5">Score</span>
      </div>
    </div>
  );
}

// ---- Mini Bar Chart ----
function MiniBarChart({ data, label }: { data: [string, number][]; label: string }) {
  const max = Math.max(...data.map(([, v]) => v), 1);
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[9.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-0.5">{label}</p>
      {data.map(([name, count]) => (
        <div key={name} className="flex items-center gap-1.5">
          <span className="text-[9px] text-af-text-tertiary w-[70px] truncate shrink-0">{name}</span>
          <div className="flex-1 h-[5px] bg-af-bg-tertiary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-af-accent transition-all duration-500"
              style={{ width: `${(count / max) * 100}%`, opacity: 0.7 + (count / max) * 0.3 }}
            />
          </div>
          <span className="text-[9px] text-af-text-tertiary w-3 text-right shrink-0">{count}</span>
        </div>
      ))}
    </div>
  );
}

// ---- Tip Generator ----
function getTips(metrics: VariationMetrics[], score: number): string[] {
  const tips: string[] = [];
  const tones = new Set(metrics.map((m) => m.tone));
  const lengths = new Set(metrics.map((m) => m.lengthBucket));

  if (score < 40) tips.push('Diversity is low — try varying your messaging angles significantly.');
  if (tones.size < 2) tips.push('All variations use the same tone. Mix in urgency, questions, or social proof.');
  if (!lengths.has('Short')) tips.push('Add at least one punchy short variation (under 15 words).');
  if (!lengths.has('Long')) tips.push('Consider one detailed variation that explains the value in depth.');
  if (!metrics.some((m) => m.hasQuestion)) tips.push('Try adding a question hook to engage curiosity.');
  if (!metrics.some((m) => m.hasSocialProof)) tips.push('Include social proof (customers, ratings, trust indicators).');
  if (!metrics.some((m) => m.hasUrgency)) tips.push('Add urgency to at least one variation (limited time, act now).');
  if (metrics.length < 3) tips.push('Create more variations — 3-5 is ideal for meaningful A/B testing.');

  return tips.slice(0, 3);
}

// ---- Main Component ----
export default function DiversityDashboard({
  variations,
  settings,
  layout,
}: DiversityDashboardProps) {
  const metrics = useMemo(
    () => variations.map(analyzeVariation),
    [variations]
  );

  const score = useMemo(() => computeDiversityScore(metrics), [metrics]);
  const tips = useMemo(() => getTips(metrics, score), [metrics, score]);

  // Tone distribution
  const toneMap = useMemo(() => {
    const m: Record<string, number> = {};
    metrics.forEach((mt) => { m[mt.tone] = (m[mt.tone] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]) as [string, number][];
  }, [metrics]);

  // Length distribution
  const lengthMap = useMemo(() => {
    const m: Record<string, number> = { Short: 0, Medium: 0, Long: 0 };
    metrics.forEach((mt) => { m[mt.lengthBucket]++; });
    return Object.entries(m) as [string, number][];
  }, [metrics]);

  // Emotion distribution
  const emotionMap = useMemo(() => {
    const m: Record<string, number> = {};
    metrics.forEach((mt) => mt.emotions.forEach((e) => { m[e] = (m[e] || 0) + 1; }));
    return Object.entries(m).sort((a, b) => b[1] - a[1]) as [string, number][];
  }, [metrics]);

  const scoreColor =
    score >= 75 ? '#00cc66' :
    score >= 50 ? '#0066FF' :
    score >= 30 ? '#ff9900' :
    '#ff3355';

  const scoreLabel =
    score >= 75 ? 'Excellent' :
    score >= 50 ? 'Good' :
    score >= 30 ? 'Fair' :
    'Low';

  return (
    <div className="bg-af-bg-secondary border border-af-border-subtle rounded-lg overflow-hidden shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-af-border-subtle">
        <div className="flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" className="text-af-accent">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4.5h1.5v4h-1.5v-4zm.75 6.25a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
          <span className="text-[11px] font-semibold text-af-text-primary">Creative Diversity</span>
        </div>
        <span
          className="text-[9.5px] font-semibold px-2 py-0.5 rounded"
          style={{ background: `${scoreColor}18`, color: scoreColor, border: `1px solid ${scoreColor}30` }}
        >
          {scoreLabel}
        </span>
      </div>

      {/* Body */}
      <div className="p-3.5 flex gap-4">
        {/* Score ring */}
        <CircularScore score={score} />

        {/* Right side */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Charts row */}
          <div className="grid grid-cols-3 gap-2">
            <MiniBarChart data={toneMap} label="Tone" />
            <MiniBarChart data={lengthMap} label="Length" />
            <MiniBarChart data={emotionMap.length > 0 ? emotionMap : [['None', 0]]} label="Emotion" />
          </div>

          {/* Tips */}
          {tips.length > 0 && (
            <div className="flex flex-col gap-1">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" className="text-af-accent mt-[1px] shrink-0">
                    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4.5h1.5v4h-1.5v-4zm.75 6.25a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                  </svg>
                  <p className="text-[10px] text-af-text-tertiary leading-[1.4]">{tip}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 border-t border-af-border-subtle">
        {[
          { label: 'Variations', value: variations.length },
          { label: 'Tones', value: new Set(metrics.map((m) => m.tone)).size },
          { label: 'Emotions', value: new Set(metrics.flatMap((m) => m.emotions)).size },
          { label: 'Layout', value: layout.charAt(0).toUpperCase() + layout.slice(1) },
        ].map(({ label, value }) => (
          <div key={label} className="px-3 py-2 text-center border-r last:border-r-0 border-af-border-subtle">
            <div className="text-[13px] font-bold text-af-text-primary">{value}</div>
            <div className="text-[9px] text-af-text-tertiary uppercase tracking-[0.05em]">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
