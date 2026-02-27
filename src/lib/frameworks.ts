export interface AdFramework {
  id: string;
  name: string;
  description: string;
  structure: string[];
  example: {
    headline: string;
    body: string;
  };
}

export const AD_FRAMEWORKS: AdFramework[] = [
  {
    id: 'aida',
    name: 'AIDA',
    description: 'Attention, Interest, Desire, Action',
    structure: ['Grab attention with a bold headline', 'Build interest with key benefits', 'Create desire with proof/urgency', 'Drive action with clear CTA'],
    example: {
      headline: 'Stop Wasting Money on Ads That Don\'t Convert',
      body: 'Our AI-powered platform analyzes your competitors and generates high-converting ad copy in minutes. Join 10,000+ businesses already scaling.',
    }
  },
  {
    id: 'pas',
    name: 'PAS',
    description: 'Problem, Agitate, Solution',
    structure: ['Identify the pain point', 'Agitate the problem', 'Present your solution'],
    example: {
      headline: 'Tired of Writing Ad Copy That Falls Flat?',
      body: 'Hours spent crafting ads, only to see poor results. It doesn\'t have to be this way. AdForge uses AI to create proven, high-converting copy for you.',
    }
  },
  {
    id: 'fab',
    name: 'FAB',
    description: 'Features, Advantages, Benefits',
    structure: ['List key features', 'Explain advantages', 'Highlight user benefits'],
    example: {
      headline: 'AI-Powered Ad Creation with Real Results',
      body: 'Advanced AI technology → faster ad creation → more time for strategy. Create a month\'s worth of ads in one afternoon.',
    }
  },
  {
    id: 'social_proof',
    name: 'Social Proof',
    description: 'Leverage testimonials and numbers',
    structure: ['Lead with impressive stats/numbers', 'Include social proof', 'Connect to reader\'s desire'],
    example: {
      headline: '10,000+ Businesses Trust AdForge',
      body: '"Doubled our ROAS in 30 days" - Marketing Director, TechCorp. Join thousands of companies creating better ads with less effort.',
    }
  },
  {
    id: 'before_after',
    name: 'Before/After Bridge',
    description: 'Show transformation',
    structure: ['Describe current situation (before)', 'Paint the picture of after', 'Bridge with your solution'],
    example: {
      headline: 'Before: Struggling with Ad Copy. After: Converting at 3x',
      body: 'Stop spending hours writing mediocre ads. With AdForge, create AI-powered ads that convert — in minutes, not hours.',
    }
  },
  {
    id: 'urgency',
    name: 'Urgency/Scarcity',
    description: 'Create fear of missing out',
    structure: ['State what\'s at stake', 'Create urgency/scarcity', 'Direct to immediate action'],
    example: {
      headline: 'Limited Spots: AI Ad Creation at 50% Off',
      body: 'Only 100 spots remaining at our launch pricing. Lock in your rate before it expires. Start creating winning ads today.',
    }
  },
];

export function getFrameworkById(id: string): AdFramework | undefined {
  return AD_FRAMEWORKS.find(f => f.id === id);
}
