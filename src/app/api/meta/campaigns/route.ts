import { NextRequest, NextResponse } from 'next/server';
import { listCampaigns, getCampaign, createCampaign, updateCampaignStatus, extractCredentials } from '@/lib/meta-client';
import { CreateCampaignPayload } from '@/lib/meta-types';

export async function GET(req: NextRequest) {
  try {
    const creds = extractCredentials(req.headers);
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('id');
    if (campaignId) {
      const campaign = await getCampaign(creds, campaignId);
      return NextResponse.json({ success: true, campaign });
    }
    const campaigns = await listCampaigns(creds);
    return NextResponse.json({ success: true, campaigns });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const creds = extractCredentials(req.headers);
    const body = await req.json();
    const { action, campaignId, status, ...campaignData } = body;
    if (action === 'update_status' && campaignId && status) {
      const result = await updateCampaignStatus(creds, campaignId, status);
      return NextResponse.json({ success: true, result });
    }
    const payload: CreateCampaignPayload = {
      name: campaignData.name,
      objective: campaignData.objective || 'OUTCOME_SALES',
      status: campaignData.status || 'PAUSED',
      special_ad_categories: campaignData.special_ad_categories || [],
    };
    if (campaignData.daily_budget) payload.daily_budget = String(Math.round(Number(campaignData.daily_budget) * 100));
    if (campaignData.lifetime_budget) payload.lifetime_budget = String(Math.round(Number(campaignData.lifetime_budget) * 100));
    const result = await createCampaign(creds, payload);
    return NextResponse.json({ success: true, id: result.id });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Campaign operation failed' }, { status: 500 });
  }
}
