export interface CopyVariant {
  id: string;
  headline: string;
  body: string;
  cta: string;
  description?: string;
  angle: string;
  framework: string;
  score?: number;
}

export function generateVariantId(): string {
  return `variant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function scoreVariant(variant: CopyVariant): number {
  let score = 50; // base score
  
  // Headline length (ideal: 30-60 chars)
  const headlineLen = variant.headline.length;
  if (headlineLen >= 30 && headlineLen <= 60) score += 10;
  else if (headlineLen < 15 || headlineLen > 90) score -= 10;
  
  // Body length (ideal: 80-150 chars)
  const bodyLen = variant.body.length;
  if (bodyLen >= 80 && bodyLen <= 150) score += 10;
  else if (bodyLen < 40 || bodyLen > 250) score -= 10;
  
  // Has numbers/stats
  if (/\d+/.test(variant.headline) || /\d+/.test(variant.body)) score += 5;
  
  // Has power words
  const powerWords = ['free', 'guaranteed', 'proven', 'exclusive', 'limited', 'instant', 'results'];
  const combined = (variant.headline + ' ' + variant.body).toLowerCase();
  const powerWordCount = powerWords.filter(word => combined.includes(word)).length;
  score += powerWordCount * 3;
  
  // Has question
  if (variant.headline.includes('?') || variant.body.includes('?')) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

export function rankVariants(variants: CopyVariant[]): CopyVariant[] {
  return variants
    .map(v => ({ ...v, score: scoreVariant(v) }))
    .sort((a, b) => (b.score || 0) - (a.score || 0));
}
