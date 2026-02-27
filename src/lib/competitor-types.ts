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
