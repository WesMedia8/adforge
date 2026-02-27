// ============================================
// AdForge — Meta Ads Manager Component
// ============================================

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useMetaAds } from '@/hooks/useMetaAds';
import {
  MetaCampaign,
  MetaAdSet,
  MetaAd,
  MetaInsights,
  AdsManagerView,
  AdsManagerFilters,
  BulkAction,
  AdObjective,
  AdStatus,
} from '@/types/meta-ads';

// ─── Sub-component imports ───────────────────────────────────────────────────────

import CampaignTable from './ads-manager/CampaignTable';
import AdSetTable from './ads-manager/AdSetTable';
import AdTable from './ads-manager/AdTable';
import InsightsSidebar from './ads-manager/InsightsSidebar';
import CreateCampaignModal from './ads-manager/CreateCampaignModal';
import FiltersBar from './ads-manager/FiltersBar';
import BulkActionsBar from './ads-manager/BulkActionsBar';
import DateRangePicker from './ads-manager/DateRangePicker';
import ColumnCustomizer from './ads-manager/ColumnCustomizer';
import ExportModal from './ads-manager/ExportModal';
import BreakdownPanel from './ads-manager/BreakdownPanel';

// ─── Constants ───────────────────────────────────────────────────────────────────────

const VIEW_TABS: { id: AdsManagerView; label: string }[] = [
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'ad-sets', label: 'Ad Sets' },
  { id: 'ads', label: 'Ads' },
];

const METRIC_COLUMNS = [
  { id: 'delivery', label: 'Delivery', default: true },
  { id: 'budget', label: 'Budget', default: true },
  { id: 'impressions', label: 'Impressions', default: true },
  { id: 'reach', label: 'Reach', default: false },
  { id: 'frequency', label: 'Frequency', default: false },
  { id: 'clicks', label: 'Clicks', default: true },
  { id: 'ctr', label: 'CTR', default: true },
  { id: 'cpc', label: 'CPC', default: true },
  { id: 'cpm', label: 'CPM', default: false },
  { id: 'spend', label: 'Amount Spent', default: true },
  { id: 'conversions', label: 'Conversions', default: true },
  { id: 'roas', label: 'ROAS', default: true },
  { id: 'cpa', label: 'CPA', default: false },
  { id: 'video_views', label: 'Video Views', default: false },
  { id: 'video_p25', label: 'Video 25%', default: false },
  { id: 'video_p50', label: 'Video 50%', default: false },
  { id: 'video_p75', label: 'Video 75%', default: false },
  { id: 'video_p100', label: 'Video 100%', default: false },
  { id: 'link_clicks', label: 'Link Clicks', default: false },
  { id: 'landing_page_views', label: 'Landing Page Views', default: false },
  { id: 'post_engagement', label: 'Post Engagement', default: false },
  { id: 'page_likes', label: 'Page Likes', default: false },
  { id: 'leads', label: 'Leads', default: false },
  { id: 'purchases', label: 'Purchases', default: false },
  { id: 'revenue', label: 'Revenue', default: false },
];

const DEFAULT_DATE_RANGE = 'last_30_days';

// ─── Mock Data Generation ─────────────────────────────────────────────────────────────

function generateMockCampaigns(): MetaCampaign[] {
  const objectives: AdObjective[] = [
    'OUTCOME_AWARENESS',
    'OUTCOME_TRAFFIC',
    'OUTCOME_ENGAGEMENT',
    'OUTCOME_LEADS',
    'OUTCOME_APP_PROMOTION',
    'OUTCOME_SALES',
  ];
  const statuses: AdStatus[] = ['ACTIVE', 'PAUSED', 'ARCHIVED', 'DELETED'];

  return Array.from({ length: 12 }, (_, i) => ({
    id: `camp_${i + 1}`,
    name: [
      'Summer Sale 2024 — Broad',
      'Retargeting — Cart Abandoners',
      'Brand Awareness — US/CA',
      'Lead Gen — SaaS Verticals',
      'App Install — iOS Lookalike',
      'Holiday Campaign — BFCM',
      'Competitor Conquesting',
      'Video Views — New Creative',
      'Prospecting — LAL 2%',
      'Engagement — Warm Audience',
      'Q1 Push — High Intent',
      'Always On — Brand',
    ][i],
    objective: objectives[i % objectives.length],
    status: statuses[i % 4] as AdStatus,
    budget_remaining: Math.random() * 5000 + 500,
    daily_budget: Math.random() * 500 + 50,
    lifetime_budget: i % 3 === 0 ? Math.random() * 15000 + 3000 : undefined,
    bid_strategy: ['LOWEST_COST_WITHOUT_CAP', 'COST_CAP', 'BID_CAP', 'MINIMUM_ROAS'][i % 4] as MetaCampaign['bid_strategy'],
    special_ad_categories: [],
    created_time: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    updated_time: new Date().toISOString(),
    start_time: new Date(2024, Math.floor(Math.random() * 6), 1).toISOString(),
    insights: {
      impressions: Math.floor(Math.random() * 1000000 + 50000),
      reach: Math.floor(Math.random() * 500000 + 25000),
      frequency: parseFloat((Math.random() * 3 + 1).toFixed(2)),
      clicks: Math.floor(Math.random() * 50000 + 2000),
      unique_clicks: Math.floor(Math.random() * 40000 + 1500),
      ctr: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
      unique_ctr: parseFloat((Math.random() * 4 + 0.4).toFixed(2)),
      cpc: parseFloat((Math.random() * 3 + 0.3).toFixed(2)),
      cpm: parseFloat((Math.random() * 15 + 2).toFixed(2)),
      spend: parseFloat((Math.random() * 10000 + 500).toFixed(2)),
      conversions: Math.floor(Math.random() * 1000 + 50),
      conversion_rate: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
      cost_per_conversion: parseFloat((Math.random() * 50 + 5).toFixed(2)),
      roas: parseFloat((Math.random() * 6 + 1).toFixed(2)),
      revenue: parseFloat((Math.random() * 50000 + 1000).toFixed(2)),
      video_views: Math.floor(Math.random() * 200000 + 10000),
      video_p25_watched: Math.floor(Math.random() * 150000 + 8000),
      video_p50_watched: Math.floor(Math.random() * 100000 + 5000),
      video_p75_watched: Math.floor(Math.random() * 50000 + 2000),
      video_p100_watched: Math.floor(Math.random() * 25000 + 1000),
      link_clicks: Math.floor(Math.random() * 40000 + 1500),
      landing_page_views: Math.floor(Math.random() * 35000 + 1200),
      post_engagement: Math.floor(Math.random() * 80000 + 3000),
      page_likes: Math.floor(Math.random() * 5000 + 100),
      leads: Math.floor(Math.random() * 500 + 20),
      purchases: Math.floor(Math.random() * 300 + 10),
      date_start: '2024-01-01',
      date_stop: '2024-12-31',
    },
    adsets_count: Math.floor(Math.random() * 8 + 1),
    ads_count: Math.floor(Math.random() * 24 + 3),
    account_id: 'act_123456789',
    account_name: 'AdForge Demo Account',
  }));
}

function generateMockAdSets(campaignId: string): MetaAdSet[] {
  const placements = [
    ['Facebook Feed', 'Instagram Feed'],
    ['Instagram Stories', 'Facebook Stories'],
    ['Facebook Reels', 'Instagram Reels'],
    ['Audience Network'],
    ['Messenger Inbox'],
  ];

  return Array.from({ length: Math.floor(Math.random() * 4 + 2) }, (_, i) => ({
    id: `adset_${campaignId}_${i + 1}`,
    campaign_id: campaignId,
    name: [
      'Lookalike 1% — Purchasers',
      'Interest Stack — Marketing Tools',
      'Retargeting — Website Visitors',
      'Broad — US 25–45',
      'Custom Audience — Email List',
      'Competitor Keywords',
    ][i] || `Ad Set ${i + 1}`,
    status: (['ACTIVE', 'PAUSED', 'ACTIVE', 'ACTIVE'] as AdStatus[])[i % 4],
    optimization_goal: (['OFFSITE_CONVERSIONS', 'LINK_CLICKS', 'REACH', 'LANDING_PAGE_VIEWS', 'VIDEO_VIEWS'] as MetaAdSet['optimization_goal'][])[i % 5],
    billing_event: (['IMPRESSIONS', 'LINK_CLICKS'] as MetaAdSet['billing_event'][])[i % 2],
    bid_amount: Math.random() > 0.5 ? parseFloat((Math.random() * 5 + 0.5).toFixed(2)) : undefined,
    daily_budget: parseFloat((Math.random() * 200 + 20).toFixed(2)),
    targeting: {
      age_min: [18, 25, 30, 35][i % 4],
      age_max: [65, 54, 44, 65][i % 4],
      genders: i % 3 === 0 ? [1, 2] : i % 3 === 1 ? [1] : [2],
      geo_locations: {
        countries: ['US', 'CA', 'GB', 'AU'],
        regions: [],
        cities: [],
      },
      interests: [
        { id: '6003107902433', name: 'Digital marketing' },
        { id: '6003200501422', name: 'E-commerce' },
        { id: '6002714885172', name: 'Entrepreneurship' },
      ],
      behaviors: [],
      custom_audiences: [],
      excluded_custom_audiences: [],
      flexible_spec: [],
      publisher_platforms: placements[i % placements.length],
    },
    start_time: new Date(2024, i, 1).toISOString(),
    insights: {
      impressions: Math.floor(Math.random() * 200000 + 10000),
      reach: Math.floor(Math.random() * 100000 + 5000),
      frequency: parseFloat((Math.random() * 3 + 1).toFixed(2)),
      clicks: Math.floor(Math.random() * 10000 + 500),
      unique_clicks: Math.floor(Math.random() * 8000 + 400),
      ctr: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
      unique_ctr: parseFloat((Math.random() * 4 + 0.4).toFixed(2)),
      cpc: parseFloat((Math.random() * 3 + 0.3).toFixed(2)),
      cpm: parseFloat((Math.random() * 15 + 2).toFixed(2)),
      spend: parseFloat((Math.random() * 2000 + 100).toFixed(2)),
      conversions: Math.floor(Math.random() * 200 + 10),
      conversion_rate: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
      cost_per_conversion: parseFloat((Math.random() * 50 + 5).toFixed(2)),
      roas: parseFloat((Math.random() * 6 + 1).toFixed(2)),
      revenue: parseFloat((Math.random() * 10000 + 200).toFixed(2)),
      video_views: Math.floor(Math.random() * 40000 + 2000),
      video_p25_watched: Math.floor(Math.random() * 30000 + 1500),
      video_p50_watched: Math.floor(Math.random() * 20000 + 1000),
      video_p75_watched: Math.floor(Math.random() * 10000 + 500),
      video_p100_watched: Math.floor(Math.random() * 5000 + 200),
      link_clicks: Math.floor(Math.random() * 8000 + 300),
      landing_page_views: Math.floor(Math.random() * 7000 + 250),
      post_engagement: Math.floor(Math.random() * 15000 + 600),
      page_likes: Math.floor(Math.random() * 1000 + 20),
      leads: Math.floor(Math.random() * 100 + 5),
      purchases: Math.floor(Math.random() * 60 + 2),
      date_start: '2024-01-01',
      date_stop: '2024-12-31',
    },
    ads_count: Math.floor(Math.random() * 6 + 1),
    account_id: 'act_123456789',
  }));
}

function generateMockAds(adSetId: string, campaignId: string): MetaAd[] {
  const creativeTypes: MetaAd['creative_type'][] = ['image', 'video', 'carousel', 'collection', 'dynamic'];
  const callsToAction = ['SHOP_NOW', 'LEARN_MORE', 'SIGN_UP', 'DOWNLOAD', 'GET_QUOTE', 'BOOK_NOW'];

  return Array.from({ length: Math.floor(Math.random() * 4 + 1) }, (_, i) => ({
    id: `ad_${adSetId}_${i + 1}`,
    adset_id: adSetId,
    campaign_id: campaignId,
    name: [
      'Creative A — Blue CTA',
      'Creative B — Social Proof',
      'Creative C — Demo Video',
      'Creative D — Carousel',
      'Creative E — Dynamic',
    ][i] || `Ad Creative ${i + 1}`,
    status: (['ACTIVE', 'PAUSED', 'ACTIVE', 'DISAPPROVED'] as AdStatus[])[i % 4],
    creative_type: creativeTypes[i % creativeTypes.length],
    creative: {
      id: `creative_${adSetId}_${i}`,
      name: `Creative ${i + 1}`,
      headline: ['Transform Your Marketing', 'Stop Wasting Ad Spend', 'Scale Your Business', 'The Smart Way to Advertise'][i % 4],
      body: 'AI-powered ad creation that converts. Join 50,000+ marketers seeing 3x better results.',
      call_to_action: callsToAction[i % callsToAction.length],
      image_url: `https://picsum.photos/seed/${adSetId}${i}/400/300`,
      video_id: i % 3 === 2 ? `vid_${adSetId}_${i}` : undefined,
      link_url: 'https://adforge.ai',
      display_url: 'adforge.ai',
    },
    tracking_specs: [],
    conversion_specs: [],
    insights: {
      impressions: Math.floor(Math.random() * 50000 + 2000),
      reach: Math.floor(Math.random() * 25000 + 1000),
      frequency: parseFloat((Math.random() * 3 + 1).toFixed(2)),
      clicks: Math.floor(Math.random() * 2500 + 100),
      unique_clicks: Math.floor(Math.random() * 2000 + 80),
      ctr: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
      unique_ctr: parseFloat((Math.random() * 4 + 0.4).toFixed(2)),
      cpc: parseFloat((Math.random() * 3 + 0.3).toFixed(2)),
      cpm: parseFloat((Math.random() * 15 + 2).toFixed(2)),
      spend: parseFloat((Math.random() * 500 + 25).toFixed(2)),
      conversions: Math.floor(Math.random() * 50 + 2),
      conversion_rate: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
      cost_per_conversion: parseFloat((Math.random() * 50 + 5).toFixed(2)),
      roas: parseFloat((Math.random() * 6 + 1).toFixed(2)),
      revenue: parseFloat((Math.random() * 2500 + 50).toFixed(2)),
      video_views: Math.floor(Math.random() * 10000 + 500),
      video_p25_watched: Math.floor(Math.random() * 7500 + 400),
      video_p50_watched: Math.floor(Math.random() * 5000 + 300),
      video_p75_watched: Math.floor(Math.random() * 2500 + 150),
      video_p100_watched: Math.floor(Math.random() * 1000 + 50),
      link_clicks: Math.floor(Math.random() * 2000 + 80),
      landing_page_views: Math.floor(Math.random() * 1800 + 70),
      post_engagement: Math.floor(Math.random() * 4000 + 150),
      page_likes: Math.floor(Math.random() * 200 + 5),
      leads: Math.floor(Math.random() * 25 + 1),
      purchases: Math.floor(Math.random() * 15 + 1),
      date_start: '2024-01-01',
      date_stop: '2024-12-31',
    },
    account_id: 'act_123456789',
    created_time: new Date(2024, i, 1).toISOString(),
    updated_time: new Date().toISOString(),
  }));
}

// ─── Main Component ──────────────────────────────────────────────────────────────────────

export default function AdsManager() {
  // ─ State ─────────────────────────────────────────────────────────────────────
  const [activeView, setActiveView] = useState<AdsManagerView>('campaigns');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedAdSetId, setSelectedAdSetId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([]);
  const [adSets, setAdSets] = useState<MetaAdSet[]>([]);
  const [ads, setAds] = useState<MetaAd[]>([]);
  const [insightsPanelOpen, setInsightsPanelOpen] = useState(false);
  const [selectedInsightsId, setSelectedInsightsId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [columnCustomizerOpen, setColumnCustomizerOpen] = useState(false);
  const [breakdownPanelOpen, setBreakdownPanelOpen] = useState(false);
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [enabledColumns, setEnabledColumns] = useState<Set<string>>(
    new Set(METRIC_COLUMNS.filter((c) => c.default).map((c) => c.id))
  );
  const [filters, setFilters] = useState<AdsManagerFilters>({
    status: [],
    objective: [],
    datePreset: 'last_30_days',
    search: '',
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accountSummary, setAccountSummary] = useState({
    totalSpend: 0,
    totalImpressions: 0,
    totalClicks: 0,
    totalConversions: 0,
    avgCtr: 0,
    avgRoas: 0,
  });

  // ─ Data Loading ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      const mockCampaigns = generateMockCampaigns();
      setCampaigns(mockCampaigns);
      const summary = mockCampaigns.reduce(
        (acc, c) => ({
          totalSpend: acc.totalSpend + (c.insights?.spend || 0),
          totalImpressions: acc.totalImpressions + (c.insights?.impressions || 0),
          totalClicks: acc.totalClicks + (c.insights?.clicks || 0),
          totalConversions: acc.totalConversions + (c.insights?.conversions || 0),
          avgCtr: 0,
          avgRoas: 0,
        }),
        { totalSpend: 0, totalImpressions: 0, totalClicks: 0, totalConversions: 0, avgCtr: 0, avgRoas: 0 }
      );
      summary.avgCtr = summary.totalClicks / Math.max(summary.totalImpressions, 1) * 100;
      summary.avgRoas = mockCampaigns.reduce((a, c) => a + (c.insights?.roas || 0), 0) / mockCampaigns.length;
      setAccountSummary(summary);
      setIsLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (selectedCampaignId) {
      const mockAdSets = generateMockAdSets(selectedCampaignId);
      setAdSets(mockAdSets);
    }
  }, [selectedCampaignId]);

  useEffect(() => {
    if (selectedAdSetId && selectedCampaignId) {
      const mockAds = generateMockAds(selectedAdSetId, selectedCampaignId);
      setAds(mockAds);
    }
  }, [selectedAdSetId, selectedCampaignId]);

  // ─ Handlers ───────────────────────────────────────────────────────────────────

  const handleCampaignSelect = useCallback((id: string) => {
    setSelectedCampaignId(id);
    setActiveView('ad-sets');
    setSelectedRows(new Set());
  }, []);

  const handleAdSetSelect = useCallback((id: string) => {
    setSelectedAdSetId(id);
    setActiveView('ads');
    setSelectedRows(new Set());
  }, []);

  const handleRowSelect = useCallback((id: string, checked: boolean) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const currentRows =
          activeView === 'campaigns'
            ? campaigns.map((c) => c.id)
            : activeView === 'ad-sets'
            ? adSets.map((a) => a.id)
            : ads.map((a) => a.id);
        setSelectedRows(new Set(currentRows));
      } else {
        setSelectedRows(new Set());
      }
    },
    [activeView, campaigns, adSets, ads]
  );

  const handleBulkAction = useCallback(
    (action: BulkAction) => {
      const ids = Array.from(selectedRows);
      switch (action) {
        case 'pause':
          setCampaigns((prev) =>
            prev.map((c) => (ids.includes(c.id) ? { ...c, status: 'PAUSED' } : c))
          );
          setAdSets((prev) =>
            prev.map((a) => (ids.includes(a.id) ? { ...a, status: 'PAUSED' } : a))
          );
          setAds((prev) =>
            prev.map((a) => (ids.includes(a.id) ? { ...a, status: 'PAUSED' } : a))
          );
          break;
        case 'activate':
          setCampaigns((prev) =>
            prev.map((c) => (ids.includes(c.id) ? { ...c, status: 'ACTIVE' } : c))
          );
          setAdSets((prev) =>
            prev.map((a) => (ids.includes(a.id) ? { ...a, status: 'ACTIVE' } : a))
          );
          setAds((prev) =>
            prev.map((a) => (ids.includes(a.id) ? { ...a, status: 'ACTIVE' } : a))
          );
          break;
        case 'delete':
          setCampaigns((prev) =>
            prev.map((c) => (ids.includes(c.id) ? { ...c, status: 'DELETED' } : c))
          );
          break;
        case 'duplicate':
          // Duplicate logic
          break;
      }
      setSelectedRows(new Set());
    },
    [selectedRows]
  );

  const handleStatusToggle = useCallback(
    (id: string, currentStatus: AdStatus) => {
      const newStatus: AdStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      if (activeView === 'campaigns') {
        setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
      } else if (activeView === 'ad-sets') {
        setAdSets((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
      } else {
        setAds((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
      }
    },
    [activeView]
  );

  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'desc' }
    );
  }, []);

  const handleOpenInsights = useCallback((id: string) => {
    setSelectedInsightsId(id);
    setInsightsPanelOpen(true);
  }, []);

  const handleViewChange = useCallback((view: AdsManagerView) => {
    setActiveView(view);
    setSelectedRows(new Set());
    if (view === 'campaigns') {
      setSelectedCampaignId(null);
      setSelectedAdSetId(null);
    } else if (view === 'ad-sets') {
      setSelectedAdSetId(null);
    }
  }, []);

  // ─ Filtered / Sorted Data ──────────────────────────────────────────────────────

  const filteredCampaigns = useMemo(() => {
    let data = campaigns;
    if (filters.status.length > 0) {
      data = data.filter((c) => filters.status.includes(c.status));
    }
    if (filters.objective.length > 0) {
      data = data.filter((c) => filters.objective.includes(c.objective));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (sortConfig) {
      data = [...data].sort((a, b) => {
        const aVal = (a.insights as Record<string, unknown>)?.[sortConfig.key] ?? (a as Record<string, unknown>)[sortConfig.key] ?? 0;
        const bVal = (b.insights as Record<string, unknown>)?.[sortConfig.key] ?? (b as Record<string, unknown>)[sortConfig.key] ?? 0;
        return sortConfig.direction === 'asc'
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      });
    }
    return data;
  }, [campaigns, filters, sortConfig]);

  const filteredAdSets = useMemo(() => {
    let data = adSets;
    if (filters.status.length > 0) {
      data = data.filter((a) => filters.status.includes(a.status));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter((a) => a.name.toLowerCase().includes(q));
    }
    if (sortConfig) {
      data = [...data].sort((a, b) => {
        const aVal = (a.insights as Record<string, unknown>)?.[sortConfig.key] ?? 0;
        const bVal = (b.insights as Record<string, unknown>)?.[sortConfig.key] ?? 0;
        return sortConfig.direction === 'asc'
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      });
    }
    return data;
  }, [adSets, filters, sortConfig]);

  const filteredAds = useMemo(() => {
    let data = ads;
    if (filters.status.length > 0) {
      data = data.filter((a) => filters.status.includes(a.status));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter((a) => a.name.toLowerCase().includes(q));
    }
    if (sortConfig) {
      data = [...data].sort((a, b) => {
        const aVal = (a.insights as Record<string, unknown>)?.[sortConfig.key] ?? 0;
        const bVal = (b.insights as Record<string, unknown>)?.[sortConfig.key] ?? 0;
        return sortConfig.direction === 'asc'
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      });
    }
    return data;
  }, [ads, filters, sortConfig]);

  // ─ Compute selected insights object ──────────────────────────────────────────

  const selectedInsightsData = useMemo((): MetaInsights | undefined => {
    if (!selectedInsightsId) return undefined;
    const campaign = campaigns.find((c) => c.id === selectedInsightsId);
    if (campaign) return campaign.insights;
    const adSet = adSets.find((a) => a.id === selectedInsightsId);
    if (adSet) return adSet.insights;
    const ad = ads.find((a) => a.id === selectedInsightsId);
    return ad?.insights;
  }, [selectedInsightsId, campaigns, adSets, ads]);

  const selectedInsightsName = useMemo(() => {
    if (!selectedInsightsId) return '';
    return (
      campaigns.find((c) => c.id === selectedInsightsId)?.name ||
      adSets.find((a) => a.id === selectedInsightsId)?.name ||
      ads.find((a) => a.id === selectedInsightsId)?.name ||
      ''
    );
  }, [selectedInsightsId, campaigns, adSets, ads]);

  // ─ Render ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
      {/* Account Summary Bar */}
      <div className="border-b border-gray-800 bg-gray-900 px-6 py-3">
        <div className="flex items-center gap-6">
          <div className="text-xs text-gray-500">
            <span className="text-white font-medium">AdForge Demo Account</span>
            <span className="mx-2">·</span>
            <span>act_123456789</span>
          </div>
          <div className="flex gap-6 ml-4">
            {[
              { label: 'Total Spend', value: `$${accountSummary.totalSpend.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, color: 'text-white' },
              { label: 'Impressions', value: accountSummary.totalImpressions.toLocaleString(), color: 'text-blue-400' },
              { label: 'Clicks', value: accountSummary.totalClicks.toLocaleString(), color: 'text-indigo-400' },
              { label: 'Conversions', value: accountSummary.totalConversions.toLocaleString(), color: 'text-emerald-400' },
              { label: 'Avg CTR', value: `${accountSummary.avgCtr.toFixed(2)}%`, color: 'text-yellow-400' },
              { label: 'Avg ROAS', value: `${accountSummary.avgRoas.toFixed(2)}x`, color: 'text-orange-400' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`text-sm font-semibold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="flex-1" />
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {/* View Tabs + Controls */}
      <div className="border-b border-gray-800 bg-gray-900 px-6 py-2 flex items-center gap-4">
        {/* Breadcrumb Nav */}
        <div className="flex items-center gap-1 text-sm">
          <button
            onClick={() => handleViewChange('campaigns')}
            className={activeView === 'campaigns' ? 'text-white font-medium' : 'text-gray-500 hover:text-gray-300'}
          >
            Campaigns
          </button>
          {(activeView === 'ad-sets' || activeView === 'ads') && (
            <>
              <span className="text-gray-700">/</span>
              <button
                onClick={() => handleViewChange('ad-sets')}
                className={activeView === 'ad-sets' ? 'text-white font-medium' : 'text-gray-500 hover:text-gray-300'}
              >
                Ad Sets
              </button>
            </>
          )}
          {activeView === 'ads' && (
            <>
              <span className="text-gray-700">/</span>
              <span className="text-white font-medium">Ads</span>
            </>
          )}
        </div>

        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBreakdownPanelOpen(true)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2a1 1 0 011 1v10a1 1 0 01-2 0V3a1 1 0 011-1zm4 3a1 1 0 011 1v7a1 1 0 01-2 0V6a1 1 0 011-1zM4 8a1 1 0 011 1v4a1 1 0 01-2 0V9a1 1 0 011-1z" />
            </svg>
            Breakdown
          </button>
          <button
            onClick={() => setColumnCustomizerOpen(true)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            Columns
          </button>
          <button
            onClick={() => setExportModalOpen(true)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1v8m0 0l-3-3m3 3l3-3M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
            Export
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg transition-colors"
          >
            + Create
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <FiltersBar
        filters={filters}
        onFiltersChange={setFilters}
        activeView={activeView}
      />

      {/* Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          onAction={handleBulkAction}
          onClear={() => setSelectedRows(new Set())}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-500">Loading campaigns...</span>
              </div>
            </div>
          ) : (
            <>
              {activeView === 'campaigns' && (
                <CampaignTable
                  campaigns={filteredCampaigns}
                  selectedRows={selectedRows}
                  enabledColumns={enabledColumns}
                  sortConfig={sortConfig}
                  onRowSelect={handleRowSelect}
                  onSelectAll={handleSelectAll}
                  onSort={handleSort}
                  onCampaignClick={handleCampaignSelect}
                  onStatusToggle={handleStatusToggle}
                  onOpenInsights={handleOpenInsights}
                />
              )}
              {activeView === 'ad-sets' && (
                <AdSetTable
                  adSets={filteredAdSets}
                  selectedRows={selectedRows}
                  enabledColumns={enabledColumns}
                  sortConfig={sortConfig}
                  onRowSelect={handleRowSelect}
                  onSelectAll={handleSelectAll}
                  onSort={handleSort}
                  onAdSetClick={handleAdSetSelect}
                  onStatusToggle={handleStatusToggle}
                  onOpenInsights={handleOpenInsights}
                />
              )}
              {activeView === 'ads' && (
                <AdTable
                  ads={filteredAds}
                  selectedRows={selectedRows}
                  enabledColumns={enabledColumns}
                  sortConfig={sortConfig}
                  onRowSelect={handleRowSelect}
                  onSelectAll={handleSelectAll}
                  onSort={handleSort}
                  onStatusToggle={handleStatusToggle}
                  onOpenInsights={handleOpenInsights}
                />
              )}
            </>
          )}
        </div>

        {/* Insights Sidebar */}
        {insightsPanelOpen && selectedInsightsData && (
          <InsightsSidebar
            insights={selectedInsightsData}
            name={selectedInsightsName}
            onClose={() => setInsightsPanelOpen(false)}
          />
        )}
      </div>

      {/* Modals */}
      {createModalOpen && (
        <CreateCampaignModal
          onClose={() => setCreateModalOpen(false)}
          onCreated={(campaign) => {
            setCampaigns((prev) => [campaign, ...prev]);
            setCreateModalOpen(false);
          }}
        />
      )}

      {exportModalOpen && (
        <ExportModal
          data={activeView === 'campaigns' ? filteredCampaigns : activeView === 'ad-sets' ? filteredAdSets : filteredAds}
          view={activeView}
          onClose={() => setExportModalOpen(false)}
        />
      )}

      {columnCustomizerOpen && (
        <ColumnCustomizer
          columns={METRIC_COLUMNS}
          enabledColumns={enabledColumns}
          onClose={() => setColumnCustomizerOpen(false)}
          onSave={(cols) => {
            setEnabledColumns(cols);
            setColumnCustomizerOpen(false);
          }}
        />
      )}

      {breakdownPanelOpen && (
        <BreakdownPanel
          data={activeView === 'campaigns' ? filteredCampaigns : activeView === 'ad-sets' ? filteredAdSets : filteredAds}
          onClose={() => setBreakdownPanelOpen(false)}
        />
      )}
    </div>
  );
}
