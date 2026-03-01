import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, style, format } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Determine size based on format
    let size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024';
    if (format === 'landscape' || format === 'banner') {
      size = '1792x1024';
    } else if (format === 'portrait' || format === 'story') {
      size = '1024x1792';
    }

    // Build enhanced prompt
    const styleGuide = style === 'professional' 
      ? 'professional, clean, corporate style'
      : style === 'lifestyle'
      ? 'lifestyle photography style, authentic, warm'
      : style === 'minimalist'
      ? 'minimalist design, clean white space, simple'
      : style === 'bold'
      ? 'bold colors, high contrast, attention-grabbing'
      : 'high quality, professional';

    const enhancedPrompt = `${prompt}. Style: ${styleGuide}. High quality advertising image, suitable for Meta/Facebook/Instagram ads. No text overlay.`;

    const response = await getOpenAI().images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size,
      quality: 'standard',
    });

    const imageUrl = response.data?.[0]?.url;
    const revisedPrompt = response.data?.[0]?.revised_prompt;

    return NextResponse.json({
      success: true,
      image_url: imageUrl,
      imageUrl,
      revisedPrompt,
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    
    if (error?.error?.code === 'content_policy_violation') {
      return NextResponse.json(
        { error: 'Image content policy violation. Please modify your prompt.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
