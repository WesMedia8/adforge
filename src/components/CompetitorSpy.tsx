// ============================================
// CompetitorSpy Component
// ============================================

'use client';

import React, { useState } from 'react';

interface Ad {
  id: string;
  brand: string;
  headline: string;
  body: string;
  cta: string;
  platform: string;
  format: string;
  spend: string;
  impressions: string;
  engagement: string;
  runningDays: number;
  color: string;
  emoji: string;
  tags: string[];
  angle: string;
}

const MOCK_ADS: Ad[] = [
  {
    id: '1',
    brand: 'ClickFunnels',
    headline: 'Build Your First Funnel in 10 Minutes',
    body: 'No coding required. Drag-and-drop simplicity. Start your free trial today and see why 100,000+ entrepreneurs trust ClickFunnels.',
    cta: 'Start Free Trial',
    platform: 'Facebook',
    format: 'Single Image',
    spend: '$45K–$60K',
    impressions: '2.1M',
    engagement: '4.2%',
    runningDays: 47,
    color: '#1e40af',
    emoji: '🔧',
    tags: ['ease-of-use', 'free-trial', 'social-proof'],
    angle: 'Ease of Use',
  },
  {
    id: '2',
    brand: 'HubSpot',
    headline: 'Your CRM Shouldn\'t Feel Like Work',
    body: 'HubSpot CRM is free forever. Manage contacts, deals, and pipelines without the complexity. 5 million+ companies can\'t be wrong.',
    cta: 'Get HubSpot Free',
    platform: 'LinkedIn',
    format: 'Carousel',
    spend: '$80K–$100K',
    impressions: '3.8M',
    engagement: '3.1%',
    runningDays: 62,
    color: '#ea580c',
    emoji: '🎯',
    tags: ['free', 'b2b', 'social-proof', 'simplicity'],
    angle: 'Free Forever',
  },
  {
    id: '3',
    brand: 'Mailchimp',
    headline: 'Email Marketing That Pays for Itself',
    body: 'Businesses using Mailchimp see 36x ROI on email marketing. Get started with a free plan — no credit card required.',
    cta: 'Try for Free',
    platform: 'Google',
    format: 'Responsive Display',
    spend: '$120K–$150K',
    impressions: '8.2M',
    engagement: '2.8%',
    runningDays: 89,
    color: '#eab308',
    emoji: '📧',
    tags: ['roi', 'free', 'data-driven'],
    angle: 'ROI Focus',
  },
  {
    id: '4',
    brand: 'Semrush',
    headline: 'Your Competitors Are Stealing Your Traffic',
    body: 'See exactly what keywords, backlinks, and ads your competitors are using. 14-day free trial. No credit card needed.',
    cta: 'Start Free Trial',
    platform: 'Facebook',
    format: 'Video',
    spend: '$55K–$70K',
    impressions: '2.9M',
    engagement: '5.1%',
    runningDays: 31,
    color: '#f97316',
    emoji: '🔍',
    tags: ['fomo', 'competitor', 'free-trial', 'data'],
    angle: 'FOMO / Threat',
  },
  {
    id: '5',
    brand: 'Canva',
    headline: 'Design Anything. Publish Everywhere.',
    body: 'From social posts to presentations, Canva makes professional design easy. 250,000+ templates. Free to get started.',
    cta: 'Create for Free',
    platform: 'Instagram',
    format: 'Story Ad',
    spend: '$200K–$250K',
    impressions: '12.4M',
    engagement: '6.3%',
    runningDays: 113,
    color: '#06b6d4',
    emoji: '🎨',
    tags: ['ease-of-use', 'free', 'breadth', 'visual'],
    angle: 'Simplicity + Scale',
  },
  {
    id: '6',
    brand: 'Hootsuite',
    headline: 'Stop Posting Manually. Start Growing.',
    body: 'Schedule, analyze, and engage across all your social channels from one dashboard. Try Hootsuite free for 30 days.',
    cta: 'Start Free Trial',
    platform: 'Twitter',
    format: 'Single Image',
    spend: '$30K–$45K',
    impressions: '1.6M',
    engagement: '2.4%',
    runningDays: 22,
    color: '#0891b2',
    emoji: '🦉',
    tags: ['automation', 'efficiency', 'free-trial'],
    angle: 'Automation / Efficiency',
  },
];

const PLATFORMS = ['All', 'Facebook', 'Instagram', 'LinkedIn', 'Google', 'Twitter'];
const FORMATS = ['All', 'Single Image', 'Carousel', 'Video', 'Story Ad', 'Responsive Display'];

export default function CompetitorSpy() {
  const [ads] = useState<Ad[]>(MOCK_ADS);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [formatFilter, setFormatFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'spend' | 'engagement' | 'days'>('engagement');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [activeView, setActiveView] = useState<'grid' | 'table'>('grid');

  const filteredAds = ads
    .filter((ad) => {
      const matchesSearch =
        !searchQuery ||
        ad.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.tags.some((t) => t.includes(searchQuery.toLowerCase()));
      const matchesPlatform = platformFilter === 'All' || ad.platform === platformFilter;
      const matchesFormat = formatFilter === 'All' || ad.format === formatFilter;
      return matchesSearch && matchesPlatform && matchesFormat;
    })
    .sort((a, b) => {
      if (sortBy === 'engagement') return parseFloat(b.engagement) - parseFloat(a.engagement);
      if (sortBy === 'days') return b.runningDays - a.runningDays;
      return 0;
    });

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex-1 flex gap-4 p-6 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-semibold text-white">Competitor Ad Intelligence</h2>
          <span className="text-xs text-gray-500">{filteredAds.length} ads tracked</span>
          <div className="flex-1" />
          {/* View Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-0.5">
            {(['grid', 'table'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  activeView === view ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <input
            type="text"
            placeholder="Search brands, headlines, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-48 bg-gray-800 text-white text-sm rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500"
          />
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 border border-gray-700"
          >
            {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 border border-gray-700"
          >
            {FORMATS.map((f) => <option key={f}>{f}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'spend' | 'engagement' | 'days')}
            className="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 border border-gray-700"
          >
            <option value="engagement">Sort: Engagement</option>
            <option value="days">Sort: Duration</option>
            <option value="spend">Sort: Spend</option>
          </select>
        </div>

        {/* Ad Grid */}
        {activeView === 'grid' && (
          <div className="grid grid-cols-2 gap-3 overflow-y-auto">
            {filteredAds.map((ad) => (
              <div
                key={ad.id}
                onClick={() => setSelectedAd(ad)}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  selectedAd?.id === ad.id
                    ? 'border-indigo-500 bg-gray-800'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: ad.color }}
                    >
                      {ad.emoji}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">{ad.brand}</div>
                      <div className="text-xs text-gray-500">{ad.platform} · {ad.format}</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(ad.id); }}
                    className={`text-lg ${
                      bookmarked.has(ad.id) ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    ★
                  </button>
                </div>

                <div className="text-sm font-medium text-white mb-1">{ad.headline}</div>
                <div className="text-xs text-gray-400 line-clamp-2 mb-3">{ad.body}</div>

                <div className="flex gap-3 text-xs">
                  <span className="text-emerald-400">{ad.engagement} CTR</span>
                  <span className="text-gray-500">{ad.impressions} impr.</span>
                  <span className="text-gray-500">{ad.runningDays}d running</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {activeView === 'table' && (
          <div className="overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-800">
                  <th className="text-left py-2 pr-4">Brand</th>
                  <th className="text-left py-2 pr-4">Headline</th>
                  <th className="text-left py-2 pr-4">Platform</th>
                  <th className="text-left py-2 pr-4">Engagement</th>
                  <th className="text-left py-2 pr-4">Impressions</th>
                  <th className="text-left py-2 pr-4">Days</th>
                  <th className="text-left py-2">Spend</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.map((ad) => (
                  <tr
                    key={ad.id}
                    onClick={() => setSelectedAd(ad)}
                    className={`border-b border-gray-800 cursor-pointer transition-colors ${
                      selectedAd?.id === ad.id
                        ? 'bg-indigo-900/30'
                        : 'hover:bg-gray-800/50'
                    }`}
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded text-xs flex items-center justify-center"
                          style={{ backgroundColor: ad.color }}
                        >
                          {ad.emoji}
                        </div>
                        <span className="text-white font-medium">{ad.brand}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-300 max-w-48">
                      <div className="truncate">{ad.headline}</div>
                    </td>
                    <td className="py-3 pr-4 text-gray-400">{ad.platform}</td>
                    <td className="py-3 pr-4 text-emerald-400 font-medium">{ad.engagement}</td>
                    <td className="py-3 pr-4 text-gray-400">{ad.impressions}</td>
                    <td className="py-3 pr-4 text-gray-400">{ad.runningDays}</td>
                    <td className="py-3 text-gray-400">{ad.spend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedAd && (
        <div className="w-80 bg-gray-900 rounded-xl border border-gray-800 p-5 overflow-y-auto flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-white">{selectedAd.brand}</h3>
              <div className="text-xs text-gray-500">{selectedAd.platform} · {selectedAd.format}</div>
            </div>
            <button
              onClick={() => toggleBookmark(selectedAd.id)}
              className={`text-xl ${bookmarked.has(selectedAd.id) ? 'text-yellow-400' : 'text-gray-600'}`}
            >
              ★
            </button>
          </div>

          {/* Ad Preview */}
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: selectedAd.color }}
          >
            <div className="text-3xl mb-2">{selectedAd.emoji}</div>
            <div className="text-white font-bold text-sm mb-1">{selectedAd.headline}</div>
            <div className="text-white/70 text-xs mb-3">{selectedAd.body}</div>
            <button className="bg-white text-gray-900 text-xs font-semibold px-4 py-1.5 rounded-full">
              {selectedAd.cta}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Engagement', value: selectedAd.engagement, color: 'text-emerald-400' },
              { label: 'Impressions', value: selectedAd.impressions, color: 'text-blue-400' },
              { label: 'Est. Spend', value: selectedAd.spend, color: 'text-orange-400' },
              { label: 'Running', value: `${selectedAd.runningDays}d`, color: 'text-purple-400' },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                <div className={`font-semibold ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Angle */}
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Primary Angle</div>
            <div className="text-sm text-white font-medium">{selectedAd.angle}</div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {selectedAd.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 rounded-lg transition-colors">
              Clone Ad
            </button>
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 rounded-lg transition-colors">
              Export
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
