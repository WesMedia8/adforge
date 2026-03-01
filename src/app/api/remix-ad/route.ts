import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: NextRequest) {
  try {
    const { ad, remixType, customInstructions } = await request.json();

    if (!ad) {
      return NextResponse.json({ error: 'Ad data is required' }, { status: 400 });
    }

    let remixInstructions = '';
    
    switch (remixType) {
      case 'tone':
        remixInstructions = `Change the tone of the ad. If it's formal, make it casual. If casual, make it more professional. Keep the core message but adjust the voice and style.`;
        break;
      case 'audience':
        remixInstructions = `Adapt this ad for a different audience segment. Consider different demographics, psychographics, or life stages that might also benefit from this product/service.`;
        break;
      case 'format':
        remixInstructions = `Restructure this ad for a different format. If it's a long-form ad, create a punchy short version. If short, expand with more detail and storytelling.`;
        break;
      case 'hook':
        remixInstructions = `Completely rewrite the opening hook/headline while keeping the body and CTA. Make it more attention-grabbing and scroll-stopping.`;
        break;
      case 'custom':
        remixInstructions = customInstructions || 'Improve this ad based on best practices.';
        break;
      default:
        remixInstructions = 'Improve and optimize this ad while keeping the core message.';
    }

    const prompt = `You are an expert Meta ads copywriter. Remix this ad according to these instructions:

${remixInstructions}

Original Ad:
Headline: ${ad.headline}
Body: ${ad.body}
CTA: ${ad.cta}
Description: ${ad.description || ''}

Provide the remixed version as JSON:
{
  "headline": "new headline (max 40 chars)",
  "body": "new body copy (max 125 chars for feed)",
  "cta": "call to action button text",
  "description": "link description (optional, max 30 chars)",
  "changesSummary": "brief explanation of changes made"
}`;

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const remixed = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(remixed);
  } catch (error) {
    console.error('Error remixing ad:', error);
    return NextResponse.json(
      { error: 'Failed to remix ad' },
      { status: 500 }
    );
  }
}
