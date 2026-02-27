import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { competitors, industry, product } = await request.json();

    // Try to use ScrapingBee to get Meta Ad Library data
    const competitorAds: any[] = [];
    
    if (process.env.SCRAPINGBEE_API_KEY && competitors?.length > 0) {
      for (const competitor of competitors.slice(0, 3)) {
        try {
          const adLibraryUrl = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=${encodeURIComponent(competitor)}&search_type=keyword_unordered`;
          
          const response = await axios.get('https://app.scrapingbee.com/api/v1/', {
            params: {
              api_key: process.env.SCRAPINGBEE_API_KEY,
              url: adLibraryUrl,
              render_js: true,
              wait: 3000,
            },
            timeout: 30000,
          });

          // Parse the response to extract ad data
          // This is simplified - real implementation would parse the HTML
          competitorAds.push({
            competitor,
            source: 'Meta Ad Library',
            rawHtml: response.data.substring(0, 500),
          });
        } catch (err) {
          console.error(`Error fetching ads for ${competitor}:`, err);
        }
      }
    }

    // Use AI to generate insights about competitor ads
    const prompt = `You are an expert ad strategist. Based on the following information about competitors in the ${industry} industry selling ${product}, provide strategic ad insights.

Competitors: ${JSON.stringify(competitors)}
Ad data collected: ${JSON.stringify(competitorAds)}

Provide a comprehensive JSON response with:
{
  "competitors": [
    {
      "name": "competitor name",
      "estimatedAdSpend": "low/medium/high",
      "primaryMessages": ["message1", "message2"],
      "adFormats": ["format1", "format2"],
      "targetingApproach": "description",
      "strengths": ["strength1"],
      "weaknesses": ["weakness1"]
    }
  ],
  "marketInsights": {
    "commonThemes": ["theme1", "theme2"],
    "gaps": ["gap1", "gap2"],
    "opportunities": ["opportunity1", "opportunity2"]
  },
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing competitor ads:', error);
    return NextResponse.json(
      { error: 'Failed to analyze competitor ads' },
      { status: 500 }
    );
  }
}
