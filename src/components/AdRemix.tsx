// ============================================
// AdRemix Component
// ============================================

'use client';

import React, { useState } from 'react';

interface RemixVariant {
  id: string;
  style: string;
  headline: string;
  subtext: string;
  cta: string;
  color: string;
  emoji: string;
  score: number;
  tags: string[];
}

const BASE_VARIANTS: RemixVariant[] = [
  {
    id: '1',
    style: 'Minimalist',
    headline: 'Less is More',
    subtext: 'Clean design that converts',
    cta: 'Get Started',
    color: '#1e293b',
    emoji: '◾',
    score: 87,
    tags: ['minimal', 'b2b', 'clean'],
  },
  {
    id: '2',
    style: 'Bold & Energetic',
    headline: 'DOMINATE YOUR MARKET',
    subtext: 'Aggressive growth tactics that work',
    cta: 'CRUSH IT NOW',
    color: '#dc2626',
    emoji: '🔥',
    score: 92,
    tags: ['bold', 'urgent', 'high-energy'],
  },
  {
    id: '3',
    style: 'Trust Builder',
    headline: 'Trusted by 50,000+ Brands',
    subtext: 'Join the community of successful marketers',
    cta: 'Join Now',
    color: '#0f766e',
    emoji: '🤝',
    score: 84,
    tags: ['social-proof', 'trust', 'community'],
  },
  {
    id: '4',
    style: 'Curiosity Hook',
    headline: 'Why Are Your Ads Failing?',
    subtext: 'Discover the #1 mistake 90% of marketers make',
    cta: 'Find Out Now',
    color: '#7c3aed',
    emoji: '🤔',
    score: 95,
    tags: ['curiosity', 'question', 'problem-aware'],
  },
  {
    id: '5',
    style: 'Storytelling',
    headline: 'From $0 to $1M in 90 Days',
    subtext: 'How Sarah grew her business using AdForge',
    cta: 'Read Her Story',
    color: '#b45309',
    emoji: '📖',
    score: 88,
    tags: ['story', 'case-study', 'transformation'],
  },
  {
    id: '6',
    style: 'Data Driven',
    headline: '3.2x Higher ROAS Guaranteed',
    subtext: 'Backed by 2M+ ad performance data points',
    cta: 'See the Data',
    color: '#0369a1',
    emoji: '📊',
    score: 90,
    tags: ['data', 'proof', 'analytical'],
  },
];

const REMIX_AXES = [
  { id: 'tone', label: 'Tone', options: ['Professional', 'Casual', 'Urgent', 'Playful', 'Inspirational'] },
  { id: 'audience', label: 'Audience', options: ['B2B', 'B2C', 'Enterprise', 'SMB', 'Consumer'] },
  { id: 'format', label: 'Format', options: ['Hook', 'Story', 'List', 'Question', 'Statement'] },
  { id: 'length', label: 'Length', options: ['Ultra Short', 'Short', 'Medium', 'Long'] },
];

export default function AdRemix() {
  const [variants, setVariants] = useState<RemixVariant[]>(BASE_VARIANTS);
  const [selectedVariant, setSelectedVariant] = useState<RemixVariant | null>(null);
  const [remixSettings, setRemixSettings] = useState<Record<string, string>>({});
  const [isRemixing, setIsRemixing] = useState(false);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'style'>('score');
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);

  const allTags = Array.from(new Set(variants.flatMap((v) => v.tags)));

  const filteredVariants = variants
    .filter((v) => !filterTag || v.tags.includes(filterTag))
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      return a.style.localeCompare(b.style);
    });

  const handleRemix = async () => {
    if (!selectedVariant) return;
    setIsRemixing(true);
    await new Promise((r) => setTimeout(r, 1500));

    const remixed: RemixVariant = {
      ...selectedVariant,
      id: `remix-${Date.now()}`,
      style: `Remixed ${selectedVariant.style}`,
      headline: `[${remixSettings.tone || 'Optimized'}] ${selectedVariant.headline}`,
      score: Math.min(99, selectedVariant.score + Math.floor(Math.random() * 8)),
      tags: [...selectedVariant.tags, 'remixed'],
    };

    setVariants((prev) => [remixed, ...prev]);
    setSelectedVariant(remixed);
    setIsRemixing(false);
  };

  const toggleCompare = (id: string) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <div className="flex-1 flex gap-4 p-6 overflow-hidden">
      {/* Variant Grid */}
      <div className="flex-1 flex flex-col">
        {/* Controls */}
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-semibold text-white">Ad Variants</h2>
          <span className="text-xs text-gray-500">{filteredVariants.length} variants</span>
          <div className="flex-1" />
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              compareMode
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Compare Mode
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'score' | 'style')}
            className="bg-gray-800 text-gray-300 text-xs rounded-lg px-2 py-1.5 border border-gray-700"
          >
            <option value="score">Sort: Score</option>
            <option value="style">Sort: Style</option>
          </select>
        </div>

        {/* Tags Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setFilterTag(null)}
            className={`text-xs px-2 py-1 rounded-full border transition-colors ${
              !filterTag
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag === filterTag ? null : tag)}
              className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                filterTag === tag
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Compare Bar */}
        {compareMode && compareList.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-3 mb-4 flex items-center gap-3">
            <span className="text-xs text-gray-400">Comparing {compareList.length}/3:</span>
            {compareList.map((id) => {
              const v = variants.find((x) => x.id === id);
              return v ? (
                <span key={id} className="text-xs bg-indigo-900 text-indigo-300 px-2 py-1 rounded">
                  {v.style}
                </span>
              ) : null;
            })}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3 overflow-y-auto">
          {filteredVariants.map((variant) => (
            <div
              key={variant.id}
              onClick={() =>
                compareMode ? toggleCompare(variant.id) : setSelectedVariant(variant)
              }
              className={`relative rounded-xl border p-4 cursor-pointer transition-all ${
                selectedVariant?.id === variant.id && !compareMode
                  ? 'border-indigo-500 bg-gray-800'
                  : compareList.includes(variant.id)
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-800 bg-gray-900 hover:border-gray-700'
              }`}
            >
              {/* Score badge */}
              <div className="absolute top-2 right-2 text-xs font-bold text-emerald-400">
                {variant.score}
              </div>

              {/* Mini preview */}
              <div
                className="w-full h-20 rounded-lg flex flex-col items-center justify-center mb-3"
                style={{ backgroundColor: variant.color }}
              >
                <div className="text-2xl">{variant.emoji}</div>
                <div className="text-white text-xs font-semibold mt-1 px-2 text-center line-clamp-1">
                  {variant.headline}
                </div>
              </div>

              <div className="font-medium text-sm text-white">{variant.style}</div>
              <div className="text-xs text-gray-500 mt-1 line-clamp-1">{variant.subtext}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {variant.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Remix Panel */}
      {selectedVariant && (
        <div className="w-72 bg-gray-900 rounded-xl border border-gray-800 p-4 flex flex-col gap-4 overflow-y-auto">
          <div>
            <h3 className="font-semibold text-white mb-1">Remix: {selectedVariant.style}</h3>
            <div className="text-xs text-gray-500">Score: {selectedVariant.score}/100</div>
          </div>

          {/* Full Preview */}
          <div
            className="rounded-xl p-4 flex flex-col items-center text-center"
            style={{ backgroundColor: selectedVariant.color }}
          >
            <div className="text-3xl mb-2">{selectedVariant.emoji}</div>
            <div className="text-white font-bold text-sm">{selectedVariant.headline}</div>
            <div className="text-white/70 text-xs mt-1">{selectedVariant.subtext}</div>
            <button className="mt-3 bg-white text-gray-900 text-xs font-semibold px-4 py-1.5 rounded-full">
              {selectedVariant.cta}
            </button>
          </div>

          {/* Remix Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Remix Axes</h4>
            {REMIX_AXES.map((axis) => (
              <div key={axis.id}>
                <label className="block text-xs text-gray-500 mb-1">{axis.label}</label>
                <select
                  value={remixSettings[axis.id] || ''}
                  onChange={(e) =>
                    setRemixSettings((prev) => ({ ...prev, [axis.id]: e.target.value }))
                  }
                  className="w-full bg-gray-800 text-white text-xs rounded-lg px-3 py-2 border border-gray-700"
                >
                  <option value="">Keep Original</option>
                  {axis.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={handleRemix}
            disabled={isRemixing}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {isRemixing ? 'Remixing...' : '🎲 Remix Variant'}
          </button>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {selectedVariant.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
