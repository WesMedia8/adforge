import { NextRequest, NextResponse } from 'next/server';
import { listAds, createAd, updateAdStatus, createAdCreative, uploadAdImage, listPages, extractCredentials } from '@/lib/meta-client';
import { CreateAdPayload } from '@/lib/meta-types';

export async function GET(req: NextRequest) {
  try {
    const creds = extractCredentials(req.headers);
    const { searchParams } = new URL(req.url);
    const adSetId = searchParams.get('adset_id') || undefined;
    const ads = await listAds(creds, adSetId);
    return NextResponse.json({ success: true, ads });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Failed to fetch ads' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const creds = extractCredentials(req.headers);
    const body = await req.json();
    const { action, adId, status, ...adData } = body;
    if (action === 'update_status' && adId && status) {
      const result = await updateAdStatus(creds, adId, status);
      return NextResponse.json({ success: true, result });
    }
    if (action === 'list_pages') {
      const pages = await listPages(creds);
      return NextResponse.json({ success: true, pages });
    }
    if (action === 'upload_image' && adData.image_url) {
      const result = await uploadAdImage(creds, adData.image_url);
      return NextResponse.json({ success: true, ...result });
    }
    if (action === 'create_with_creative') {
      let imageHash: string | undefined;
      if (adData.image_url) {
        const img = await uploadAdImage(creds, adData.image_url);
        imageHash = img.hash;
      }
      const creative = await createAdCreative(creds, {
        name: `${adData.name} - Creative`,
        object_story_spec: {
          page_id: adData.page_id,
          link_data: {
            link: adData.link_url || adData.website_url,
            message: adData.primary_text || '',
            name: adData.headline || '',
            description: adData.description || '',
            image_hash: imageHash,
            call_to_action: adData.cta_type ? { type: adData.cta_type, value: { link: adData.link_url || adData.website_url } } : undefined,
          },
        },
      });
      const ad = await createAd(creds, { name: adData.name, adset_id: adData.adset_id, creative: { creative_id: creative.id }, status: adData.status || 'PAUSED' });
      return NextResponse.json({ success: true, ad_id: ad.id, creative_id: creative.id });
    }
    const payload: CreateAdPayload = { name: adData.name, adset_id: adData.adset_id, creative: { creative_id: adData.creative_id }, status: adData.status || 'PAUSED' };
    const result = await createAd(creds, payload);
    return NextResponse.json({ success: true, id: result.id });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Ad operation failed' }, { status: 500 });
  }
}
