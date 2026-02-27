import { NextRequest, NextResponse } from 'next/server';
import { listAdSets, createAdSet, updateAdSetStatus, extractCredentials } from '@/lib/meta-client';
import { CreateAdSetPayload } from '@/lib/meta-types';

export async function GET(req: NextRequest) {
  try {
    const creds = extractCredentials(req.headers);
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaign_id') || undefined;
    const adSets = await listAdSets(creds, campaignId);
    return NextResponse.json({ success: true, adSets });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Failed to fetch ad sets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const creds = extractCredentials(req.headers);
    const body = await req.json();
    const { action, adSetId, status, ...adSetData } = body;
    if (action === 'update_status' && adSetId && status) {
      const result = await updateAdSetStatus(creds, adSetId, status);
      return NextResponse.json({ success: true, result });
    }
    const payload: CreateAdSetPayload = {
      name: adSetData.name,
      campaign_id: adSetData.campaign_id,
      status: adSetData.status || 'PAUSED',
      billing_event: adSetData.billing_event || 'IMPRESSIONS',
      optimization_goal: adSetData.optimization_goal || 'LINK_CLICKS',
      targeting: adSetData.targeting || { geo_locations: { countries: ['US'] } },
    };
    if (adSetData.daily_budget) payload.daily_budget = String(Math.round(Number(adSetData.daily_budget) * 100));
    if (adSetData.lifetime_budget) payload.lifetime_budget = String(Math.round(Number(adSetData.lifetime_budget) * 100));
    if (adSetData.start_time) payload.start_time = adSetData.start_time;
    if (adSetData.end_time) payload.end_time = adSetData.end_time;
    const result = await createAdSet(creds, payload);
    return NextResponse.json({ success: true, id: result.id });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Ad set operation failed' }, { status: 500 });
  }
}
