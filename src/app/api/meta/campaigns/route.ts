import { NextRequest, NextResponse } from 'next/server';
import { createMetaClient } from '@/lib/meta-client';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: connection } = await supabase
      .from('meta_connections')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!connection) {
      return NextResponse.json({ error: 'No Meta connection found' }, { status: 404 });
    }

    const metaClient = createMetaClient(connection.access_token);
    const campaigns = await metaClient.getCampaigns(connection.ad_account_id);

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, campaignData } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: connection } = await supabase
      .from('meta_connections')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!connection) {
      return NextResponse.json({ error: 'No Meta connection found' }, { status: 404 });
    }

    const metaClient = createMetaClient(connection.access_token);
    const result = await metaClient.createCampaign(connection.ad_account_id, campaignData);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
