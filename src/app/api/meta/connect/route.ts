import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { userId, accessToken, adAccountId } = await request.json();

    if (!userId || !accessToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Encrypt the access token before storing
    const encryptionKey = process.env.ENCRYPTION_KEY;
    let encryptedToken = accessToken;
    
    if (encryptionKey) {
      const iv = crypto.randomBytes(16);
      const key = Buffer.from(encryptionKey, 'hex');
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      encryptedToken = iv.toString('hex') + ':' + 
        cipher.update(accessToken, 'utf8', 'hex') + 
        cipher.final('hex');
    }

    const supabase = createClient();
    
    // Upsert the connection
    const { data, error } = await supabase
      .from('meta_connections')
      .upsert({
        user_id: userId,
        access_token: encryptedToken,
        ad_account_id: adAccountId,
        connected_at: new Date().toISOString(),
        is_active: true,
      }, {
        onConflict: 'user_id',
      });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save connection' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Meta account connected successfully' });
  } catch (error) {
    console.error('Error connecting Meta account:', error);
    return NextResponse.json(
      { error: 'Failed to connect Meta account' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('meta_connections')
      .update({ is_active: false })
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting Meta account:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Meta account' },
      { status: 500 }
    );
  }
}
