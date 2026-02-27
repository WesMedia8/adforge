import { CopyVariant } from './copy-variants';

export function calculateDiversityScore(variants: CopyVariant[]): number {
  if (variants.length < 2) return 0;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (let i = 0; i < variants.length; i++) {
    for (let j = i + 1; j < variants.length; j++) {
      totalSimilarity += calculateSimilarity(
        variants[i].body,
        variants[j].body
      );
      comparisons++;
    }
  }
  
  const avgSimilarity = comparisons > 0 ? totalSimilarity / comparisons : 0;
  return Math.round((1 - avgSimilarity) * 100);
}

function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

export function ensureDiversity(
  variants: CopyVariant[],
  minDiversityScore: number = 40
): CopyVariant[] {
  if (variants.length <= 1) return variants;
  
  const selected: CopyVariant[] = [variants[0]];
  
  for (const variant of variants.slice(1)) {
    const tempGroup = [...selected, variant];
    const diversity = calculateDiversityScore(tempGroup);
    
    if (diversity >= minDiversityScore || selected.length < 3) {
      selected.push(variant);
    }
  }
  
  return selected;
}
