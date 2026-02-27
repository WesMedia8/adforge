// ============================================
// DiversityDashboard Component
// ============================================

'use client';

import React, { useState } from 'react';

interface RepresentationScore {
  category: string;
  score: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  details: string;
}

interface Campaign {
  id: string;
  name: string;
  platform: string;
  diversityScore: number;
  ageGroups: Record<string, number>;
  genderSplit: Record<string, number>;
  ethnicityRep: Record<string, number>;
  inclusionFlags: string[];
  status: 'approved' | 'needs-review' | 'flagged';
}

const REPRESENTATION_SCORES: RepresentationScore[] = [
  { category: 'Age Diversity', score: 72, target: 80, trend: 'up', details: 'Underrepresenting 55+ demographic' },
  { category: 'Gender Balance', score: 85, target: 85, trend: 'stable', details: 'Well balanced across campaigns' },
  { category: 'Ethnic Representation', score: 68, target: 90, trend: 'up', details: 'Improving but below target' },
  { category: 'Disability Inclusion', score: 45, target: 70, trend: 'up', details: 'Significant room for improvement' },
  { category: 'Body Positivity', score: 78, target: 80, trend: 'stable', details: 'Near target, good progress' },
  { category: 'LGBTQ+ Visibility', score: 62, target: 75, trend: 'up', details: 'Growing representation' },
];

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale 2024',
    platform: 'Instagram',
    diversityScore: 84,
    ageGroups: { '18-24': 35, '25-34': 40, '35-44': 15, '45+': 10 },
    genderSplit: { Female: 52, Male: 44, 'Non-binary': 4 },
    ethnicityRep: { White: 45, Black: 22, Hispanic: 18, Asian: 12, Other: 3 },
    inclusionFlags: ['Age gap: 45+ underrepresented'],
    status: 'approved',
  },
  {
    id: '2',
    name: 'Product Launch B2B',
    platform: 'LinkedIn',
    diversityScore: 61,
    ageGroups: { '18-24': 5, '25-34': 55, '35-44': 30, '45+': 10 },
    genderSplit: { Female: 35, Male: 63, 'Non-binary': 2 },
    ethnicityRep: { White: 68, Black: 10, Hispanic: 12, Asian: 8, Other: 2 },
    inclusionFlags: ['Gender imbalance: male-skewed', 'Low ethnic diversity'],
    status: 'needs-review',
  },
  {
    id: '3',
    name: 'Holiday Campaign',
    platform: 'Facebook',
    diversityScore: 91,
    ageGroups: { '18-24': 20, '25-34': 30, '35-44': 28, '45+': 22 },
    genderSplit: { Female: 50, Male: 46, 'Non-binary': 4 },
    ethnicityRep: { White: 38, Black: 25, Hispanic: 22, Asian: 12, Other: 3 },
    inclusionFlags: [],
    status: 'approved',
  },
  {
    id: '4',
    name: 'Q1 Retargeting',
    platform: 'Google',
    diversityScore: 43,
    ageGroups: { '18-24': 70, '25-34': 25, '35-44': 4, '45+': 1 },
    genderSplit: { Female: 28, Male: 70, 'Non-binary': 2 },
    ethnicityRep: { White: 78, Black: 8, Hispanic: 8, Asian: 5, Other: 1 },
    inclusionFlags: ['Age skew: youth-only targeting', 'Gender imbalance: male-dominated', 'Low ethnic diversity'],
    status: 'flagged',
  },
];

export default function DiversityDashboard() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'campaigns' | 'guidelines'>('overview');

  const statusColor = (s: Campaign['status']) =>
    s === 'approved' ? 'text-emerald-400' : s === 'flagged' ? 'text-red-400' : 'text-yellow-400';
  const statusBg = (s: Campaign['status']) =>
    s === 'approved' ? 'bg-emerald-900/30' : s === 'flagged' ? 'bg-red-900/30' : 'bg-yellow-900/30';
  const scoreColor = (score: number) =>
    score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-semibold text-white text-lg">Diversity & Inclusion Dashboard</h2>
        <div className="flex bg-gray-800 rounded-lg p-0.5">
          {(['overview', 'campaigns', 'guidelines'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`text-sm px-4 py-1.5 rounded-md capitalize transition-colors ${
                activeView === view
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {activeView === 'overview' && (
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Score Cards */}
          <div className="grid grid-cols-3 gap-4">
            {REPRESENTATION_SCORES.map((item) => (
              <div key={item.category} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-300">{item.category}</span>
                  <span className={`text-xs ${item.trend === 'up' ? 'text-emerald-400' : item.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                    {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
                <div className={`text-2xl font-bold mb-1 ${scoreColor(item.score)}`}>{item.score}%</div>
                <div className="text-xs text-gray-500 mb-3">Target: {item.target}%</div>
                {/* Progress bar */}
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${(item.score / item.target) * 100}%`, maxWidth: '100%' }}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-2">{item.details}</div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h3 className="font-medium text-white mb-3">Portfolio Diversity Summary</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Avg Diversity Score', value: '68%', color: 'text-yellow-400' },
                { label: 'Campaigns Approved', value: '2/4', color: 'text-emerald-400' },
                { label: 'Flags Raised', value: '7', color: 'text-red-400' },
                { label: 'Improvement MoM', value: '+12%', color: 'text-blue-400' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Campaigns View */}
      {activeView === 'campaigns' && (
        <div className="flex gap-4 flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-3">
            {MOCK_CAMPAIGNS.map((campaign) => (
              <div
                key={campaign.id}
                onClick={() => setSelectedCampaign(campaign)}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  selectedCampaign?.id === campaign.id
                    ? 'border-indigo-500 bg-gray-800'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{campaign.name}</div>
                    <div className="text-xs text-gray-500">{campaign.platform}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${scoreColor(campaign.diversityScore)}`}>
                      {campaign.diversityScore}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusBg(campaign.status)} ${statusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>
                {campaign.inclusionFlags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {campaign.inclusionFlags.map((flag) => (
                      <span key={flag} className="text-xs bg-red-900/20 text-red-400 border border-red-900/30 px-2 py-0.5 rounded">
                        ⚠ {flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedCampaign && (
            <div className="w-80 bg-gray-900 rounded-xl border border-gray-800 p-5 overflow-y-auto flex flex-col gap-4">
              <div>
                <h3 className="font-semibold text-white">{selectedCampaign.name}</h3>
                <div className="text-xs text-gray-500">{selectedCampaign.platform}</div>
              </div>

              <div className="text-center">
                <div className={`text-4xl font-bold ${scoreColor(selectedCampaign.diversityScore)}`}>
                  {selectedCampaign.diversityScore}
                </div>
                <div className="text-xs text-gray-500">Diversity Score</div>
              </div>

              {/* Age Groups */}
              <div>
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Age Groups</h4>
                {Object.entries(selectedCampaign.ageGroups).map(([age, pct]) => (
                  <div key={age} className="flex items-center gap-2 mb-1.5">
                    <div className="text-xs text-gray-400 w-16">{age}</div>
                    <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-xs text-gray-400 w-8 text-right">{pct}%</div>
                  </div>
                ))}
              </div>

              {/* Gender Split */}
              <div>
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Gender Split</h4>
                {Object.entries(selectedCampaign.genderSplit).map(([gender, pct]) => (
                  <div key={gender} className="flex items-center gap-2 mb-1.5">
                    <div className="text-xs text-gray-400 w-20">{gender}</div>
                    <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-xs text-gray-400 w-8 text-right">{pct}%</div>
                  </div>
                ))}
              </div>

              {/* Flags */}
              {selectedCampaign.inclusionFlags.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Issues</h4>
                  {selectedCampaign.inclusionFlags.map((flag) => (
                    <div key={flag} className="text-xs text-red-400 bg-red-900/20 rounded p-2 mb-1">
                      ⚠ {flag}
                    </div>
                  ))}
                </div>
              )}

              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 rounded-lg transition-colors">
                Generate Fix Suggestions
              </button>
            </div>
          )}
        </div>
      )}

      {/* Guidelines */}
      {activeView === 'guidelines' && (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                title: 'Age Representation',
                icon: '👴',
                rules: [
                  'Include at least 3 age demographics per campaign',
                  'Avoid exclusively youth-focused imagery for broad products',
                  'Represent 45+ age group in at least 15% of creatives',
                ],
              },
              {
                title: 'Gender Balance',
                icon: '⚖️',
                rules: [
                  'Target max 60/40 gender split for general audiences',
                  'Include non-binary representation in brand campaigns',
                  'Avoid gender stereotypes in product associations',
                ],
              },
              {
                title: 'Ethnic Diversity',
                icon: '🌍',
                rules: [
                  'No single ethnicity should exceed 50% in brand campaigns',
                  'Reflect local market demographics when geo-targeting',
                  'Avoid tokenism — authentic representation over checkboxes',
                ],
              },
              {
                title: 'Disability Inclusion',
                icon: '♿',
                rules: [
                  '1 in 4 adults has a disability — reflect this in creative',
                  'Include alt text for all ad images',
                  'Ensure video ads have captions',
                ],
              },
            ].map((guideline) => (
              <div key={guideline.title} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                <div className="text-2xl mb-2">{guideline.icon}</div>
                <h3 className="font-semibold text-white mb-3">{guideline.title}</h3>
                <ul className="space-y-2">
                  {guideline.rules.map((rule) => (
                    <li key={rule} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
