// ============================================
// AdForge — Meta Marketing API Types
// ============================================

// ─── Connection & Config ─────────────────────
export interface MetaConfig {
  appId: string;
  appSecret: string;
  accessToken: string; // System User token (long-lived)
  adAccountId: string; // Format: act_XXXXXXXX
}

// ─── Campaign ─────────────────────────────────
export type CampaignObjective =
  | 'OUTCOME_SALES'
  | 'OUTCOME_LEADS'
  | 'OUTCOME_TRAFFIC'
  | 'OUTCOME_AWARENESS'
  | 'OUTCOME_ENGAGEMENT'
  | 'OUTCOME_APP_PROMOTION';

export type CampaignStatus =
  | 'ACTIVE'
  | 'PAUSED'
  | 'DELETED'
  | 'ARCHIVED';

export type EffectiveStatus =
  | 'ACTIVE'
  | 'PAUSED'
  | 'DELETED'
  | 'ARCHIVED'
  | 'IN_PROCESS'
  | 'WITH_ISSUES'
  | 'CAMPAIGN_PAUSED'
  | 'ADSET_PAUSED'
  | 'DISAPPROVED'
  | 'PENDING_REVIEW'
  | 'PREAPPROVED'
  | 'PENDING_BILLING_INFO';

export interface MetaCampaign {
  id: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  effective_status: EffectiveStatus;
  daily_budget?: string; // In cents
  lifetime_budget?: string;
  budget_remaining?: string;
  created_time: string;
  updated_time: string;
  start_time?: string;
  stop_time?: string;
  special_ad_categories: string[];
}

export interface CreateCampaignPayload {
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  daily_budget?: string; // In cents (e.g., "5000" = $50.00)
  lifetime_budget?: string;
  special_ad_categories?: string[];
}

// ─── Ad Set ───────────────────────────────────
export type BillingEvent = 'IMPRESSIONS' | 'LINK_CLICKS' | 'APP_INSTALLS';
export type OptimizationGoal =
  | 'LINK_CLICKS'
  | 'LANDING_PAGE_VIEWS'
  | 'IMPRESSIONS'
  | 'REACH'
  | 'CONVERSIONS'
  | 'VALUE'
  | 'LEAD_GENERATION'
  | 'APP_INSTALLS';

export interface TargetingSpec {
  geo_locations?: {
    countries?: string[];
    regions?: Array<{ key: string }>;
    cities?: Array<{ key: string; radius?: number; distance_unit?: string }>;
  };
  age_min?: number;
  age_max?: number;
  genders?: number[]; // 1=Male, 2=Female
  interests?: Array<{ id: string; name: string }>;
  custom_audiences?: Array<{ id: string }>;
  excluded_custom_audiences?: Array<{ id: string }>;
  publisher_platforms?: string[];
  facebook_positions?: string[];
  instagram_positions?: string[];
}

export interface MetaAdSet {
  id: string;
  name: string;
  campaign_id: string;
  status: CampaignStatus;
  effective_status: EffectiveStatus;
  daily_budget?: string;
  lifetime_budget?: string;
  bid_amount?: string;
  billing_event: BillingEvent;
  optimization_goal: OptimizationGoal;
  targeting: TargetingSpec;
  start_time?: string;
  end_time?: string;
  created_time: string;
  updated_time: string;
}

export interface CreateAdSetPayload {
  name: string;
  campaign_id: string;
  status: CampaignStatus;
  daily_budget?: string;
  lifetime_budget?: string;
  billing_event: BillingEvent;
  optimization_goal: OptimizationGoal;
  targeting: TargetingSpec;
  start_time?: string;
  end_time?: string;
  bid_strategy?: string;
}

// ─── Ad Creative ──────────────────────────────
export interface MetaAdCreative {
  id: string;
  name: string;
  title?: string;
  body?: string;
  image_hash?: string;
  image_url?: string;
  link_url?: string;
  call_to_action_type?: string;
  object_story_spec?: {
    page_id: string;
    link_data?: {
      link: string;
      message: string;
      name: string;
      description?: string;
      image_hash?: string;
      call_to_action?: {
        type: string;
        value?: { link: string };
      };
    };
  };
}

export interface CreateAdCreativePayload {
  name: string;
  object_story_spec: {
    page_id: string;
    link_data: {
      link: string;
      message: string;
      name: string;
      description?: string;
      image_hash?: string;
      call_to_action?: {
        type: string;
        value?: { link: string };
      };
    };
  };
}

// ─── Ad ───────────────────────────────────────
export interface MetaAd {
  id: string;
  name: string;
  adset_id: string;
  campaign_id?: string;
  creative: { id: string };
  status: CampaignStatus;
  effective_status: EffectiveStatus;
  created_time: string;
  updated_time: string;
}

export interface CreateAdPayload {
  name: string;
  adset_id: string;
  creative: { creative_id: string };
  status: CampaignStatus;
}

// ─── Insights / Analytics ─────────────────────
export type InsightsDatePreset =
  | 'today'
  | 'yesterday'
  | 'this_month'
  | 'last_month'
  | 'last_3d'
  | 'last_7d'
  | 'last_14d'
  | 'last_28d'
  | 'last_30d'
  | 'last_90d';

export type InsightsLevel = 'account' | 'campaign' | 'adset' | 'ad';

export interface InsightsBreakdown {
  age?: string;
  gender?: string;
  country?: string;
  placement?: string;
  platform_position?: string;
  publisher_platform?: string;
  device_platform?: string;
}

export interface MetaInsight {
  // Identifiers
  account_id?: string;
  campaign_id?: string;
  campaign_name?: string;
  adset_id?: string;
  adset_name?: string;
  ad_id?: string;
  ad_name?: string;

  // Time
  date_start: string;
  date_stop: string;

  // Core metrics
  impressions: string;
  clicks: string;
  spend: string;
  reach: string;
  frequency: string;

  // Engagement
  cpc: string;  // Cost per click
  cpm: string;  // Cost per 1000 impressions
  ctr: string;  // Click-through rate
  cpp: string;  // Cost per 1000 people reached

  // Conversions
  actions?: Array<{
    action_type: string;
    value: string;
  }>;
  action_values?: Array<{
    action_type: string;
    value: string;
  }>;
  cost_per_action_type?: Array<{
    action_type: string;
    value: string;
  }>;

  // Attribution
  purchase_roas?: Array<{
    action_type: string;
    value: string;
  }>;

  // Breakdowns
  age?: string;
  gender?: string;
  country?: string;
}

// ─── Aggregated Dashboard Metrics ─────────────
export interface DashboardMetrics {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalReach: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  purchases: number;
  purchaseValue: number;
  costPerPurchase: number;
  // Time series
  dailyData: Array<{
    date: string;
    spend: number;
    impressions: number;
    clicks: number;
    ctr: number;
    roas: number;
    purchases: number;
  }>;
  // Per-campaign breakdown
  campaignBreakdown: Array<{
    campaign_id: string;
    campaign_name: string;
    spend: number;
    impressions: number;
    clicks: number;
    ctr: number;
    roas: number;
    purchases: number;
  }>;
}

// ─── API Response Wrappers ────────────────────
export interface MetaApiResponse<T> {
  data: T[];
  paging?: {
    cursors?: {
      before: string;
      after: string;
    };
    next?: string;
    previous?: string;
  };
}

export interface MetaApiError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
}

// ─── Connection Test ──────────────────────────
export interface ConnectionTestResult {
  connected: boolean;
  accountName?: string;
  accountId?: string;
  currency?: string;
  timezone?: string;
  error?: string;
}
