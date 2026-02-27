import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { rawResearch } = await request.json();

    if (!rawResearch) {
      return NextResponse.json({ error: 'Research content is required' }, { status: 400 });
    }

    const prompt = `Parse and structure the following market research for Meta ad creation:

${rawResearch}

Extract and structure this information as JSON:
{
  "targetAudience": {
    "demographics": "age, gender, location info",
    "psychographics": "interests, values, lifestyle",
    "painPoints": ["pain1", "pain2"],
    "desires": ["desire1", "desire2"]
  },
  "productInsights": {
    "mainBenefit": "primary benefit",
    "uniqueSellingPoints": ["usp1", "usp2"],
    "proofPoints": ["proof1", "proof2"]
  },
  "competitiveContext": {
    "mainCompetitors": ["competitor1"],
    "differentiators": ["diff1", "diff2"]
  },
  "messagingAngles": [
    {
      "angle": "angle name",
      "headline": "example headline",
      "description": "why this works"
    }
  ],
  "callToActions": ["cta1", "cta2"]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error parsing research:', error);
    return NextResponse.json(
      { error: 'Failed to parse research' },
      { status: 500 }
    );
  }
}
