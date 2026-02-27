// ============================================
// ConsumerResearch Component
// ============================================

'use client';

import React, { useState } from 'react';

interface ResearchCard {
  id: string;
  category: string;
  insight: string;
  detail: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  volume: number;
  trend: 'up' | 'down' | 'stable';
  tags: string[];
}

interface Persona {
  id: string;
  name: string;
  age: string;
  occupation: string;
  painPoints: string[];
  motivations: string[];
  channels: string[];
  emoji: string;
  color: string;
}

interface TrendData {
  month: string;
  value: number;
}

const MOCK_INSIGHTS: ResearchCard[] = [
  {
    id: '1',
    category: 'Pain Points',
    insight: 'Time is the #1 barrier',
    detail: '78% of SMB marketers cite lack of time as their biggest challenge in creating quality ad content consistently.',
    source: 'Survey of 2,400 marketers',
    sentiment: 'negative',
    volume: 2847,
    trend: 'up',
    tags: ['smb', 'time', 'content-creation'],
  },
  {
    id: '2',
    category: 'Motivations',
    insight: 'ROI transparency drives adoption',
    detail: 'Marketers are 3x more likely to adopt new tools when ROI can be demonstrated within 30 days.',
    source: 'Forrester Research 2024',
    sentiment: 'positive',
    volume: 1923,
    trend: 'up',
    tags: ['roi', 'adoption', 'decision-making'],
  },
  {
    id: '3',
    category: 'Objections',
    insight: 'AI trust gap persists',
    detail: '54% of marketers worry that AI-generated content will feel inauthentic to their audience.',
    source: 'Content Marketing Institute',
    sentiment: 'negative',
    volume: 1456,
    trend: 'stable',
    tags: ['ai-skepticism', 'authenticity', 'trust'],
  },
  {
    id: '4',
    category: 'Behaviors',
    insight: 'Mobile-first content creation rising',
    detail: '63% of social media managers now create or approve content primarily on mobile devices.',
    source: 'Hootsuite State of Social 2024',
    sentiment: 'neutral',
    volume: 3201,
    trend: 'up',
    tags: ['mobile', 'workflow', 'social-media'],
  },
  {
    id: '5',
    category: 'Preferences',
    insight: 'Templates over blank canvas',
    detail: '82% of non-designers prefer starting from a template rather than creating from scratch.',
    source: 'UX Research Panel, n=890',
    sentiment: 'positive',
    volume: 1788,
    trend: 'stable',
    tags: ['templates', 'ux', 'non-designers'],
  },
  {
    id: '6',
    category: 'Trends',
    insight: 'Video ads outperform static 4:1',
    detail: 'Short-form video ads (15-30s) generate 4x more engagement than static image ads across all platforms.',
    source: 'Meta Advertising Report Q3 2024',
    sentiment: 'positive',
    volume: 4502,
    trend: 'up',
    tags: ['video', 'engagement', 'format'],
  },
  {
    id: '7',
    category: 'Pain Points',
    insight: 'Brand consistency nightmare',
    detail: 'Teams with 5+ members report brand inconsistency issues 3x more frequently than solo operators.',
    source: 'Internal survey, 1,200 respondents',
    sentiment: 'negative',
    volume: 987,
    trend: 'up',
    tags: ['brand', 'team', 'consistency'],
  },
  {
    id: '8',
    category: 'Motivations',
    insight: 'Competitive pressure is the trigger',
    detail: '67% of new tool adoptions are triggered by seeing a competitor run more effective campaigns.',
    source: 'G2 Buyer Survey 2024',
    sentiment: 'positive',
    volume: 2134,
    trend: 'up',
    tags: ['competition', 'fomo', 'trigger'],
  },
];

const PERSONAS: Persona[] = [
  {
    id: '1',
    name: 'The Scrappy Founder',
    age: '28–38',
    occupation: 'Startup CEO / Solopreneur',
    painPoints: ['No time', 'No design skills', 'Tight budget'],
    motivations: ['Growth hacking', 'Look professional', 'Beat bigger competitors'],
    channels: ['Instagram', 'LinkedIn', 'TikTok'],
    emoji: '🚀',
    color: '#6366f1',
  },
  {
    id: '2',
    name: 'The Agency PM',
    age: '25–35',
    occupation: 'Marketing Manager at Agency',
    painPoints: ['Client approval cycles', 'Brand inconsistency', 'Scale challenges'],
    motivations: ['Impress clients', 'Faster delivery', 'More margin'],
    channels: ['Facebook', 'Google', 'Display'],
    emoji: '📋',
    color: '#0891b2',
  },
  {
    id: '3',
    name: 'The Brand Strategist',
    age: '30–45',
    occupation: 'Head of Brand / CMO',
    painPoints: ['Off-brand content', 'Fragmented teams', 'Manual oversight'],
    motivations: ['Brand equity', 'Consistency at scale', 'Strategic control'],
    channels: ['LinkedIn', 'YouTube', 'Programmatic'],
    emoji: '🎯',
    color: '#7c3aed',
  },
];

const TREND_DATA: TrendData[] = [
  { month: 'Jan', value: 42 },
  { month: 'Feb', value: 48 },
  { month: 'Mar', value: 45 },
  { month: 'Apr', value: 56 },
  { month: 'May', value: 62 },
  { month: 'Jun', value: 58 },
  { month: 'Jul', value: 71 },
  { month: 'Aug', value: 79 },
  { month: 'Sep', value: 85 },
  { month: 'Oct', value: 88 },
  { month: 'Nov', value: 92 },
  { month: 'Dec', value: 97 },
];

const CATEGORIES = ['All', 'Pain Points', 'Motivations', 'Objections', 'Behaviors', 'Preferences', 'Trends'];

export default function ConsumerResearch() {
  const [activeSection, setActiveSection] = useState<'insights' | 'personas' | 'trends'>('insights');
  const [selectedInsight, setSelectedInsight] = useState<ResearchCard | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [savedInsights, setSavedInsights] = useState<Set<string>>(new Set());

  const filteredInsights = MOCK_INSIGHTS.filter((insight) => {
    const matchesCategory = categoryFilter === 'All' || insight.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      insight.insight.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.tags.some((t) => t.includes(searchQuery.toLowerCase()));
    const matchesSentiment = sentimentFilter === 'all' || insight.sentiment === sentimentFilter;
    return matchesCategory && matchesSearch && matchesSentiment;
  });

  const toggleSave = (id: string) => {
    setSavedInsights((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const maxTrendValue = Math.max(...TREND_DATA.map((d) => d.value));

  const sentimentColor = (s: string) =>
    s === 'positive' ? 'text-emerald-400' : s === 'negative' ? 'text-red-400' : 'text-gray-400';
  const sentimentBg = (s: string) =>
    s === 'positive' ? 'bg-emerald-900/30' : s === 'negative' ? 'bg-red-900/30' : 'bg-gray-800';

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
      {/* Top Nav */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-semibold text-white text-lg">Consumer Research Hub</h2>
        <div className="flex bg-gray-800 rounded-lg p-0.5">
          {(['insights', 'personas', 'trends'] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`text-sm px-4 py-1.5 rounded-md capitalize transition-colors ${
                activeSection === section
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      {activeSection === 'insights' && (
        <div className="flex gap-4 flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filters */}
            <div className="flex gap-3 mb-4 flex-wrap">
              <input
                type="text"
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-48 bg-gray-800 text-white text-sm rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value as typeof sentimentFilter)}
                className="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 border border-gray-700"
              >
                <option value="all">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Insight Cards */}
            <div className="grid grid-cols-2 gap-3 overflow-y-auto">
              {filteredInsights.map((insight) => (
                <div
                  key={insight.id}
                  onClick={() => setSelectedInsight(insight)}
                  className={`rounded-xl border p-4 cursor-pointer transition-all ${
                    selectedInsight?.id === insight.id
                      ? 'border-indigo-500 bg-gray-800'
                      : `border-gray-800 ${sentimentBg(insight.sentiment)} hover:border-gray-700`
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-indigo-400 bg-indigo-900/30 px-2 py-0.5 rounded">
                      {insight.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${sentimentColor(insight.sentiment)}`}>
                        {insight.trend === 'up' ? '↑' : insight.trend === 'down' ? '↓' : '→'}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSave(insight.id); }}
                        className={savedInsights.has(insight.id) ? 'text-yellow-400 text-sm' : 'text-gray-600 text-sm hover:text-gray-400'}
                      >
                        ★
                      </button>
                    </div>
                  </div>
                  <div className="font-semibold text-sm text-white mb-1">{insight.insight}</div>
                  <div className="text-xs text-gray-400 line-clamp-2">{insight.detail}</div>
                  <div className="mt-2 text-xs text-gray-600">{insight.volume.toLocaleString()} mentions</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          {selectedInsight && (
            <div className="w-80 bg-gray-900 rounded-xl border border-gray-800 p-5 flex flex-col gap-4 overflow-y-auto">
              <div>
                <span className="text-xs font-medium text-indigo-400 bg-indigo-900/30 px-2 py-0.5 rounded">
                  {selectedInsight.category}
                </span>
                <h3 className="font-semibold text-white mt-2">{selectedInsight.insight}</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{selectedInsight.detail}</p>
              <div className="bg-gray-800 rounded-lg p-3 text-xs">
                <div className="text-gray-500 mb-1">Source</div>
                <div className="text-gray-300">{selectedInsight.source}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Volume</div>
                  <div className="text-white font-semibold">{selectedInsight.volume.toLocaleString()}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Trend</div>
                  <div className={`font-semibold ${sentimentColor(selectedInsight.sentiment)}`}>
                    {selectedInsight.trend === 'up' ? '↑ Rising' : selectedInsight.trend === 'down' ? '↓ Falling' : '→ Stable'}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedInsight.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 rounded-lg transition-colors">
                Use in Campaign Brief
              </button>
            </div>
          )}
        </div>
      )}

      {/* Personas Section */}
      {activeSection === 'personas' && (
        <div className="flex gap-4 flex-1 overflow-hidden">
          <div className="flex-1 grid grid-cols-3 gap-4 content-start overflow-y-auto">
            {PERSONAS.map((persona) => (
              <div
                key={persona.id}
                onClick={() => setSelectedPersona(persona)}
                className={`rounded-xl border p-5 cursor-pointer transition-all ${
                  selectedPersona?.id === persona.id
                    ? 'border-indigo-500 bg-gray-800'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                  style={{ backgroundColor: persona.color }}
                >
                  {persona.emoji}
                </div>
                <h3 className="font-semibold text-white mb-1">{persona.name}</h3>
                <div className="text-xs text-gray-500 mb-3">{persona.age} · {persona.occupation}</div>
                <div className="space-y-1">
                  {persona.painPoints.slice(0, 2).map((point) => (
                    <div key={point} className="text-xs text-red-400 flex items-center gap-1">
                      <span>✕</span> {point}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedPersona && (
            <div className="w-80 bg-gray-900 rounded-xl border border-gray-800 p-5 flex flex-col gap-4 overflow-y-auto">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: selectedPersona.color }}
              >
                {selectedPersona.emoji}
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">{selectedPersona.name}</h3>
                <div className="text-sm text-gray-500">{selectedPersona.age} · {selectedPersona.occupation}</div>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Pain Points</h4>
                {selectedPersona.painPoints.map((point) => (
                  <div key={point} className="text-sm text-red-400 flex items-center gap-2 mb-1">
                    <span>✕</span> {point}
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Motivations</h4>
                {selectedPersona.motivations.map((m) => (
                  <div key={m} className="text-sm text-emerald-400 flex items-center gap-2 mb-1">
                    <span>✓</span> {m}
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Channels</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedPersona.channels.map((c) => (
                    <span key={c} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trends Section */}
      {activeSection === 'trends' && (
        <div className="flex-1 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="font-semibold text-white mb-1">AI-Powered Ad Adoption Trend</h3>
            <p className="text-sm text-gray-500 mb-6">% of marketers actively using AI for ad creation (2024)</p>

            {/* Simple bar chart */}
            <div className="flex items-end gap-2 h-40">
              {TREND_DATA.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-xs text-gray-400">{d.value}%</div>
                  <div
                    className="w-full bg-indigo-600 rounded-t-sm transition-all"
                    style={{ height: `${(d.value / maxTrendValue) * 128}px` }}
                  />
                  <div className="text-xs text-gray-600">{d.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Cards */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {MOCK_INSIGHTS.filter((i) => i.trend === 'up').slice(0, 6).map((insight) => (
              <div key={insight.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="text-emerald-400 text-xs mb-2">↑ Trending Up</div>
                <div className="font-medium text-white text-sm">{insight.insight}</div>
                <div className="text-xs text-gray-500 mt-1">{insight.volume.toLocaleString()} mentions</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
