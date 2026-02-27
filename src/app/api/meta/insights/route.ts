import { NextRequest, NextResponse } from 'next/server';
import { createMetaClient } from '@/lib/meta-client';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const objectId = searchParams.get('object_id');
    const datePreset = searchParams.get('date_preset') || 'last_30d';

    if (!userId || !objectId) {
      return NextResponse.json({ error: 'User ID and Object ID required' }, { status: 400 });
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
    const insights = await metaClient.getInsights(objectId, datePreset);

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}
