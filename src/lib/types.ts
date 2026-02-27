// ============================================
// AdForge — TypeScript Types
// ============================================

export type LayoutType = 'classic' | 'centered' | 'bold' | 'features' | 'benefits' | 'testimonial' | 'listicle' | 'before-after' | 'stats';
export type BgStyle = 'solid' | 'gradient' | 'pattern';
export type LogoPosition = 'bottom-left' | 'bottom-center' | 'bottom-right';
export type ImageType = 'background' | 'standalone';

// Smart Generator theme tags for generated ad variations
export type AdTheme =
  | 'pain-point'
  | 'outcome'
  | 'social-proof'
  | 'urgency'
  | 'question'
  | 'contrast';

export interface Variation {
  id?: string;
  headline: string;
  subtext: string;
  sort_order?: number;
  // Extended fields for new layout types
  bulletPoints?: string[];    // For features/benefits/listicle layouts
  testimonialAuthor?: string; // For testimonial layout
  testimonialRole?: string;   // For testimonial layout
  beforeText?: string;        // For before/after layout
  afterText?: string;         // For before/after layout
  statNumber?: string;        // For stats layout (e.g. "97%")
  statLabel?: string;         // For stats layout (e.g. "Customer Satisfaction")
}

export interface TemplateSettings {
  bgStyle: BgStyle;
  bgColor: string;
  bgImageUrl: string;
  gradColor1: string;
  gradColor2: string;
  gradDirection: string;
  accentColor: string;
  textColor: string;
  fontFamily: string;
  headlineSize: number;
  subtextSize: number;
  padding: number;
  logoUrl: string;
  logoPosition: LogoPosition;
  ctaText: string;
  ctaVisible: boolean;
  textPositionX: number;  // -400 to 400 (pixel offset from default)
  textPositionY: number;  // -400 to 400
  verticalAlign: 'top' | 'center' | 'bottom'; // Quick preset
}

export interface Project {
  id?: string;
  name: string;
  template_settings: TemplateSettings;
  layout: LayoutType;
  created_at?: string;
  updated_at?: string;
}

export interface GeneratedImage {
  id?: string;
  project_id?: string;
  prompt: string;
  image_url: string;
  image_type: ImageType;
  created_at?: string;
}

// Smart Generator — Site analysis results from /api/analyze-site
export interface SiteAnalysis {
  url: string;
  domain: string;
  title: string;
  description: string;
  headings: string[];
  keyPhrases: string[];
  brandColors: string[];
  productDescription: string;
  logoUrl?: string;
}

// Smart Generator — A single generated ad variation with theme metadata
export interface GeneratedAdVariation {
  id: string;
  headline: string;
  subtext: string;
  theme: AdTheme;
}

// Smart Generator — Full response from /api/analyze-site
export interface SmartGeneratorResponse {
  success: boolean;
  analysis: SiteAnalysis;
  variations: GeneratedAdVariation[];
  error?: string;
}

// Consumer Research Module — Full Research Document matching user's template
export interface ResearchDocument {
  id?: string;
  project_id?: string;
  name: string;
  source: 'imported' | 'ai-generated' | 'merged' | 'manual';
  created_at?: string;
  updated_at?: string;

  // Overview
  overview: {
    brandLinks: {
      website: string;
      youtube: string;
      instagram: string;
      tiktok: string;
      facebookAdsLibrary: string;
    };
    adCopy: {
      headlines: string[];
      hooks: string[];
      ctas: string[];
    };
    phraseBank: {
      positives: string[]; // Words for main claim/result
      negatives: string[]; // Relatable issues/problems
    };
    visualIdeas: string[];
  };

  // Product
  product: {
    companyDescription: string;
    productDescription: string; // Physical
    productFunction: string; // Functional
    customerUseCases: string[];
    features: string[];
    benefits: string[];
    desires: string[]; // Wants/Needs
    reviews: string[];
  };

  // Core Research
  coreResearch: {
    problemsSolutions: Array<{
      problem: string;
      solutions: string[];
      isCore: boolean;
    }>;
    goodCompetitorReviews: string[];
    badCompetitorReviews: string[];
    buzzWords: string[]; // Niche words & phrases
    otherSolutions: string[];
  };

  // Avatars (1-3)
  avatars: Array<{
    name: string;
    age: string;
    gender: string;
    maritalStatus: string;
    children: string;
    quote: string;
    occupation: string;
    income: string;
    challenges: string[];
    painPoints: string[];
    goals: string[];
    values: string[];
    objections: string[];
    questionsBeforePurchase: string[];
    failedProducts: string[];
    successfulProducts: string[];
  }>;

  // FAQs
  faqs: Array<{
    question: string;
    answer: string;
  }>;

  // Competitor Research
  competitors: Array<{
    name: string;
    websiteUrl: string;
    adLibraryUrl: string;
    priceRange: string;
    activeOffers: string;
    notes: string;
  }>;

  competitiveAdvantages: string[];

  // Media Buyer
  mediaBuyer: {
    topCreatives30Days: string[];
    topCreatives6Months: string[];
    highestHookRates: string[];
    bestHoldCTR: string[];
    topAgencyCreatives: string[];
  };
}

// Consumer Research Module — Simplified profile for backward compat and SmartGenerator integration
export interface ConsumerResearchProfile {
  id?: string;
  project_id?: string;
  name: string;
  source: 'imported' | 'ai-generated' | 'merged';
  painPoints: string[];
  desiredOutcomes: string[];
  customerLanguage: string[];
  demographics: string[];
  buyingTriggers: string[];
  objections: string[];
  icpSummary: string;
  rawText?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AppState {
  variations: Variation[];
  activeIndex: number;
  layout: LayoutType;
  templateSettings: TemplateSettings;
  currentProject: Project | null;
  projects: Project[];
  generatedImages: GeneratedImage[];
}
