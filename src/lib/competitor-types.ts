export interface CompetitorAd {
  id: string;
  competitorName: string;
  headline: string;
  body: string;
  imageUrl?: string;
  format: string;
  platform: string;
  estimatedReach: string;
  firstSeen: string;
  lastSeen: string;
  isActive: boolean;
  pageName?: string;
  creativeBody?: string;
}

export interface CompetitorProfile {
  name: string;
  website: string;
  adLibraryId?: string;
  estimatedMonthlySpend: string;
  primaryFormats: string[];
  topMessages: string[];
  targetingApproach: string;
  adHistory: CompetitorAd[];
}

export interface CompetitorAnalysis {
  competitors: CompetitorProfile[];
  marketInsights: {
    commonThemes: string[];
    gaps: string[];
    opportunities: string[];
    seasonalTrends: string[];
  };
  recommendations: string[];
  lastUpdated: string;
}

export interface RemixRequest {
  originalAd: CompetitorAd | {
    headline: string;
    body: string;
    cta?: string;
    description?: string;
  };
  brandName?: string;
  productDescription?: string;
  tone: 'professional' | 'casual' | 'edgy' | 'luxury' | 'playful' | 'urgent' | 'bold';
  framework: 'auto' | 'PAS' | 'AIDA' | 'FAB' | 'BAB' | 'EPIC' | '4Ps' | 'FOUR_Ps' | '4Cs';
  customInstructions?: string;
}

export interface RemixedAd {
  id: string;
  headline: string;
  body: string;
  cta: string;
  description?: string;
  framework: string;
  angle: string;
  tone: string;
  hookType: string;
  changesSummary: string;
}
