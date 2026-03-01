// ============================================
// AdForge — Default Values
// ============================================

import { Variation, TemplateSettings } from './types';

export const FONT_OPTIONS = [
  { value: 'Inter, system-ui, sans-serif', label: 'Inter' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: "'Playfair Display', serif", label: 'Playfair Display' },
  { value: "'Montserrat', sans-serif", label: 'Montserrat' },
  { value: "'Poppins', sans-serif", label: 'Poppins' },
  { value: "'Oswald', sans-serif", label: 'Oswald' },
  { value: "'Roboto Condensed', sans-serif", label: 'Roboto Condensed' },
  { value: "'Space Grotesk', sans-serif", label: 'Space Grotesk' },
  { value: 'monospace', label: 'Monospace' },
];

export const SOLID_PRESETS: Record<string, { bg: string; accent: string; text?: string }> = {
  midnight: { bg: '#1a1a2e', accent: '#0066ff', text: '#ffffff' },
  charcoal: { bg: '#2d2d2d', accent: '#ff6b35', text: '#ffffff' },
  navy: { bg: '#0a1628', accent: '#3b82f6', text: '#ffffff' },
  forest: { bg: '#1a2e1a', accent: '#22c55e', text: '#ffffff' },
  wine: { bg: '#2e1a1a', accent: '#ef4444', text: '#ffffff' },
  cream: { bg: '#faf5e4', accent: '#b8860b', text: '#1a1a1a' },
  white: { bg: '#ffffff', accent: '#0066ff', text: '#1a1a1a' },
  black: { bg: '#000000', accent: '#ffffff', text: '#ffffff' },
};

export const GRADIENT_PRESETS: Record<string, { c1: string; c2: string; dir: string; accent: string; text?: string }> = {
  ocean: { c1: '#0f2027', c2: '#2c5364', dir: 'to bottom right', accent: '#00bcd4' },
  sunset: { c1: '#2e1a47', c2: '#c84b31', dir: 'to bottom right', accent: '#ff9800' },
  aurora: { c1: '#0d1b2a', c2: '#1b4332', dir: 'to bottom right', accent: '#52b788' },
  royal: { c1: '#1a0533', c2: '#3d0066', dir: 'to bottom', accent: '#bb86fc' },
  fire: { c1: '#1a0000', c2: '#4a1010', dir: 'to bottom right', accent: '#ff5252' },
  ice: { c1: '#0a1628', c2: '#1a3a5c', dir: 'to bottom', accent: '#81d4fa' },
};

export const DEFAULT_VARIATIONS: Variation[] = [
  {
    headline: 'Your Headline Here',
    subtext: 'Add compelling subtext that drives action.',
    sort_order: 0,
  },
  {
    headline: 'Discover the Difference',
    subtext: 'See why thousands of customers trust us for results.',
    sort_order: 1,
  },
  {
    headline: 'Limited Time Offer',
    subtext: 'Don\'t miss out — start today and save.',
    sort_order: 2,
  },
];

export const DEFAULT_TEMPLATE_SETTINGS: TemplateSettings = {
  bgStyle: 'solid',
  bgColor: '#1a1a2e',
  bgImageUrl: '',
  gradColor1: '#1a1a2e',
  gradColor2: '#16213e',
  gradDirection: 'to bottom right',
  accentColor: '#0066ff',
  textColor: '#ffffff',
  fontFamily: 'Inter, system-ui, sans-serif',
  headlineSize: 56,
  subtextSize: 24,
  padding: 60,
  logoUrl: '',
  logoPosition: 'bottom-left',
  ctaText: 'Shop Now',
  ctaVisible: true,
  textPositionX: 0,
  textPositionY: 0,
  verticalAlign: 'center',
};
