import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { 
      businessName,
      industry,
      product,
      targetAudience,
      valueProposition,
      competitors,
      goals
    } = await request.json();

    const prompt = `You are an expert digital marketing strategist specializing in Meta (Facebook/Instagram) advertising.

Conduct comprehensive ad research for:
Business: ${businessName}
Industry: ${industry}
Product/Service: ${product}
Target Audience: ${targetAudience}
Value Proposition: ${valueProposition}
Competitors: ${competitors?.join(', ')}
Campaign Goals: ${goals?.join(', ')}

Provide detailed research in JSON format:
{
  "audienceInsights": {
    "primaryPersonas": [
      {
        "name": "persona name",
        "age": "age range",
        "interests": ["interest1", "interest2"],
        "painPoints": ["pain1", "pain2"],
        "motivations": ["motivation1"],
        "platforms": ["Facebook", "Instagram"]
      }
    ],
    "targetingRecommendations": {
      "interests": ["interest1", "interest2"],
      "behaviors": ["behavior1"],
      "demographics": {
        "ageRange": "25-45",
        "gender": "all/male/female",
        "locations": ["location1"]
      }
    }
  },
  "messagingStrategy": {
    "primaryHook": "main message hook",
    "emotionalTriggers": ["trigger1", "trigger2"],
    "objectionHandlers": ["objection and response"],
    "socialProofAngles": ["angle1"]
  },
  "adFormatStrategy": {
    "recommendedFormats": [
      {
        "format": "Single Image",
        "rationale": "why this format works",
        "bestFor": "use case"
      }
    ],
    "placementStrategy": ["Feed", "Stories", "Reels"]
  },
  "competitorAnalysis": {
    "gaps": ["gap1", "gap2"],
    "differentiators": ["differentiator1"]
  },
  "budgetGuidance": {
    "minimumTestBudget": "$X/day",
    "recommendedBudget": "$X/day",
    "splitRecommendation": "description"
  }
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const research = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(research);
  } catch (error) {
    console.error('Error generating research:', error);
    return NextResponse.json(
      { error: 'Failed to generate research' },
      { status: 500 }
    );
  }
}
