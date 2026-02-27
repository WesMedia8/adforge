// ============================================
// AdForge — Competitor Ad Spy Component
// ============================================

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { CompetitorAd, SwipeFileEntry, CompetitorSearchParams } from '@/lib/competitor-types';
import AdRemix from './AdRemix';

// ---- Inline icons ----

function IconSearch() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6.5" cy="6.5" r="4.5" />
      <path d="M10 10l3.5 3.5" strokeLinecap="round" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconMessenger() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.862 1.376 5.415 3.533 7.103v3.404l3.199-1.763c.854.236 1.759.365 2.268.365 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.062 12.428l-2.548-2.72-4.97 2.72 5.468-5.803 2.609 2.72 4.909-2.72-5.468 5.803z" />
    </svg>
  );
}

function IconBookmark() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 2h10v13l-5-3-5 3V2z" strokeLinejoin="round" />
    </svg>
  );
}

function IconRemix() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h7a4 4 0 010 8H4M2 4l2.5-2.5M2 4l2.5 2.5" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: '150ms' }}
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ---- Copy-with-toast hook ----

function useCopy() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  }, []);

  return { copiedId, copy };
}

// ---- Status badge ----

function StatusBadge({ status, daysActive }: { status: CompetitorAd['status']; daysActive: number }) {
  const config = {
    winner:  { label: 'Winner',  bg: 'rgba(0,204,102,0.15)',   text: '#00cc66', border: 'rgba(0,204,102,0.3)' },
    testing: { label: 'Testing', bg: 'rgba(255,153,0,0.15)',   text: '#ff9900', border: 'rgba(255,153,0,0.3)' },
    new:     { label: 'New',     bg: 'rgba(100,100,120,0.15)', text: '#8888a0', border: 'rgba(100,100,120,0.3)' },
  };
  const cfg = config[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label} · {daysActive}d
    </span>
  );
}

// ---- Platform badge ----

function PlatformBadge({ platform }: { platform: string }) {
  const map: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    facebook:  { icon: <IconFacebook />,  color: '#3399ff', label: 'FB' },
    instagram: { icon: <IconInstagram />, color: '#e05b8a', label: 'IG' },
    messenger: { icon: <IconMessenger />, color: '#8b5cf6', label: 'MSN' },
  };
  const cfg = map[platform.toLowerCase()];
  if (!cfg) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
      style={{ background: `${cfg.color}18`, color: cfg.color, border: `1px solid ${cfg.color}30` }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ---- Ad Card ----

interface AdCardProps {
  ad: CompetitorAd;
  isSwipeSaved: boolean;
  onSaveToSwipe: (ad: CompetitorAd) => void;
  onRemix: (ad: CompetitorAd) => void;
}

function AdCard({ ad, isSwipeSaved, onSaveToSwipe, onRemix }: AdCardProps) {
  const { copiedId, copy } = useCopy();
  const firstLine = ad.creativeBody.split('\n').find((l) => l.trim()) || ad.creativeBody;

  const startDate = new Date(ad.startTime);
  const dateLabel = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const durationLabel = ad.stopTime
    ? `Ran ${ad.daysActive}d`
    : `${ad.daysActive}d active`;

  // Avatar initials from page name
  const initials = ad.pageName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  const mediaTypeColor: Record<string, string> = {
    image:    '#3399ff',
    video:    '#ff9900',
    carousel: '#aa66ff',
    unknown:  '#5a5a70',
  };

  return (
    <div className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-4 flex flex-col gap-3 hover:border-af-border-bright transition-all group">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Avatar */}
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            {initials || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-af-text-primary truncate">{ad.pageName}</p>
            <p className="text-[10px] text-af-text-tertiary">{dateLabel} · {durationLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <StatusBadge status={ad.status} daysActive={ad.daysActive} />
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{
              background: `${mediaTypeColor[ad.mediaType]}18`,
              color: mediaTypeColor[ad.mediaType],
              border: `1px solid ${mediaTypeColor[ad.mediaType]}30`,
            }}
          >
            {ad.mediaType.charAt(0).toUpperCase() + ad.mediaType.slice(1)}
          </span>
        </div>
      </div>

      {/* Snapshot */}
      {ad.snapshotUrl && (
        <div className="rounded-md overflow-hidden bg-af-bg-tertiary border border-af-border-subtle h-32">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ad.snapshotUrl} alt="Ad snapshot" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Creative body */}
      <div>
        <p className="text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1">Ad Copy</p>
        <p className="text-[12px] text-af-text-secondary leading-relaxed line-clamp-4 whitespace-pre-line">
          {ad.creativeBody}
        </p>
      </div>

      {/* Headline */}
      {ad.headline && (
        <div>
          <p className="text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-0.5">Headline</p>
          <p className="text-[12px] font-semibold text-af-text-primary leading-snug">{ad.headline}</p>
        </div>
      )}

      {/* Link description + CTA */}
      <div className="flex items-start justify-between gap-2">
        {ad.linkDescription && (
          <p className="text-[11px] text-af-text-tertiary leading-relaxed flex-1">{ad.linkDescription}</p>
        )}
        {ad.cta && (
          <span className="flex-shrink-0 text-[10px] font-semibold px-2 py-1 rounded bg-af-bg-elevated border border-af-border-default text-af-text-secondary">
            {ad.cta}
          </span>
        )}
      </div>

      {/* Platforms */}
      {ad.platforms.length > 0 && (
        <div className="flex items-center gap-1.5">
          {ad.platforms.map((p) => <PlatformBadge key={p} platform={p} />)}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-af-border-subtle">
        {/* Copy Hook */}
        <button
          onClick={() => copy(firstLine, `hook-${ad.id}`)}
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-af-bg-tertiary border border-af-border-default text-af-text-secondary hover:text-af-text-primary hover:border-af-border-bright transition-all"
        >
          {copiedId === `hook-${ad.id}` ? (
            <><svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#00cc66" strokeWidth="2"><path d="M2 8l4 4 8-8" /></svg>
            <span style={{ color: '#00cc66' }}>Copied!</span></>
          ) : 'Copy Hook'}
        </button>

        {/* Copy Body */}
        <button
          onClick={() => copy(ad.creativeBody, `body-${ad.id}`)}
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-af-bg-tertiary border border-af-border-default text-af-text-secondary hover:text-af-text-primary hover:border-af-border-bright transition-all"
        >
          {copiedId === `body-${ad.id}` ? (
            <><svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#00cc66" strokeWidth="2"><path d="M2 8l4 4 8-8" /></svg>
            <span style={{ color: '#00cc66' }}>Copied!</span></>
          ) : 'Copy Body'}
        </button>

        {/* Copy CTA */}
        <button
          onClick={() => copy(ad.cta, `cta-${ad.id}`)}
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-af-bg-tertiary border border-af-border-default text-af-text-secondary hover:text-af-text-primary hover:border-af-border-bright transition-all"
        >
          {copiedId === `cta-${ad.id}` ? (
            <><svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#00cc66" strokeWidth="2"><path d="M2 8l4 4 8-8" /></svg>
            <span style={{ color: '#00cc66' }}>Copied!</span></>
          ) : 'Copy CTA'}
        </button>

        {/* Save to Swipe */}
        <button
          onClick={() => onSaveToSwipe(ad)}
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-af-bg-tertiary border border-af-border-default transition-all"
          style={
            isSwipeSaved
              ? { color: '#00cc66', borderColor: 'rgba(0,204,102,0.3)' }
              : { color: 'var(--text-secondary)' }
          }
        >
          <IconBookmark />
          {isSwipeSaved ? 'Saved' : 'Save to Swipe'}
        </button>

        {/* Remix */}
        <button
          onClick={() => onRemix(ad)}
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all ml-auto"
        >
          <IconRemix />
          Remix
        </button>
      </div>
    </div>
  );
}

// ---- Swipe File Panel ----

interface SwipePanelProps {
  entries: SwipeFileEntry[];
  onRemove: (id: string) => void;
  onAddTag: (id: string, tag: string) => void;
  onRemix: (ad: CompetitorAd) => void;
}

function SwipePanel({ entries, onRemove, onAddTag, onRemix }: SwipePanelProps) {
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <svg width="28" height="28" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" className="text-af-border-default mb-2">
          <path d="M3 2h10v13l-5-3-5 3V2z" strokeLinejoin="round" />
        </svg>
        <p className="text-[11px] text-af-text-tertiary">No ads saved to swipe file yet</p>
        <p className="text-[10px] text-af-text-tertiary/50 mt-0.5">Click "Save to Swipe" on any ad card</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry) => (
        <div key={entry.ad.id} className="bg-af-bg-tertiary border border-af-border-subtle rounded-md p-3">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <p className="text-[11px] font-semibold text-af-text-primary">{entry.ad.pageName}</p>
              <p className="text-[10px] text-af-text-tertiary mt-0.5 line-clamp-2">{entry.ad.creativeBody}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => onRemix(entry.ad)}
                className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all"
              >
                <IconRemix />
                Remix
              </button>
              <button
                onClick={() => onRemove(entry.ad.id)}
                className="w-6 h-6 flex items-center justify-center rounded text-af-text-tertiary hover:text-[#ff3355] hover:bg-[rgba(255,51,85,0.1)] transition-all"
              >
                <IconTrash />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {entry.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-af-bg-elevated border border-af-border-default text-af-text-tertiary">
                {tag}
              </span>
            ))}
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tagInputs[entry.ad.id] ?? ''}
                onChange={(e) => setTagInputs((prev) => ({ ...prev, [entry.ad.id]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInputs[entry.ad.id]?.trim()) {
                    onAddTag(entry.ad.id, tagInputs[entry.ad.id].trim());
                    setTagInputs((prev) => ({ ...prev, [entry.ad.id]: '' }));
                  }
                }}
                placeholder="+ tag"
                className="bg-transparent text-[10px] text-af-text-tertiary outline-none w-14 placeholder:text-af-text-tertiary/40"
              />
            </div>
            <span className="text-[9px] text-af-text-tertiary/40 ml-auto">
              Saved {new Date(entry.savedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Main CompetitorSpy Component ----

interface CompetitorSpyProps {
  onAppendVariations: (data: Array<{ headline: string; subtext: string }>) => void;
  onSwitchToEditor: () => void;
}

type SortMode = 'days_active' | 'newest' | 'oldest';

export default function CompetitorSpy({ onAppendVariations, onSwitchToEditor }: CompetitorSpyProps) {
  // Search state
  const [keyword, setKeyword] = useState('');
  const [country, setCountry] = useState('US');
  const [mediaType, setMediaType] = useState<CompetitorSearchParams['mediaType']>('all');
  const [platform, setPlatform] = useState<CompetitorSearchParams['platform']>('all');
  const [activeOnly, setActiveOnly] = useState(false);

  // Results state
  const [loading, setLoading] = useState(false);
  const [ads, setAds] = useState<CompetitorAd[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Sort
  const [sortMode, setSortMode] = useState<SortMode>('days_active');

  // Status filter
  const [statusFilter, setStatusFilter] = useState<'all' | CompetitorAd['status']>('all');

  // Swipe file
  const [swipeFile, setSwipeFile] = useState<SwipeFileEntry[]>([]);
  const [swipeOpen, setSwipeOpen] = useState(false);

  // Remix modal
  const [remixAd, setRemixAd] = useState<CompetitorAd | null>(null);

  // ---- Search ----
  const handleSearch = useCallback(async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch('/api/competitor-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: keyword.trim(), country, mediaType, platform, activeOnly }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Search failed. Please try again.');
        setAds([]);
        return;
      }
      setAds(data.ads);
      setIsMock(data.mock ?? false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error');
      setAds([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, country, mediaType, platform, activeOnly]);

  // ---- Sorted + filtered ads ----
  const displayedAds = useMemo(() => {
    let filtered = statusFilter === 'all' ? ads : ads.filter((a) => a.status === statusFilter);
    return [...filtered].sort((a, b) => {
      if (sortMode === 'days_active') return b.daysActive - a.daysActive;
      if (sortMode === 'newest') return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  }, [ads, sortMode, statusFilter]);

  // ---- Swipe file actions ----
  const handleSaveToSwipe = useCallback((ad: CompetitorAd) => {
    setSwipeFile((prev) => {
      if (prev.some((e) => e.ad.id === ad.id)) return prev;
      return [...prev, { ad, savedAt: new Date().toISOString(), tags: [] }];
    });
    setSwipeOpen(true);
  }, []);

  const handleRemoveFromSwipe = useCallback((id: string) => {
    setSwipeFile((prev) => prev.filter((e) => e.ad.id !== id));
  }, []);

  const handleAddTag = useCallback((adId: string, tag: string) => {
    setSwipeFile((prev) =>
      prev.map((e) =>
        e.ad.id === adId && !e.tags.includes(tag)
          ? { ...e, tags: [...e.tags, tag] }
          : e
      )
    );
  }, []);

  const swipedIds = useMemo(() => new Set(swipeFile.map((e) => e.ad.id)), [swipeFile]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: ads.length, winner: 0, testing: 0, new: 0 };
    for (const ad of ads) counts[ad.status] = (counts[ad.status] || 0) + 1;
    return counts;
  }, [ads]);

  const COUNTRIES = [
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'SE', label: 'Sweden' },
    { value: 'IN', label: 'India' },
    { value: 'BR', label: 'Brazil' },
  ];

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden bg-af-bg-primary">
        <div className="flex-1 overflow-y-auto">

          {/* ---- Search Header ---- */}
          <div className="bg-af-bg-secondary border-b border-af-border-subtle px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              {/* Eye icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-af-accent">
                <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" />
                <circle cx="8" cy="8" r="2.5" />
              </svg>
              <h2 className="text-[15px] font-semibold text-af-text-primary">Competitor Ad Spy</h2>
              {isMock && hasSearched && (
                <span className="text-[10px] font-medium text-af-text-tertiary bg-af-bg-tertiary border border-af-border-default rounded px-2 py-0.5">
                  Demo Data
                </span>
              )}
            </div>

            <p className="text-[12px] text-af-text-tertiary mb-4 max-w-[680px] leading-relaxed">
              Search competitor ads from the Meta Ad Library. Spot winning creatives, save to your swipe file, and remix them for your brand.
            </p>

            {/* Search row */}
            <div className="flex flex-col gap-3 max-w-[900px]">
              {/* Keyword + Search button */}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5">
                    Brand / Keyword
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-af-text-tertiary">
                      <IconSearch />
                    </div>
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !loading) handleSearch(); }}
                      placeholder="e.g. fitness supplements, CRM software, skincare..."
                      className="w-full bg-af-bg-tertiary border border-af-border-default rounded-md text-af-text-primary text-[13px] pl-9 pr-3 py-2.5 outline-none focus:border-af-accent transition-colors"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading || !keyword.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-md text-[12px] font-semibold bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all disabled:opacity-40 whitespace-nowrap"
                >
                  {loading ? <><Spinner /> Searching…</> : <><IconSearch /> Search Ads</>}
                </button>
              </div>

              {/* Filter row */}
              <div className="flex flex-wrap gap-3 items-end">
                {/* Country */}
                <div>
                  <label className="block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="bg-af-bg-tertiary border border-af-border-default rounded text-af-text-primary text-[12px] px-2.5 py-2 outline-none cursor-pointer focus:border-af-accent"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Media type */}
                <div>
                  <label className="block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5">Media Type</label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as CompetitorSearchParams['mediaType'])}
                    className="bg-af-bg-tertiary border border-af-border-default rounded text-af-text-primary text-[12px] px-2.5 py-2 outline-none cursor-pointer focus:border-af-accent"
                  >
                    <option value="all">All Types</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="carousel">Carousel</option>
                  </select>
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as CompetitorSearchParams['platform'])}
                    className="bg-af-bg-tertiary border border-af-border-default rounded text-af-text-primary text-[12px] px-2.5 py-2 outline-none cursor-pointer focus:border-af-accent"
                  >
                    <option value="all">All Platforms</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="messenger">Messenger</option>
                  </select>
                </div>

                {/* Active only toggle */}
                <div>
                  <label className="block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5">Status</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="relative inline-flex w-[30px] h-[16px]">
                      <input
                        type="checkbox"
                        checked={activeOnly}
                        onChange={(e) => setActiveOnly(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="toggle-slider" />
                    </span>
                    <span className="text-[12px] text-af-text-secondary">Active Only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[rgba(255,51,85,0.1)] border border-[rgba(255,51,85,0.2)] mt-3 max-w-[680px]">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#ff3355">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a.75.75 0 110-1.5.75.75 0 010 1.5zM8.75 4.5v4a.75.75 0 01-1.5 0v-4a.75.75 0 011.5 0z" />
                </svg>
                <span className="text-[12px] text-[#ff5577]">{error}</span>
              </div>
            )}
          </div>

          {/* ---- Results Section ---- */}
          {hasSearched && !loading && (
            <div className="px-6 py-5">
              {ads.length > 0 && (
                <>
                  {/* Results toolbar */}
                  <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                    {/* Status filters */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(['all', 'winner', 'testing', 'new'] as const).map((s) => {
                        const labelMap = { all: 'All', winner: 'Winners', testing: 'Testing', new: 'New' };
                        const colorMap = {
                          all:     { active: { bg: 'rgba(0,102,255,0.12)', text: '#3399ff', border: 'rgba(0,102,255,0.3)' } },
                          winner:  { active: { bg: 'rgba(0,204,102,0.12)', text: '#00cc66', border: 'rgba(0,204,102,0.3)' } },
                          testing: { active: { bg: 'rgba(255,153,0,0.12)',  text: '#ff9900', border: 'rgba(255,153,0,0.3)' } },
                          new:     { active: { bg: 'rgba(100,100,120,0.12)', text: '#8888a0', border: 'rgba(100,100,120,0.3)' } },
                        };
                        const isActive = statusFilter === s;
                        const cfg = colorMap[s].active;
                        return (
                          <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className="px-2.5 py-1 rounded text-[11px] font-medium transition-all border"
                            style={
                              isActive
                                ? { background: cfg.bg, color: cfg.text, borderColor: cfg.border }
                                : { background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)', borderColor: 'var(--border-default)' }
                            }
                          >
                            {labelMap[s]}
                            <span className="ml-1 opacity-60">{statusCounts[s]}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-af-text-tertiary">Sort:</span>
                      <select
                        value={sortMode}
                        onChange={(e) => setSortMode(e.target.value as SortMode)}
                        className="bg-af-bg-tertiary border border-af-border-default rounded text-af-text-secondary text-[11px] px-2 py-1 outline-none cursor-pointer"
                      >
                        <option value="days_active">Days Active</option>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                      </select>
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayedAds.map((ad) => (
                      <AdCard
                        key={ad.id}
                        ad={ad}
                        isSwipeSaved={swipedIds.has(ad.id)}
                        onSaveToSwipe={handleSaveToSwipe}
                        onRemix={setRemixAd}
                      />
                    ))}
                  </div>
                </>
              )}

              {ads.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <svg width="32" height="32" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" className="text-af-border-default mb-3">
                    <circle cx="6.5" cy="6.5" r="4.5" />
                    <path d="M10 10l3.5 3.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-[12px] text-af-text-tertiary">No ads found for this search</p>
                  <p className="text-[11px] text-af-text-tertiary/50 mt-1">Try a different keyword or adjust your filters</p>
                </div>
              )}
            </div>
          )}

          {!hasSearched && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg width="40" height="40" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" className="text-af-border-default mb-4">
                <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" />
                <circle cx="8" cy="8" r="2.5" />
              </svg>
              <p className="text-[13px] text-af-text-tertiary mb-1">Enter a brand or keyword to spy on competitor ads</p>
              <p className="text-[11px] text-af-text-tertiary/50">Pulls from the Meta Ad Library — no login required</p>
            </div>
          )}

        </div>
      </div>

      {/* Swipe file drawer */}
      {swipeOpen && (
        <div
          className="fixed inset-y-0 right-0 z-40 flex flex-col bg-af-bg-secondary border-l border-af-border-subtle"
          style={{ width: 340 }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-af-border-subtle flex-shrink-0">
            <div className="flex items-center gap-2">
              <IconBookmark />
              <span className="text-[13px] font-semibold text-af-text-primary">Swipe File</span>
              <span className="text-[11px] text-af-text-tertiary bg-af-bg-tertiary border border-af-border-default rounded px-1.5 py-0.5">
                {swipeFile.length}
              </span>
            </div>
            <button
              onClick={() => setSwipeOpen(false)}
              className="w-6 h-6 flex items-center justify-center rounded text-af-text-tertiary hover:text-af-text-primary hover:bg-af-bg-tertiary transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <SwipePanel
              entries={swipeFile}
              onRemove={handleRemoveFromSwipe}
              onAddTag={handleAddTag}
              onRemix={setRemixAd}
            />
          </div>
        </div>
      )}

      {/* Remix modal */}
      {remixAd && (
        <AdRemix
          ad={remixAd}
          onClose={() => setRemixAd(null)}
          onAppendVariations={onAppendVariations}
          onSwitchToEditor={onSwitchToEditor}
        />
      )}
    </>
  );
}
