// ============================================
// AdForge — Meta Ads Manager Hook
// Credentials stored in-memory, passed via headers
// ============================================

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  MetaCampaign,
  MetaAdSet,
  MetaAd,
  DashboardMetrics,
  ConnectionTestResult,
  InsightsDatePreset,
} from '@/lib/meta-types';

// ─── Credential type (browser-side) ────────────
export interface MetaCredentialsInput {
  accessToken: string;
  adAccountId: string;
}

// Build headers for every API call
function credHeaders(creds: MetaCredentialsInput): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-meta-access-token': creds.accessToken,
    'x-meta-ad-account-id': creds.adAccountId,
  };
}

export function useMetaAds() {
  // ─── Credentials ──────────────────────────────
  const [credentials, setCredentials] = useState<MetaCredentialsInput>({
    accessToken: '',
    adAccountId: '',
  });
  const credsRef = useRef(credentials);
  credsRef.current = credentials;

  const hasCredentials = !!(credentials.accessToken && credentials.adAccountId);

  // ─── State ───────────────────────────────────
  const [connection, setConnection] = useState<ConnectionTestResult | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([]);
  const [adSets, setAdSets] = useState<MetaAdSet[]>([]);
  const [ads, setAds] = useState<MetaAd[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [datePreset, setDatePreset] = useState<InsightsDatePreset>('last_7d');
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  // ─── Connection ─────────────────────────────
  const testConnection = useCallback(async (creds?: MetaCredentialsInput) => {
    const c = creds || credsRef.current;
    if (!c.accessToken || !c.adAccountId) {
      const result: ConnectionTestResult = { connected: false, error: 'Please enter your Access Token and Ad Account ID.' };
      setConnection(result);
      return result;
    }
    setConnecting(true);
    setError(null);
    try {
      const res = await fetch('/api/meta/connect', {
        method: 'POST',
        headers: credHeaders(c),
      });
      const data = await res.json();
      setConnection(data);
      if (creds) setCredentials(creds);
      return data as ConnectionTestResult;
    } catch (err) {
      const result: ConnectionTestResult = {
        connected: false,
        error: err instanceof Error ? err.message : 'Connection failed',
      };
      setConnection(result);
      return result;
    } finally {
      setConnecting(false);
    }
  }, []);

  // ─── Campaigns ──────────────────────────────
  const fetchCampaigns = useCallback(async () => {
    if (!credsRef.current.accessToken) return;
    setLoadingCampaigns(true);
    setError(null);
    try {
      const res = await fetch('/api/meta/campaigns', {
        headers: credHeaders(credsRef.current),
      });
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns || []);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setLoadingCampaigns(false);
    }
  }, []);

  const createCampaign = useCallback(async (payload: {
    name: string;
    objective: string;
    daily_budget?: number;
    lifetime_budget?: number;
    status?: string;
    special_ad_categories?: string[];
  }) => {
    setError(null);
    try {
      const res = await fetch('/api/meta/campaigns', {
        method: 'POST',
        headers: credHeaders(credsRef.current),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCampaigns();
        return data.id;
      } else {
        setError(data.error);
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
      return null;
    }
  }, [fetchCampaigns]);

  const updateCampaignStatus = useCallback(async (campaignId: string, status: 'ACTIVE' | 'PAUSED' | 'DELETED') => {
    setError(null);
    try {
      const res = await fetch('/api/meta/campaigns', {
        method: 'POST',
        headers: credHeaders(credsRef.current),
        body: JSON.stringify({ action: 'update_status', campaignId, status }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCampaigns();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status update failed');
    }
  }, [fetchCampaigns]);

  // ─── Ad Sets ──────────────────────────────
  const fetchAdSets = useCallback(async (campaignId?: string) => {
    try {
      const url = campaignId
        ? `/api/meta/adsets?campaign_id=${campaignId}`
        : '/api/meta/adsets';
      const res = await fetch(url, {
        headers: credHeaders(credsRef.current),
      });
      const data = await res.json();
      if (data.success) setAdSets(data.adSets || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ad sets');
    }
  }, []);

  const createAdSet = useCallback(async (payload: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/meta/adsets', {
        method: 'POST',
        headers: credHeaders(credsRef.current),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAdSets(payload.campaign_id as string);
        return data.id;
      } else {
        setError(data.error);
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ad set');
      return null;
    }
  }, [fetchAdSets]);

  const updateAdSetStatus = useCallback(async (adSetId: string, status: 'ACTIVE' | 'PAUSED' | 'DELETED') => {
    try {
      await fetch('/api/meta/adsets', {
        method: 'POST',
        headers: credHeaders(credsRef.current),
        body: JSON.stringify({ action: 'update_status', adSetId, status }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status update failed');
    }
  }, []);

  // ─── Ads ────────────────────────────────────
  const fetchAds = useCallback(async (adSetId?: string) => {
    try {
      const url = adSetId ? `/api/meta/ads?adset_id=${adSetId}` : '/api/meta/ads';
      const res = await fetch(url, {
        headers: credHeaders(credsRef.current),
      });
      const data = await res.json();
      if (data.success) setAds(data.ads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ads');
    }
  }, []);

  const createAdWithCreative = useCallback(async (payload: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/meta/ads', {
        method: 'POST',
        headers: credHeaders(credsRef.current),
        body: JSON.stringify({ action: 'create_with_creative', ...payload }),
      });
      const data = await res.json();
      if (data.success) return { adId: data.ad_id, creativeId: data.creative_id };
      setError(data.error);
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ad');
      return null;
    }
  }, []);

  const updateAdStatus = useCallback(async (adId: string, status: 'ACTIVE' | 'PAUSED' | 'DELETED') => {
    try {
      await fetch('/api/meta/ads', {
        method: 'POST',
        headers: credHeaders(credsRef.current),
        body: JSON.stringify({ action: 'update_status', adId, status }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status update failed');
    }
  }, []);

  // ─── Pages ──────────────────────────────────
  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch('/api/meta/ads', {
        method: 'POST',
        headers: credHeaders(credsRef.current),
        body: JSON.stringify({ action: 'list_pages' }),
      });
      const data = await res.json();
      return data.pages || [];
    } catch {
      return [];
    }
  }, []);

  // ─── Insights ───────────────────────────────
  const fetchMetrics = useCallback(async (preset?: InsightsDatePreset, campaignId?: string) => {
    if (!credsRef.current.accessToken) return;
    setLoadingMetrics(true);
    try {
      const dp = preset || datePreset;
      const params = new URLSearchParams({
        date_preset: dp,
        level: 'campaign',
      });
      if (campaignId) params.set('campaign_id', campaignId);

      const res = await fetch(`/api/meta/insights?${params.toString()}`, {
        headers: credHeaders(credsRef.current),
      });
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch insights');
    } finally {
      setLoadingMetrics(false);
    }
  }, [datePreset]);

  // Auto-refresh metrics every 5 minutes when connected
  const startAutoRefresh = useCallback(() => {
    if (refreshInterval.current) clearInterval(refreshInterval.current);
    refreshInterval.current = setInterval(() => {
      fetchMetrics();
    }, 5 * 60 * 1000);
  }, [fetchMetrics]);

  const stopAutoRefresh = useCallback(() => {
    if (refreshInterval.current) {
      clearInterval(refreshInterval.current);
      refreshInterval.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopAutoRefresh();
  }, [stopAutoRefresh]);

  return {
    // Credentials
    credentials,
    setCredentials,
    hasCredentials,
    // Connection
    connection,
    connecting,
    testConnection,
    // Campaigns
    campaigns,
    loadingCampaigns,
    fetchCampaigns,
    createCampaign,
    updateCampaignStatus,
    // Ad Sets
    adSets,
    fetchAdSets,
    createAdSet,
    updateAdSetStatus,
    // Ads
    ads,
    fetchAds,
    createAdWithCreative,
    updateAdStatus,
    fetchPages,
    // Insights
    metrics,
    loadingMetrics,
    datePreset,
    setDatePreset,
    fetchMetrics,
    startAutoRefresh,
    stopAutoRefresh,
    // Shared
    error,
    setError,
  };
}
