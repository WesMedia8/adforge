import { NextRequest, NextResponse } from 'next/server';
import { createMetaClient } from '@/lib/meta-client';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adSetId = searchParams.get('adset_id');
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
    
    let ads;
    if (adSetId) {
      ads = await metaClient.getAds(adSetId);
    } else {
      // Get all ads across all adsets - would need adset IDs
      ads = { data: [] };
    }

    return NextResponse.json(ads);
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, adSetId, adData } = body;

    if (!userId || !adSetId) {
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
    const result = await metaClient.createAd(adSetId, adData);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating ad:', error);
    return NextResponse.json(
      { error: 'Failed to create ad' },
      { status: 500 }
    );
  }
}
