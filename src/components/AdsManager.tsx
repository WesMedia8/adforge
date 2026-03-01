// ============================================
// AdForge — Ads Manager Component
// Connect to Meta and manage campaigns
// ============================================

'use client';

import React, { useState, useEffect } from 'react';
import { useMetaAds, MetaCredentialsInput } from '@/hooks/useMetaAds';

type AdsManagerView = 'setup' | 'dashboard' | 'campaigns' | 'create';

export default function AdsManager() {
  const meta = useMetaAds();
  const [view, setView] = useState<AdsManagerView>('setup');
  const [tokenInput, setTokenInput] = useState('');
  const [accountInput, setAccountInput] = useState('');

  // New campaign form
  const [campaignName, setCampaignName] = useState('');
  const [campaignObjective, setCampaignObjective] = useState('OUTCOME_SALES');
  const [campaignBudget, setCampaignBudget] = useState('');
  const [creating, setCreating] = useState(false);

  // Auto-switch to dashboard after connection
  useEffect(() => {
    if (meta.connection?.connected && view === 'setup') {
      setView('dashboard');
      meta.fetchCampaigns();
      meta.fetchMetrics();
      meta.startAutoRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.connection?.connected]);

  const handleConnect = async () => {
    const creds: MetaCredentialsInput = {
      accessToken: tokenInput.trim(),
      adAccountId: accountInput.trim(),
    };
    await meta.testConnection(creds);
  };

  const handleCreateCampaign = async () => {
    if (!campaignName.trim()) return;
    setCreating(true);
    const id = await meta.createCampaign({
      name: campaignName.trim(),
      objective: campaignObjective,
      daily_budget: campaignBudget ? parseFloat(campaignBudget) : undefined,
      status: 'PAUSED',
    });
    if (id) {
      setCampaignName('');
      setCampaignBudget('');
      setView('campaigns');
    }
    setCreating(false);
  };

  const labelClass =
    'block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5';
  const inputClass =
    'w-full bg-af-bg-tertiary border border-af-border-default rounded-md text-af-text-primary text-[13px] px-3 py-2.5 outline-none focus:border-af-accent';

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-af-bg-primary">
      {/* Header */}
      <div className="bg-af-bg-secondary border-b border-af-border-subtle px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-af-accent">
                <path d="M2 2a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V2zm4.5 0a.5.5 0 000 1h3a.5.5 0 000-1h-3zM8 11a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
              <h2 className="text-[15px] font-semibold text-af-text-primary">Ads Manager</h2>
              {meta.connection?.connected && (
                <span className="text-[9px] font-medium text-green-400 bg-green-500/10 border border-green-500/20 rounded px-2 py-0.5">
                  Connected
                </span>
              )}
            </div>
            <p className="text-[11px] text-af-text-tertiary">
              {meta.connection?.connected
                ? `${meta.connection.accountName} (${meta.connection.accountId})`
                : 'Connect your Meta ad account to manage campaigns'}
            </p>
          </div>

          {meta.connection?.connected && (
            <div className="flex gap-1 bg-af-bg-tertiary rounded-md p-0.5">
              {(['dashboard', 'campaigns', 'create'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setView(v);
                    if (v === 'campaigns') meta.fetchCampaigns();
                    if (v === 'dashboard') meta.fetchMetrics();
                  }}
                  className={`px-3 py-1.5 rounded text-[11px] font-medium transition-all ${
                    view === v
                      ? 'bg-af-accent text-white'
                      : 'text-af-text-tertiary hover:text-af-text-primary'
                  }`}
                >
                  {v === 'dashboard' ? 'Dashboard' : v === 'campaigns' ? 'Campaigns' : 'New Campaign'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[900px] mx-auto">
          {/* Setup View */}
          {view === 'setup' && (
            <div className="space-y-4 max-w-[500px] mx-auto">
              <div className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-5">
                <h3 className="text-[13px] font-semibold text-af-text-primary mb-4">
                  Connect Meta Ad Account
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Access Token</label>
                    <input
                      type="password"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="Paste your Meta access token"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Ad Account ID</label>
                    <input
                      type="text"
                      value={accountInput}
                      onChange={(e) => setAccountInput(e.target.value)}
                      placeholder="e.g. act_123456789 or 123456789"
                      className={inputClass}
                    />
                  </div>

                  {meta.error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">
                      <p className="text-[12px] text-red-400">{meta.error}</p>
                    </div>
                  )}

                  {meta.connection && !meta.connection.connected && meta.connection.error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">
                      <p className="text-[12px] text-red-400">{meta.connection.error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleConnect}
                    disabled={meta.connecting || !tokenInput.trim() || !accountInput.trim()}
                    className="w-full px-5 py-3 rounded-md text-[13px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all disabled:opacity-40"
                  >
                    {meta.connecting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Connecting...
                      </span>
                    ) : (
                      'Connect Account'
                    )}
                  </button>
                </div>

                <div className="mt-5 border-t border-af-border-subtle pt-4">
                  <p className="text-[10px] text-af-text-tertiary leading-[1.6]">
                    Your credentials are stored only in your browser session and sent via request headers &mdash; they are never saved to any database. You&apos;ll need to re-enter them each session.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard View */}
          {view === 'dashboard' && (
            <div className="space-y-5">
              {/* Date preset selector */}
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-af-text-primary">Performance Overview</h3>
                <select
                  value={meta.datePreset}
                  onChange={(e) => {
                    meta.setDatePreset(e.target.value as Parameters<typeof meta.setDatePreset>[0]);
                    meta.fetchMetrics(e.target.value as Parameters<typeof meta.fetchMetrics>[0]);
                  }}
                  className="bg-af-bg-tertiary border border-af-border-default rounded text-af-text-primary text-[11px] px-2 py-1.5 outline-none cursor-pointer"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last_7d">Last 7 Days</option>
                  <option value="last_14d">Last 14 Days</option>
                  <option value="last_30d">Last 30 Days</option>
                  <option value="last_90d">Last 90 Days</option>
                </select>
              </div>

              {meta.loadingMetrics ? (
                <div className="flex items-center justify-center py-16">
                  <svg className="animate-spin h-6 w-6 text-af-accent" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : meta.metrics ? (
                <>
                  {/* KPI Cards */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Spend', value: `$${meta.metrics.totalSpend.toFixed(2)}`, color: 'text-af-text-primary' },
                      { label: 'Impressions', value: meta.metrics.totalImpressions.toLocaleString(), color: 'text-af-text-primary' },
                      { label: 'CTR', value: `${meta.metrics.ctr.toFixed(2)}%`, color: meta.metrics.ctr > 1 ? 'text-green-400' : 'text-amber-400' },
                      { label: 'ROAS', value: `${meta.metrics.roas.toFixed(2)}x`, color: meta.metrics.roas > 1 ? 'text-green-400' : 'text-red-400' },
                    ].map((kpi) => (
                      <div key={kpi.label} className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-4">
                        <span className="text-[10px] text-af-text-tertiary uppercase">{kpi.label}</span>
                        <p className={`text-[18px] font-semibold mt-1 ${kpi.color}`}>{kpi.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Secondary metrics */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Clicks', value: meta.metrics.totalClicks.toLocaleString() },
                      { label: 'CPC', value: `$${meta.metrics.cpc.toFixed(2)}` },
                      { label: 'Reach', value: meta.metrics.totalReach.toLocaleString() },
                      { label: 'Purchases', value: meta.metrics.purchases.toLocaleString() },
                    ].map((m) => (
                      <div key={m.label} className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-3">
                        <span className="text-[10px] text-af-text-tertiary uppercase">{m.label}</span>
                        <p className="text-[14px] font-semibold text-af-text-primary mt-0.5">{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Campaign breakdown */}
                  {meta.metrics.campaignBreakdown.length > 0 && (
                    <div className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-5">
                      <h4 className="text-[11px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-3">
                        By Campaign
                      </h4>
                      <div className="space-y-2">
                        {meta.metrics.campaignBreakdown.map((c) => (
                          <div
                            key={c.campaign_id}
                            className="flex items-center justify-between bg-af-bg-tertiary rounded-md p-3"
                          >
                            <span className="text-[12px] text-af-text-primary font-medium truncate max-w-[200px]">
                              {c.campaign_name}
                            </span>
                            <div className="flex items-center gap-4 text-[11px] text-af-text-secondary">
                              <span>${c.spend.toFixed(2)}</span>
                              <span>{c.clicks} clicks</span>
                              <span>{c.ctr.toFixed(2)}% CTR</span>
                              <span className={c.roas > 1 ? 'text-green-400' : 'text-red-400'}>
                                {c.roas.toFixed(2)}x ROAS
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-[13px] text-af-text-tertiary">No metrics data available</p>
                  <p className="text-[11px] text-af-text-tertiary/60 mt-1">
                    Your account may not have any active campaigns yet
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Campaigns View */}
          {view === 'campaigns' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-af-text-primary">
                  Campaigns
                  <span className="text-af-text-tertiary font-normal ml-2">({meta.campaigns.length})</span>
                </h3>
                <button
                  onClick={() => meta.fetchCampaigns()}
                  disabled={meta.loadingCampaigns}
                  className="text-[11px] text-af-text-tertiary hover:text-af-text-primary transition-colors"
                >
                  {meta.loadingCampaigns ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {meta.loadingCampaigns ? (
                <div className="flex items-center justify-center py-16">
                  <svg className="animate-spin h-6 w-6 text-af-accent" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : meta.campaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-[13px] text-af-text-tertiary">No campaigns found</p>
                  <button
                    onClick={() => setView('create')}
                    className="mt-3 text-[11px] text-af-accent hover:text-af-accent-hover transition-colors"
                  >
                    Create your first campaign
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {meta.campaigns.map((camp) => (
                    <div
                      key={camp.id}
                      className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium text-af-text-primary truncate">
                            {camp.name}
                          </span>
                          <span className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded border ${
                            camp.effective_status === 'ACTIVE'
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : camp.effective_status === 'PAUSED'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-af-bg-tertiary text-af-text-tertiary border-af-border-default'
                          }`}>
                            {camp.effective_status}
                          </span>
                        </div>
                        <div className="flex gap-3 mt-1 text-[10px] text-af-text-tertiary">
                          <span>{camp.objective.replace('OUTCOME_', '')}</span>
                          {camp.daily_budget && (
                            <span>${(parseInt(camp.daily_budget) / 100).toFixed(2)}/day</span>
                          )}
                          <span>{new Date(camp.created_time).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {camp.status === 'PAUSED' && (
                          <button
                            onClick={() => meta.updateCampaignStatus(camp.id, 'ACTIVE')}
                            className="text-[10px] font-medium text-green-400 hover:text-green-300 transition-colors px-2 py-1"
                          >
                            Activate
                          </button>
                        )}
                        {camp.status === 'ACTIVE' && (
                          <button
                            onClick={() => meta.updateCampaignStatus(camp.id, 'PAUSED')}
                            className="text-[10px] font-medium text-amber-400 hover:text-amber-300 transition-colors px-2 py-1"
                          >
                            Pause
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Create Campaign View */}
          {view === 'create' && (
            <div className="space-y-4 max-w-[500px] mx-auto">
              <h3 className="text-[13px] font-semibold text-af-text-primary">Create Campaign</h3>

              <div>
                <label className={labelClass}>Campaign Name *</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Spring Sale 2026"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Objective</label>
                <select
                  value={campaignObjective}
                  onChange={(e) => setCampaignObjective(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="OUTCOME_SALES">Sales</option>
                  <option value="OUTCOME_LEADS">Leads</option>
                  <option value="OUTCOME_TRAFFIC">Traffic</option>
                  <option value="OUTCOME_AWARENESS">Awareness</option>
                  <option value="OUTCOME_ENGAGEMENT">Engagement</option>
                  <option value="OUTCOME_APP_PROMOTION">App Promotion</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Daily Budget ($)</label>
                <input
                  type="number"
                  value={campaignBudget}
                  onChange={(e) => setCampaignBudget(e.target.value)}
                  placeholder="e.g. 50"
                  min="1"
                  step="1"
                  className={inputClass}
                />
              </div>

              {meta.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">
                  <p className="text-[12px] text-red-400">{meta.error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCreateCampaign}
                  disabled={creating || !campaignName.trim()}
                  className="flex-1 px-5 py-3 rounded-md text-[13px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all disabled:opacity-40"
                >
                  {creating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    'Create Campaign (Paused)'
                  )}
                </button>
                <button
                  onClick={() => setView('campaigns')}
                  className="px-5 py-3 rounded-md text-[13px] font-medium bg-af-bg-tertiary border border-af-border-default text-af-text-primary hover:border-af-border-default transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
