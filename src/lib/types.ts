import { CopyVariant } from './copy-variants';

export interface ResearchData {
  audienceInsights: {
    primaryPersonas: Array<{
      name: string;
      age: string;
      interests: string[];
      painPoints: string[];
      motivations: string[];
      platforms: string[];
    }>;
    targetingRecommendations: {
      interests: string[];
      behaviors: string[];
      demographics: {
        ageRange: string;
        gender: string;
        locations: string[];
      };
    };
  };
  messagingStrategy: {
    primaryHook: string;
    emotionalTriggers: string[];
    objectionHandlers: string[];
    socialProofAngles: string[];
  };
  adFormatStrategy: {
    recommendedFormats: Array<{
      format: string;
      rationale: string;
      bestFor: string;
    }>;
    placementStrategy: string[];
  };
  competitorAnalysis: {
    gaps: string[];
    differentiators: string[];
  };
  budgetGuidance: {
    minimumTestBudget: string;
    recommendedBudget: string;
    splitRecommendation: string;
  };
}

export interface AdImage {
  id: string;
  url: string;
  prompt: string;
  format: string;
  style: string;
  generatedAt: string;
}

export interface Project {
  id: string;
  businessName: string;
  website: string;
  industry: string;
  product: string;
  targetAudience: string;
  valueProposition: string;
  competitors: string[];
  goals: string[];
  budget: string;
  research: ResearchData | null;
  ads: CopyVariant[];
  selectedAds: CopyVariant[];
  images: AdImage[];
  metaConnection: {
    accessToken: string;
    adAccountId: string;
    adAccountName?: string;
  } | null;
  status: 'setup' | 'research' | 'create' | 'review' | 'publish';
}
