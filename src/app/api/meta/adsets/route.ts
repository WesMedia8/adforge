import { NextRequest, NextResponse } from 'next/server';
import { createMetaClient } from '@/lib/meta-client';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaign_id');
    const userId = searchParams.get('user_id');

    if (!userId || !campaignId) {
      return NextResponse.json({ error: 'User ID and Campaign ID required' }, { status: 400 });
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
    const adSets = await metaClient.getAdSets(campaignId);

    return NextResponse.json(adSets);
  } catch (error) {
    console.error('Error fetching ad sets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ad sets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, campaignId, adSetData } = body;

    if (!userId || !campaignId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
    const result = await metaClient.createAdSet(campaignId, adSetData);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating ad set:', error);
    return NextResponse.json(
      { error: 'Failed to create ad set' },
      { status: 500 }
    );
  }
}
