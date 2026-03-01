// ============================================
// AdForge — Meta Connection Test Route
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { testConnection, extractCredentials } from '@/lib/meta-client';

export async function POST(req: NextRequest) {
  try {
    const creds = extractCredentials(req.headers);
    const result = await testConnection(creds);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json(
      { connected: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
