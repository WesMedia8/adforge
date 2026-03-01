// ============================================
// AdForge — Meta Insights/Analytics Route
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getInsights, extractCredentials } from '@/lib/meta-client';
import {
  MetaInsight,
  DashboardMetrics,
  InsightsDatePreset,
  InsightsLevel,
} from '@/lib/meta-types';

function aggregateInsights(insights: MetaInsight[]): DashboardMetrics {
  let totalSpend = 0;
  let totalImpressions = 0;
  let totalClicks = 0;
  let totalReach = 0;
  let purchases = 0;
  let purchaseValue = 0;

  const dailyMap = new Map<string, {
    spend: number; impressions: number; clicks: number;
    ctr: number; roas: number; purchases: number;
  }>();
  const campaignMap = new Map<string, {
    campaign_id: string; campaign_name: string;
    spend: number; impressions: number; clicks: number;
    purchases: number; purchaseValue: number;
  }>();

  for (const row of insights) {
    const spend = parseFloat(row.spend || '0');
    const impressions = parseInt(row.impressions || '0', 10);
    const clicks = parseInt(row.clicks || '0', 10);
    const reach = parseInt(row.reach || '0', 10);

    totalSpend += spend;
    totalImpressions += impressions;
    totalClicks += clicks;
    totalReach += reach;

    if (row.actions) {
      for (const action of row.actions) {
        if (action.action_type === 'purchase' || action.action_type === 'omni_purchase') {
          purchases += parseInt(action.value, 10);
        }
      }
    }
    if (row.action_values) {
      for (const av of row.action_values) {
        if (av.action_type === 'purchase' || av.action_type === 'omni_purchase') {
          purchaseValue += parseFloat(av.value);
        }
      }
    }

    const date = row.date_start;
    if (date) {
      const existing = dailyMap.get(date) || {
        spend: 0, impressions: 0, clicks: 0, ctr: 0, roas: 0, purchases: 0,
      };
      existing.spend += spend;
      existing.impressions += impressions;
      existing.clicks += clicks;
      existing.ctr = existing.impressions > 0
        ? (existing.clicks / existing.impressions) * 100
        : 0;
      dailyMap.set(date, existing);
    }

    if (row.campaign_id) {
      const cid = row.campaign_id;
      const existing = campaignMap.get(cid) || {
        campaign_id: cid,
        campaign_name: row.campaign_name || cid,
        spend: 0, impressions: 0, clicks: 0,
        purchases: 0, purchaseValue: 0,
      };
      existing.spend += spend;
      existing.impressions += impressions;
      existing.clicks += clicks;
      campaignMap.set(cid, existing);
    }
  }

  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const cpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const cpm = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0;
  const roas = totalSpend > 0 ? purchaseValue / totalSpend : 0;
  const costPerPurchase = purchases > 0 ? totalSpend / purchases : 0;

  const dailyData = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, d]) => ({ date, ...d }));

  const campaignBreakdown = Array.from(campaignMap.values()).map((c) => ({
    ...c,
    ctr: c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0,
    roas: c.spend > 0 ? c.purchaseValue / c.spend : 0,
    purchases: c.purchases,
  }));

  return {
    totalSpend,
    totalImpressions,
    totalClicks,
    totalReach,
    ctr,
    cpc,
    cpm,
    roas,
    purchases,
    purchaseValue,
    costPerPurchase,
    dailyData,
    campaignBreakdown,
  };
}

// GET /api/meta/insights?date_preset=last_7d&level=campaign
export async function GET(req: NextRequest) {
  try {
    const creds = extractCredentials(req.headers);
    const { searchParams } = new URL(req.url);
    const datePreset = (searchParams.get('date_preset') || 'last_30d') as InsightsDatePreset;
    const level = (searchParams.get('level') || 'campaign') as InsightsLevel;
    const campaignId = searchParams.get('campaign_id') || undefined;
    const since = searchParams.get('since');
    const until = searchParams.get('until');
    const raw = searchParams.get('raw') === 'true';

    const options: Parameters<typeof getInsights>[1] = {
      level,
      campaignId,
      timeIncrement: '1',
    };

    if (since && until) {
      options.timeRange = { since, until };
    } else {
      options.datePreset = datePreset;
    }

    const insights = await getInsights(creds, options);

    if (raw) {
      return NextResponse.json({ success: true, insights });
    }

    const metrics = aggregateInsights(insights);
    return NextResponse.json({ success: true, metrics });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}
