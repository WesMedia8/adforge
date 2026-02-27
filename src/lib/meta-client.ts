// ============================================
// AdForge — Meta Marketing API Client
// Credentials passed per-call (no .env required)
// ============================================

import {
  MetaApiResponse,
  MetaCampaign,
  MetaAdSet,
  MetaAd,
  MetaInsight,
  CreateCampaignPayload,
  CreateAdSetPayload,
  CreateAdPayload,
  CreateAdCreativePayload,
  ConnectionTestResult,
  InsightsDatePreset,
  InsightsLevel,
} from './meta-types';

const META_API_VERSION = 'v21.0';
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export interface MetaCredentials {
  accessToken: string;
  adAccountId: string;
}

function resolveAccountId(raw: string): string {
  return raw.startsWith('act_') ? raw : `act_${raw}`;
}

async function metaFetch<T>(
  creds: MetaCredentials,
  endpoint: string,
  options: {
    method?: string;
    params?: Record<string, string>;
    body?: Record<string, unknown>;
  } = {}
): Promise<T> {
  const { method = 'GET', params = {}, body } = options;
  const url = new URL(`${META_BASE_URL}${endpoint}`);
  url.searchParams.set('access_token', creds.accessToken);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const fetchOptions: RequestInit = { method };
  if (body && (method === 'POST' || method === 'DELETE')) {
    fetchOptions.headers = { 'Content-Type': 'application/json' };
    fetchOptions.body = JSON.stringify({ ...body, access_token: creds.accessToken });
  }
  const res = await fetch(url.toString(), fetchOptions);
  const data = await res.json();
  if (!res.ok || data.error) {
    const errMsg = data.error?.message || `Meta API error: ${res.status}`;
    throw new Error(errMsg);
  }
  return data as T;
}

export function extractCredentials(headers: Headers): MetaCredentials {
  const accessToken = headers.get('x-meta-access-token') || process.env.META_ACCESS_TOKEN || '';
  const adAccountId = headers.get('x-meta-ad-account-id') || process.env.META_AD_ACCOUNT_ID || '';
  if (!accessToken || !adAccountId) {
    throw new Error('Meta credentials not provided. Enter your Access Token and Ad Account ID in the Ads Manager setup tab.');
  }
  return { accessToken, adAccountId };
}

export async function testConnection(creds: MetaCredentials): Promise<ConnectionTestResult> {
  try {
    const accountId = resolveAccountId(creds.adAccountId);
    const data = await metaFetch<{
      id: string; name: string; account_id: string; currency: string; timezone_name: string;
    }>(creds, `/${accountId}`, {
      params: { fields: 'id,name,account_id,currency,timezone_name' },
    });
    return { connected: true, accountName: data.name, accountId: data.account_id, currency: data.currency, timezone: data.timezone_name };
  } catch (err: unknown) {
    return { connected: false, error: err instanceof Error ? err.message : 'Connection failed' };
  }
}

const CAMPAIGN_FIELDS = 'id,name,objective,status,effective_status,daily_budget,lifetime_budget,budget_remaining,created_time,updated_time,start_time,stop_time,special_ad_categories';

export async function listCampaigns(creds: MetaCredentials, limit = 50): Promise<MetaCampaign[]> {
  const accountId = resolveAccountId(creds.adAccountId);
  const data = await metaFetch<MetaApiResponse<MetaCampaign>>(creds, `/${accountId}/campaigns`, {
    params: { fields: CAMPAIGN_FIELDS, limit: String(limit) },
  });
  return data.data;
}

export async function getCampaign(creds: MetaCredentials, campaignId: string): Promise<MetaCampaign> {
  return metaFetch<MetaCampaign>(creds, `/${campaignId}`, { params: { fields: CAMPAIGN_FIELDS } });
}

export async function createCampaign(creds: MetaCredentials, payload: CreateCampaignPayload): Promise<{ id: string }> {
  const accountId = resolveAccountId(creds.adAccountId);
  return metaFetch<{ id: string }>(creds, `/${accountId}/campaigns`, {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>,
  });
}

export async function updateCampaignStatus(creds: MetaCredentials, campaignId: string, status: 'ACTIVE' | 'PAUSED' | 'DELETED'): Promise<{ success: boolean }> {
  return metaFetch<{ success: boolean }>(creds, `/${campaignId}`, { method: 'POST', body: { status } });
}

const ADSET_FIELDS = 'id,name,campaign_id,status,effective_status,daily_budget,lifetime_budget,bid_amount,billing_event,optimization_goal,targeting,start_time,end_time,created_time,updated_time';

export async function listAdSets(creds: MetaCredentials, campaignId?: string, limit = 50): Promise<MetaAdSet[]> {
  const accountId = resolveAccountId(creds.adAccountId);
  const endpoint = campaignId ? `/${campaignId}/adsets` : `/${accountId}/adsets`;
  const data = await metaFetch<MetaApiResponse<MetaAdSet>>(creds, endpoint, {
    params: { fields: ADSET_FIELDS, limit: String(limit) },
  });
  return data.data;
}

export async function createAdSet(creds: MetaCredentials, payload: CreateAdSetPayload): Promise<{ id: string }> {
  const accountId = resolveAccountId(creds.adAccountId);
  return metaFetch<{ id: string }>(creds, `/${accountId}/adsets`, {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>,
  });
}

export async function updateAdSetStatus(creds: MetaCredentials, adSetId: string, status: 'ACTIVE' | 'PAUSED' | 'DELETED'): Promise<{ success: boolean }> {
  return metaFetch<{ success: boolean }>(creds, `/${adSetId}`, { method: 'POST', body: { status } });
}

export async function createAdCreative(creds: MetaCredentials, payload: CreateAdCreativePayload): Promise<{ id: string }> {
  const accountId = resolveAccountId(creds.adAccountId);
  return metaFetch<{ id: string }>(creds, `/${accountId}/adcreatives`, {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>,
  });
}

export async function uploadAdImage(creds: MetaCredentials, imageUrl: string): Promise<{ hash: string; url: string }> {
  const accountId = resolveAccountId(creds.adAccountId);
  const url = `${META_BASE_URL}/${accountId}/adimages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: creds.accessToken, url: imageUrl }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const images = data.images;
  const firstKey = Object.keys(images)[0];
  return { hash: images[firstKey].hash, url: images[firstKey].url };
}

const AD_FIELDS = 'id,name,adset_id,campaign_id,creative{id},status,effective_status,created_time,updated_time';

export async function listAds(creds: MetaCredentials, adSetId?: string, limit = 50): Promise<MetaAd[]> {
  const accountId = resolveAccountId(creds.adAccountId);
  const endpoint = adSetId ? `/${adSetId}/ads` : `/${accountId}/ads`;
  const data = await metaFetch<MetaApiResponse<MetaAd>>(creds, endpoint, {
    params: { fields: AD_FIELDS, limit: String(limit) },
  });
  return data.data;
}

export async function createAd(creds: MetaCredentials, payload: CreateAdPayload): Promise<{ id: string }> {
  const accountId = resolveAccountId(creds.adAccountId);
  return metaFetch<{ id: string }>(creds, `/${accountId}/ads`, {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>,
  });
}

export async function updateAdStatus(creds: MetaCredentials, adId: string, status: 'ACTIVE' | 'PAUSED' | 'DELETED'): Promise<{ success: boolean }> {
  return metaFetch<{ success: boolean }>(creds, `/${adId}`, { method: 'POST', body: { status } });
}

const INSIGHT_FIELDS = [
  'impressions', 'clicks', 'spend', 'reach', 'frequency',
  'cpc', 'cpm', 'ctr', 'cpp',
  'actions', 'action_values', 'cost_per_action_type', 'purchase_roas',
  'campaign_id', 'campaign_name', 'adset_id', 'adset_name', 'ad_id', 'ad_name',
  'date_start', 'date_stop',
].join(',');

export async function getInsights(creds: MetaCredentials, options: {
  level?: InsightsLevel;
  datePreset?: InsightsDatePreset;
  timeRange?: { since: string; until: string };
  campaignId?: string;
  breakdown?: string;
  timeIncrement?: string;
  limit?: number;
}): Promise<MetaInsight[]> {
  const accountId = resolveAccountId(creds.adAccountId);
  const { level = 'account', datePreset, timeRange, campaignId, breakdown, timeIncrement = '1', limit = 500 } = options;
  const endpoint = campaignId ? `/${campaignId}/insights` : `/${accountId}/insights`;
  const params: Record<string, string> = {
    fields: INSIGHT_FIELDS, level, time_increment: timeIncrement, limit: String(limit),
  };
  if (datePreset) { params.date_preset = datePreset; }
  else if (timeRange) { params.time_range = JSON.stringify(timeRange); }
  else { params.date_preset = 'last_30d'; }
  if (breakdown) { params.breakdowns = breakdown; }
  const data = await metaFetch<MetaApiResponse<MetaInsight>>(creds, endpoint, { params });
  return data.data;
}

export async function listPages(creds: MetaCredentials): Promise<Array<{ id: string; name: string; access_token?: string }>> {
  const data = await metaFetch<MetaApiResponse<{ id: string; name: string; access_token?: string }>>(
    creds, '/me/accounts', { params: { fields: 'id,name,access_token' } }
  );
  return data.data;
}
