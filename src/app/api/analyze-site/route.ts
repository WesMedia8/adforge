import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';
import axios from 'axios';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Fetch the website content
    let siteContent = '';
    let siteTitle = '';
    let siteDescription = '';

    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      siteTitle = $('title').text() || '';
      siteDescription = $('meta[name="description"]').attr('content') || '';
      
      // Extract main content
      $('script, style, nav, footer, header').remove();
      siteContent = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 3000);
    } catch (fetchError) {
      console.error('Error fetching site:', fetchError);
      // Continue with just the URL if we can't fetch
    }

    const prompt = `Analyze this website and extract key business information for ad creation.

URL: ${url}
Title: ${siteTitle}
Description: ${siteDescription}
Content: ${siteContent}

Provide a JSON response with:
{
  "businessName": "name of the business",
  "industry": "industry/niche",
  "mainProduct": "primary product or service",
  "targetAudience": "who they target",
  "valueProposition": "main value proposition",
  "keyBenefits": ["benefit1", "benefit2", "benefit3"],
  "tone": "brand tone (professional/casual/luxury/etc)",
  "callToAction": "typical CTA used"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing site:', error);
    return NextResponse.json(
      { error: 'Failed to analyze site' },
      { status: 500 }
    );
  }
}
