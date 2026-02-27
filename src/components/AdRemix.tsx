// ============================================
// AdForge — AdRemix Modal Component
// ============================================

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { CompetitorAd, RemixedAd, RemixRequest } from '@/lib/competitor-types';

// ---- Spinner ----
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ---- Copy Button ----
function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-medium bg-af-bg-tertiary border border-af-border-default text-af-text-secondary hover:text-af-text-primary hover:border-af-border-bright transition-all"
    >
      {copied ? (
        <>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#00cc66" strokeWidth="2">
            <path d="M2 8l4 4 8-8" />
          </svg>
          <span style={{ color: '#00cc66' }}>Copied!</span>
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="5" y="5" width="9" height="9" rx="1.5" />
            <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

// ---- Framework & Hook badges ----
const FRAMEWORK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PAS:     { bg: 'rgba(255,51,85,0.12)',   text: '#ff5577',  border: 'rgba(255,51,85,0.25)' },
  AIDA:    { bg: 'rgba(0,102,255,0.12)',   text: '#3399ff',  border: 'rgba(0,102,255,0.25)' },
  BAB:     { bg: 'rgba(0,204,102,0.12)',   text: '#00cc66',  border: 'rgba(0,204,102,0.25)' },
  EPIC:    { bg: 'rgba(153,51,255,0.12)',  text: '#aa66ff',  border: 'rgba(153,51,255,0.25)' },
  FOUR_Ps: { bg: 'rgba(255,153,0,0.12)',   text: '#ff9900',  border: 'rgba(255,153,0,0.25)' },
  '4Cs':  { bg: 'rgba(255,221,0,0.12)',   text: '#ddcc00',  border: 'rgba(255,221,0,0.25)' },
};

const HOOK_LABELS: Record<string, string> = {
  question:      'Question Hook',
  statistic:     'Stat Hook',
  story:         'Story Hook',
  direct_benefit:'Benefit Hook',
  contrarian:    'Contrarian Hook',
  social_proof:  'Social Proof Hook',
};

// ---- Props ----
interface AdRemixProps {
  ad: CompetitorAd;
  onClose: () => void;
  onAppendVariations: (data: Array<{ headline: string; subtext: string }>) => void;
  onSwitchToEditor: () => void;
}

// ---- Component ----
export default function AdRemix({
  ad,
  onClose,
  onAppendVariations,
  onSwitchToEditor,
}: AdRemixProps) {
  const [brandName, setBrandName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [tone, setTone] = useState<RemixRequest['tone']>('professional');
  const [framework, setFramework] = useState<RemixRequest['framework']>('auto');

  const [loading, setLoading] = useState(false);
  const [remixes, setRemixes] = useState<RemixedAd[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleRemix = useCallback(async () => {
    if (!brandName.trim() || !productDescription.trim()) return;
    setLoading(true);
    setError(null);
    setRemixes([]);

    try {
      const res = await fetch('/api/remix-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalAd: ad,
          brandName: brandName.trim(),
          productDescription: productDescription.trim(),
          tone,
          framework,
        } satisfies RemixRequest),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Remix failed. Please try again.');
        return;
      }
      setRemixes(data.remixes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, [ad, brandName, productDescription, tone, framework]);

  const handleUseInEditor = useCallback(
    (remix: RemixedAd) => {
      onAppendVariations([{ headline: remix.headline, subtext: remix.body }]);
      onSwitchToEditor();
      onClose();
    },
    [onAppendVariations, onSwitchToEditor, onClose]
  );

  const TONES: Array<{ value: RemixRequest['tone']; label: string }> = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'playful', label: 'Playful' },
    { value: 'bold', label: 'Bold' },
  ];

  const FRAMEWORKS: Array<{ value: RemixRequest['framework']; label: string }> = [
    { value: 'auto', label: 'Auto-detect' },
    { value: 'PAS', label: 'PAS' },
    { value: 'AIDA', label: 'AIDA' },
    { value: 'BAB', label: 'BAB' },
    { value: 'EPIC', label: 'EPIC' },
    { value: 'FOUR_Ps', label: '4 Ps' },
    { value: '4Cs', label: '4 Cs' },
  ];

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card */}
      <div
        className="relative bg-af-bg-secondary border border-af-border-default rounded-lg flex flex-col overflow-hidden"
        style={{ width: '100%', maxWidth: 820, maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-af-border-subtle flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* Remix icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-af-accent">
              <path d="M2 4h7a5 5 0 010 10H4M2 4l3-3M2 4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
            </svg>
            <h2 className="text-[15px] font-semibold text-af-text-primary">AI Remix</h2>
            <span className="text-[10px] font-medium text-af-text-tertiary bg-af-bg-tertiary border border-af-border-default rounded px-2 py-0.5">
              Competitor → Your Brand
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded text-af-text-tertiary hover:text-af-text-primary hover:bg-af-bg-tertiary transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-[1fr_1fr] gap-0 divide-x divide-af-border-subtle min-h-0">

            {/* Left: Input panel */}
            <div className="p-5 flex flex-col gap-4">
              {/* Original ad preview */}
              <div>
                <label className="block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-2">
                  Original Ad
                </label>
                <div className="bg-af-bg-tertiary border border-af-border-subtle rounded-md p-3">
                  <p className="text-[11px] font-semibold text-af-text-secondary mb-1">{ad.pageName}</p>
                  <p className="text-[11px] text-af-text-tertiary leading-relaxed line-clamp-4">
                    {ad.creativeBody}
                  </p>
                  <p className="text-[11px] text-af-text-secondary mt-2 font-medium">{ad.headline}</p>
                </div>
              </div>

              {/* Brand name */}
              <div>
                <label className="block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5">
                  Your Brand Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. AdForge, NovaSkin, FlowDesk..."
                  className="w-full bg-af-bg-tertiary border border-af-border-default rounded-md text-af-text-primary text-[13px] px-3 py-2.5 outline-none focus:border-af-accent transition-colors"
                />
              </div>

              {/* Product description */}
              <div>
                <label className="block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5">
                  Product / Service Description
                </label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  rows={3}
                  placeholder="e.g. AI-powered Facebook ad generator for e-commerce brands..."
                  className="w-full bg-af-bg-tertiary border border-af-border-default rounded-md text-af-text-primary text-[12px] px-3 py-2.5 outline-none focus:border-af-accent resize-none transition-colors leading-relaxed"
                />
              </div>

              {/* Tone */}
              <div>
                <label className="block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5">
                  Tone
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TONES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setTone(value)}
                      className="px-2.5 py-1 rounded text-[11px] font-medium transition-all border"
                      style={{
                        background: tone === value ? 'rgba(0,102,255,0.12)' : 'var(--bg-tertiary)',
                        color: tone === value ? '#3399ff' : 'var(--text-tertiary)',
                        borderColor: tone === value ? 'rgba(0,102,255,0.3)' : 'var(--border-default)',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Framework */}
              <div>
                <label className="block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5">
                  Framework
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FRAMEWORKS.map(({ value, label }) => {
                    const cfg = FRAMEWORK_COLORS[value];
                    const isActive = framework === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setFramework(value)}
                        className="px-2.5 py-1 rounded text-[11px] font-medium transition-all border"
                        style={
                          isActive && cfg
                            ? { background: cfg.bg, color: cfg.text, borderColor: cfg.border }
                            : isActive
                            ? { background: 'rgba(0,102,255,0.12)', color: '#3399ff', borderColor: 'rgba(0,102,255,0.3)' }
                            : { background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)', borderColor: 'var(--border-default)' }
                        }
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={handleRemix}
                disabled={loading || !brandName.trim() || !productDescription.trim()}
                className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-md text-[12px] font-semibold bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all disabled:opacity-40"
              >
                {loading ? (
                  <><Spinner /> Remixing…</>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 4h7a5 5 0 010 10H4M2 4l3-3M2 4l3 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Generate Remixes
                  </>
                )}
              </button>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[rgba(255,51,85,0.1)] border border-[rgba(255,51,85,0.2)]">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="#ff3355">
                    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a.75.75 0 110-1.5.75.75 0 010 1.5zM8.75 4.5v4a.75.75 0 01-1.5 0v-4a.75.75 0 011.5 0z" />
                  </svg>
                  <span className="text-[11px] text-[#ff5577]">{error}</span>
                </div>
              )}
            </div>

            {/* Right: Results panel */}
            <div className="p-5 flex flex-col gap-3">
              {remixes.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-af-border-default mb-3">
                    <path d="M3 6h10a7 7 0 010 14H6M3 6l4-4M3 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
                  </svg>
                  <p className="text-[12px] text-af-text-tertiary mb-1">Remixes will appear here</p>
                  <p className="text-[11px] text-af-text-tertiary/50">
                    Fill in your brand info and click Generate
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center h-full py-16">
                  <Spinner />
                  <p className="text-[12px] text-af-text-tertiary mt-3">Analyzing structure & generating remixes…</p>
                </div>
              )}

              {remixes.length > 0 && !loading && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-af-text-tertiary">{remixes.length} remixes generated</span>
                  </div>
                  {remixes.map((remix, i) => {
                    const fwCfg = FRAMEWORK_COLORS[remix.framework] ?? FRAMEWORK_COLORS.PAS;
                    const hookLabel = HOOK_LABELS[remix.hookType] ?? remix.hookType;
                    return (
                      <div
                        key={remix.id}
                        className="bg-af-bg-tertiary border border-af-border-subtle rounded-lg p-4 flex flex-col gap-3"
                      >
                        {/* Tags */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                            style={{ background: fwCfg.bg, color: fwCfg.text, border: `1px solid ${fwCfg.border}` }}
                          >
                            {remix.framework}
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-af-bg-elevated border border-af-border-default text-af-text-tertiary">
                            {hookLabel}
                          </span>
                          <span
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize"
                            style={{ background: 'rgba(0,102,255,0.1)', color: '#3399ff', border: '1px solid rgba(0,102,255,0.2)' }}
                          >
                            {remix.tone}
                          </span>
                          <span className="ml-auto text-[9px] text-af-text-tertiary/50">#{i + 1}</span>
                        </div>

                        {/* Headline */}
                        <div>
                          <label className="block text-[9px] font-semibold text-af-text-tertiary/60 uppercase tracking-[0.06em] mb-1">
                            Headline
                          </label>
                          <p className="text-[12px] font-semibold text-af-text-primary leading-snug">
                            {remix.headline}
                          </p>
                        </div>

                        {/* Body */}
                        <div>
                          <label className="block text-[9px] font-semibold text-af-text-tertiary/60 uppercase tracking-[0.06em] mb-1">
                            Body Copy
                          </label>
                          <p className="text-[11px] text-af-text-secondary leading-relaxed">
                            {remix.body}
                          </p>
                        </div>

                        {/* CTA */}
                        {remix.cta && (
                          <div>
                            <label className="block text-[9px] font-semibold text-af-text-tertiary/60 uppercase tracking-[0.06em] mb-1">
                              CTA
                            </label>
                            <p className="text-[11px] text-af-text-secondary">{remix.cta}</p>
                          </div>
                        )}

                        {/* Why it works */}
                        {remix.whyItWorks && (
                          <div className="border-t border-af-border-subtle pt-2.5">
                            <label className="block text-[9px] font-semibold text-af-text-tertiary/60 uppercase tracking-[0.06em] mb-1">
                              Why It Works
                            </label>
                            <p className="text-[10px] text-af-text-tertiary/70 leading-relaxed italic">
                              {remix.whyItWorks}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                          <CopyButton text={`${remix.headline}\n\n${remix.body}${remix.cta ? `\n\n${remix.cta}` : ''}`} label="Copy All" />
                          <CopyButton text={remix.headline} label="Headline" />
                          <button
                            onClick={() => handleUseInEditor(remix)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-medium bg-af-accent/10 border border-af-accent/20 text-af-accent hover:bg-af-accent/20 transition-all ml-auto"
                          >
                            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M2 8h12M10 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Use in Editor
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
