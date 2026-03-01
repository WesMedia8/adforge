// ============================================
// AdForge — Smart Generator Component
// Analyze a URL, auto-generate themed ad variations
// ============================================

'use client';

import React, { useState } from 'react';
import { GeneratedImage, AdTheme, GeneratedAdVariation } from '@/lib/types';

interface SmartGeneratorProps {
  generatedImages: GeneratedImage[];
  onSaveImage: (image: GeneratedImage) => void;
  onReplaceVariations: (data: Array<{ headline: string; subtext: string }>) => void;
  onAppendVariations: (data: Array<{ headline: string; subtext: string }>) => void;
  onSwitchToEditor: () => void;
  onApplyBranding: (branding: {
    logoUrl?: string;
    accentColor?: string;
    bgColor?: string;
  }) => void;
}

interface SiteAnalysisResult {
  businessName: string;
  industry: string;
  mainProduct: string;
  targetAudience: string;
  valueProposition: string;
  keyBenefits: string[];
  tone: string;
  callToAction: string;
}

const THEME_LABELS: Record<AdTheme, { label: string; color: string }> = {
  'pain-point': { label: 'Pain Point', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  outcome: { label: 'Outcome', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  'social-proof': { label: 'Social Proof', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  urgency: { label: 'Urgency', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  question: { label: 'Question', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  contrast: { label: 'Contrast', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
};

export default function SmartGenerator({
  generatedImages,
  onSaveImage,
  onReplaceVariations,
  onAppendVariations,
  onSwitchToEditor,
  onApplyBranding,
}: SmartGeneratorProps) {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<SiteAnalysisResult | null>(null);
  const [variations, setVariations] = useState<GeneratedAdVariation[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [step, setStep] = useState<'input' | 'analysis' | 'variations'>('input');

  // Step 1: Analyze the site
  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setAnalyzing(true);
    setError('');

    try {
      const res = await fetch('/api/analyze-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setAnalysis(data);
      setStep('analysis');
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze site. Check the URL and try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Step 2: Generate ad variations from analysis
  const handleGenerate = async () => {
    if (!analysis) return;
    setGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/analyze-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          generateVariations: true,
          analysis,
        }),
      });

      // If the API doesn't support generateVariations, generate client-side via a separate call
      const data = await res.json();

      if (data.variations) {
        setVariations(data.variations);
        setStep('variations');
      } else {
        // Fallback: generate variations using the analysis data we already have
        const variationsRes = await fetch('/api/generate-research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessName: analysis.businessName,
            industry: analysis.industry,
            product: analysis.mainProduct,
            targetAudience: analysis.targetAudience,
            valueProposition: analysis.valueProposition,
            competitors: '',
            goals: 'Generate high-converting Facebook ad copy variations',
          }),
        });

        const researchData = await variationsRes.json();

        // Build variations from the analysis data
        const generated = buildVariationsFromAnalysis(analysis);
        setVariations(generated);
        setStep('variations');
      }
    } catch (err) {
      console.error('Generation failed:', err);
      // Fallback: build variations locally from analysis
      const generated = buildVariationsFromAnalysis(analysis);
      setVariations(generated);
      setStep('variations');
    } finally {
      setGenerating(false);
    }
  };

  // Build ad variations from site analysis
  const buildVariationsFromAnalysis = (data: SiteAnalysisResult): GeneratedAdVariation[] => {
    const themes: Array<{ theme: AdTheme; headline: string; subtext: string }> = [
      {
        theme: 'pain-point',
        headline: `Tired of ${data.industry.toLowerCase()} that doesn't deliver?`,
        subtext: `${data.businessName} was built for people who are done settling. ${data.valueProposition}`,
      },
      {
        theme: 'outcome',
        headline: data.keyBenefits[0] ? `Get ${data.keyBenefits[0]}` : `Transform your ${data.industry.toLowerCase()} experience`,
        subtext: `${data.mainProduct} helps ${data.targetAudience.toLowerCase()} achieve real results. ${data.callToAction}`,
      },
      {
        theme: 'social-proof',
        headline: `Thousands trust ${data.businessName}`,
        subtext: `Join the growing number of ${data.targetAudience.toLowerCase()} who chose ${data.mainProduct}. See why they switched.`,
      },
      {
        theme: 'urgency',
        headline: `Don't miss out on ${data.mainProduct}`,
        subtext: `${data.targetAudience} are already seeing results. ${data.callToAction} before this offer ends.`,
      },
      {
        theme: 'question',
        headline: `What if your ${data.industry.toLowerCase()} worked for you?`,
        subtext: `${data.businessName} gives you ${data.keyBenefits.slice(0, 2).join(' and ').toLowerCase() || 'everything you need'}. ${data.callToAction}`,
      },
      {
        theme: 'contrast',
        headline: `Before vs. After ${data.businessName}`,
        subtext: `Stop wasting time on solutions that don't work. ${data.mainProduct} delivers ${data.keyBenefits[1] || data.valueProposition}.`,
      },
    ];

    return themes.map((t, i) => ({
      id: `sg-${Date.now()}-${i}`,
      headline: t.headline,
      subtext: t.subtext,
      theme: t.theme,
    }));
  };

  // Toggle theme selection
  const toggleTheme = (id: string) => {
    setSelectedThemes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedThemes.size === variations.length) {
      setSelectedThemes(new Set());
    } else {
      setSelectedThemes(new Set(variations.map((v) => v.id)));
    }
  };

  // Send selected (or all) variations to editor
  const handleSendToEditor = (mode: 'replace' | 'append') => {
    const items = selectedThemes.size > 0
      ? variations.filter((v) => selectedThemes.has(v.id))
      : variations;

    const mapped = items.map((v) => ({ headline: v.headline, subtext: v.subtext }));

    if (mode === 'replace') {
      onReplaceVariations(mapped);
    } else {
      onAppendVariations(mapped);
    }

    onSwitchToEditor();
  };

  // Generate an AI image for a variation
  const handleGenerateImage = async (variation: GeneratedAdVariation) => {
    if (!analysis) return;

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Create a Facebook ad creative for ${analysis.businessName}. Product: ${analysis.mainProduct}. Style: ${analysis.tone}. Theme: ${variation.theme}. Headline: ${variation.headline}`,
          type: 'standalone',
          width: 1080,
          height: 1080,
        }),
      });
      const data = await res.json();
      if (data.success && data.image_url) {
        onSaveImage({
          prompt: variation.headline,
          image_url: data.image_url,
          image_type: 'standalone',
        });
      }
    } catch (err) {
      console.error('Image generation failed:', err);
    }
  };

  // Reset to start
  const handleReset = () => {
    setUrl('');
    setAnalysis(null);
    setVariations([]);
    setSelectedThemes(new Set());
    setError('');
    setStep('input');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-af-bg-primary">
      {/* Header */}
      <div className="bg-af-bg-secondary border-b border-af-border-subtle px-6 py-5">
        <div className="flex items-center gap-2 mb-1">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-af-accent">
            <path d="M8 1.5a1 1 0 0 1 .894.553L10.382 5h3.368a1 1 0 0 1 .707 1.707l-2.5 2.5.937 3.75a1 1 0 0 1-1.451 1.054L8 12.236l-3.443 1.775a1 1 0 0 1-1.45-1.054l.936-3.75-2.5-2.5A1 1 0 0 1 2.25 5h3.368l1.488-2.947A1 1 0 0 1 8 1.5z" />
          </svg>
          <h2 className="text-[15px] font-semibold text-af-text-primary">Smart Generator</h2>
        </div>
        <p className="text-[11px] text-af-text-tertiary">
          Paste any website URL to auto-generate themed ad variations
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[800px] mx-auto">

          {/* Step 1: URL Input */}
          {step === 'input' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5">
                  Website URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAnalyze(); }}
                    placeholder="https://example.com"
                    className="flex-1 bg-af-bg-tertiary border border-af-border-default rounded-md text-af-text-primary text-[13px] px-3 py-2.5 outline-none focus:border-af-accent"
                  />
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing || !url.trim()}
                    className="px-5 py-2.5 rounded-md text-[12px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all disabled:opacity-40 whitespace-nowrap"
                  >
                    {analyzing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Analyzing...
                      </span>
                    ) : (
                      'Analyze Site'
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">
                  <p className="text-[12px] text-red-400">{error}</p>
                </div>
              )}

              {/* Quick tips */}
              <div className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-5 mt-6">
                <h3 className="text-[12px] font-semibold text-af-text-primary mb-3">How it works</h3>
                <div className="space-y-2.5">
                  {[
                    ['1', 'Paste a website URL — we\'ll extract the business info, product, and audience'],
                    ['2', 'Review the analysis and fine-tune if needed'],
                    ['3', 'Generate 6 themed ad variations (pain-point, outcome, social-proof, urgency, question, contrast)'],
                    ['4', 'Send your favorites to the editor to customize styling and export'],
                  ].map(([num, text]) => (
                    <div key={num} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-af-accent/20 text-af-accent text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {num}
                      </span>
                      <p className="text-[11px] text-af-text-secondary leading-[1.5]">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Analysis Review */}
          {step === 'analysis' && analysis && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-af-text-primary">Site Analysis</h3>
                <button
                  onClick={handleReset}
                  className="text-[11px] text-af-text-tertiary hover:text-af-text-primary transition-colors"
                >
                  Start Over
                </button>
              </div>

              <div className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-5 space-y-4">
                {[
                  ['Business', analysis.businessName],
                  ['Industry', analysis.industry],
                  ['Product', analysis.mainProduct],
                  ['Audience', analysis.targetAudience],
                  ['Value Prop', analysis.valueProposition],
                  ['Tone', analysis.tone],
                  ['CTA', analysis.callToAction],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-4">
                    <span className="text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] w-[80px] shrink-0 pt-0.5">
                      {label}
                    </span>
                    <span className="text-[12px] text-af-text-primary">{value}</span>
                  </div>
                ))}

                {analysis.keyBenefits && analysis.keyBenefits.length > 0 && (
                  <div className="flex gap-4">
                    <span className="text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] w-[80px] shrink-0 pt-0.5">
                      Benefits
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.keyBenefits.map((b, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-af-accent/10 text-af-accent border border-af-accent/20 rounded px-2 py-0.5"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">
                  <p className="text-[12px] text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full px-5 py-3 rounded-md text-[13px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all disabled:opacity-40"
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating Variations...
                  </span>
                ) : (
                  'Generate Ad Variations'
                )}
              </button>
            </div>
          )}

          {/* Step 3: Variations */}
          {step === 'variations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[13px] font-semibold text-af-text-primary">
                    Generated Variations
                    <span className="text-af-text-tertiary font-normal ml-2">({variations.length})</span>
                  </h3>
                  {selectedThemes.size > 0 && (
                    <p className="text-[10px] text-af-text-tertiary mt-0.5">
                      {selectedThemes.size} selected
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={selectAll}
                    className="text-[11px] text-af-text-tertiary hover:text-af-text-primary transition-colors px-2 py-1"
                  >
                    {selectedThemes.size === variations.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="text-[11px] text-af-text-tertiary hover:text-af-text-primary transition-colors px-2 py-1"
                  >
                    Start Over
                  </button>
                </div>
              </div>

              {/* Variation Cards */}
              <div className="space-y-3">
                {variations.map((v) => {
                  const themeInfo = THEME_LABELS[v.theme];
                  const isSelected = selectedThemes.has(v.id);
                  return (
                    <div
                      key={v.id}
                      onClick={() => toggleTheme(v.id)}
                      className={`bg-af-bg-secondary border rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-af-accent bg-af-accent/5'
                          : 'border-af-border-subtle hover:border-af-border-default'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${themeInfo.color}`}>
                              {themeInfo.label}
                            </span>
                          </div>
                          <h4 className="text-[13px] font-semibold text-af-text-primary mb-1 leading-snug">
                            {v.headline}
                          </h4>
                          <p className="text-[11px] text-af-text-secondary leading-[1.5]">
                            {v.subtext}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 shrink-0 mt-1 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-af-accent bg-af-accent'
                            : 'border-af-border-default'
                        }`}>
                          {isSelected && (
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="white">
                              <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleSendToEditor('replace')}
                  className="flex-1 px-4 py-2.5 rounded-md text-[12px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all"
                >
                  Replace Variations & Edit
                </button>
                <button
                  onClick={() => handleSendToEditor('append')}
                  className="flex-1 px-4 py-2.5 rounded-md text-[12px] font-medium bg-af-bg-tertiary border border-af-border-default text-af-text-primary hover:border-af-accent hover:text-af-accent transition-all"
                >
                  Append to Existing
                </button>
              </div>

              {/* Apply Branding hint */}
              {analysis && (
                <button
                  onClick={() =>
                    onApplyBranding({
                      accentColor: undefined,
                      bgColor: undefined,
                      logoUrl: undefined,
                    })
                  }
                  className="w-full px-4 py-2 rounded-md text-[11px] font-medium bg-af-bg-secondary border border-af-border-subtle text-af-text-tertiary hover:text-af-text-primary hover:border-af-border-default transition-all"
                >
                  Apply Detected Branding to Template
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
