// ============================================
// AdForge — Consumer Research Component
// Build audience profiles and buyer personas
// ============================================

'use client';

import React, { useState } from 'react';

interface ConsumerResearchProps {
  onResearchReady: ((research: unknown) => void) | undefined;
  projectId?: string;
}

interface ResearchForm {
  businessName: string;
  industry: string;
  product: string;
  targetAudience: string;
  valueProposition: string;
  competitors: string;
  goals: string;
}

interface ResearchResult {
  audienceInsights?: {
    primaryPersonas?: Array<{
      name: string;
      age: string;
      interests: string[];
      painPoints: string[];
      motivations: string[];
      platforms: string[];
    }>;
    targetingRecommendations?: {
      interests: string[];
      behaviors: string[];
      demographics: {
        ageRange: string;
        gender: string;
        locations: string[];
      };
    };
  };
  messagingStrategy?: {
    primaryHook: string;
    emotionalTriggers: string[];
    objectionHandlers: string[];
    socialProofAngles: string[];
  };
  adFormatStrategy?: {
    recommendedFormats: Array<{
      format: string;
      rationale: string;
      bestFor: string;
    }>;
    placementStrategy: string[];
  };
  competitorAnalysis?: {
    gaps: string[];
    differentiators: string[];
  };
  budgetGuidance?: {
    minimumTestBudget: string;
    recommendedBudget: string;
    splitRecommendation: string;
  };
}

const INITIAL_FORM: ResearchForm = {
  businessName: '',
  industry: '',
  product: '',
  targetAudience: '',
  valueProposition: '',
  competitors: '',
  goals: '',
};

export default function ConsumerResearch({
  onResearchReady,
  projectId,
}: ConsumerResearchProps) {
  const [form, setForm] = useState<ResearchForm>(INITIAL_FORM);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState('');
  const [rawPaste, setRawPaste] = useState('');
  const [parsing, setParsing] = useState(false);
  const [mode, setMode] = useState<'generate' | 'import'>('generate');

  const updateField = (field: keyof ResearchForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Generate research from form inputs
  const handleGenerate = async () => {
    if (!form.businessName.trim() || !form.product.trim()) return;
    setGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/generate-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          competitors: form.competitors.split(',').map((c) => c.trim()).filter(Boolean),
          goals: form.goals.split(',').map((g) => g.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
        onResearchReady?.(data);
      }
    } catch (err) {
      console.error('Research generation failed:', err);
      setError('Failed to generate research. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // Parse pasted research text
  const handleParseResearch = async () => {
    if (!rawPaste.trim()) return;
    setParsing(true);
    setError('');

    try {
      const res = await fetch('/api/parse-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawResearch: rawPaste }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
        onResearchReady?.(data);
      }
    } catch (err) {
      console.error('Research parsing failed:', err);
      setError('Failed to parse research. Please try again.');
    } finally {
      setParsing(false);
    }
  };

  const labelClass =
    'block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5';
  const inputClass =
    'w-full bg-af-bg-tertiary border border-af-border-default rounded-md text-af-text-primary text-[13px] px-3 py-2.5 outline-none focus:border-af-accent';

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-af-bg-primary">
      {/* Header */}
      <div className="bg-af-bg-secondary border-b border-af-border-subtle px-6 py-5">
        <div className="flex items-center gap-2 mb-1">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-af-accent">
            <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM2 14s-1 0-1-1 1-4 7-4 7 3 7 4-1 1-1 1H2z" />
          </svg>
          <h2 className="text-[15px] font-semibold text-af-text-primary">Consumer Research</h2>
        </div>
        <p className="text-[11px] text-af-text-tertiary">
          Build audience profiles and ad strategy from AI research or your own data
        </p>

        {/* Mode toggle */}
        <div className="flex gap-1 mt-3 bg-af-bg-tertiary rounded-md p-0.5 w-fit">
          {(['generate', 'import'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded text-[11px] font-medium transition-all ${
                mode === m
                  ? 'bg-af-accent text-white'
                  : 'text-af-text-tertiary hover:text-af-text-primary'
              }`}
            >
              {m === 'generate' ? 'AI Generate' : 'Import / Paste'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[800px] mx-auto">
          {!result ? (
            <>
              {mode === 'generate' ? (
                /* Generation Form */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Business Name *</label>
                      <input
                        type="text"
                        value={form.businessName}
                        onChange={(e) => updateField('businessName', e.target.value)}
                        placeholder="e.g. Nike"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Industry</label>
                      <input
                        type="text"
                        value={form.industry}
                        onChange={(e) => updateField('industry', e.target.value)}
                        placeholder="e.g. Athletic Footwear"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Product / Service *</label>
                    <input
                      type="text"
                      value={form.product}
                      onChange={(e) => updateField('product', e.target.value)}
                      placeholder="e.g. Running shoes with responsive cushioning"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Target Audience</label>
                    <input
                      type="text"
                      value={form.targetAudience}
                      onChange={(e) => updateField('targetAudience', e.target.value)}
                      placeholder="e.g. Active adults 25-45 who run 3+ times per week"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Value Proposition</label>
                    <input
                      type="text"
                      value={form.valueProposition}
                      onChange={(e) => updateField('valueProposition', e.target.value)}
                      placeholder="e.g. Superior comfort with energy-return technology"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Competitors (comma-separated)</label>
                    <input
                      type="text"
                      value={form.competitors}
                      onChange={(e) => updateField('competitors', e.target.value)}
                      placeholder="e.g. Adidas, New Balance, Hoka"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Campaign Goals (comma-separated)</label>
                    <input
                      type="text"
                      value={form.goals}
                      onChange={(e) => updateField('goals', e.target.value)}
                      placeholder="e.g. Increase sales, Build awareness, Drive website traffic"
                      className={inputClass}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">
                      <p className="text-[12px] text-red-400">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={generating || !form.businessName.trim() || !form.product.trim()}
                    className="w-full px-5 py-3 rounded-md text-[13px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all disabled:opacity-40"
                  >
                    {generating ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Generating Research...
                      </span>
                    ) : (
                      'Generate Research'
                    )}
                  </button>
                </div>
              ) : (
                /* Import / Paste Mode */
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Paste Your Research</label>
                    <textarea
                      value={rawPaste}
                      onChange={(e) => setRawPaste(e.target.value)}
                      placeholder="Paste your market research, customer surveys, competitor analysis, or any audience data here..."
                      rows={12}
                      className={`${inputClass} resize-y`}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">
                      <p className="text-[12px] text-red-400">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleParseResearch}
                    disabled={parsing || !rawPaste.trim()}
                    className="w-full px-5 py-3 rounded-md text-[13px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all disabled:opacity-40"
                  >
                    {parsing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Parsing Research...
                      </span>
                    ) : (
                      'Parse & Structure Research'
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Results Display */
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-af-text-primary">Research Results</h3>
                <button
                  onClick={() => {
                    setResult(null);
                    setError('');
                  }}
                  className="text-[11px] text-af-text-tertiary hover:text-af-text-primary transition-colors"
                >
                  New Research
                </button>
              </div>

              {/* Personas */}
              {result.audienceInsights?.primaryPersonas && result.audienceInsights.primaryPersonas.length > 0 && (
                <div className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-5">
                  <h4 className="text-[11px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-3">
                    Audience Personas
                  </h4>
                  <div className="space-y-4">
                    {result.audienceInsights.primaryPersonas.map((persona, i) => (
                      <div key={i} className="bg-af-bg-tertiary rounded-md p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[13px] font-semibold text-af-text-primary">{persona.name}</span>
                          <span className="text-[10px] text-af-text-tertiary">{persona.age}</span>
                        </div>
                        {persona.painPoints.length > 0 && (
                          <div className="mb-2">
                            <span className="text-[9px] font-semibold text-red-400 uppercase">Pain Points</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {persona.painPoints.map((p, j) => (
                                <span key={j} className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 rounded px-2 py-0.5">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {persona.motivations.length > 0 && (
                          <div>
                            <span className="text-[9px] font-semibold text-green-400 uppercase">Motivations</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {persona.motivations.map((m, j) => (
                                <span key={j} className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 rounded px-2 py-0.5">
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Targeting */}
              {result.audienceInsights?.targetingRecommendations && (
                <div className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-5">
                  <h4 className="text-[11px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-3">
                    Targeting Recommendations
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold text-af-text-tertiary">Demographics</span>
                      <p className="text-[12px] text-af-text-primary mt-0.5">
                        Age: {result.audienceInsights.targetingRecommendations.demographics.ageRange} | Gender: {result.audienceInsights.targetingRecommendations.demographics.gender}
                      </p>
                    </div>
                    {result.audienceInsights.targetingRecommendations.interests.length > 0 && (
                      <div>
                        <span className="text-[10px] font-semibold text-af-text-tertiary">Interests</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {result.audienceInsights.targetingRecommendations.interests.map((int, i) => (
                            <span key={i} className="text-[10px] bg-af-accent/10 text-af-accent border border-af-accent/20 rounded px-2 py-0.5">
                              {int}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Messaging Strategy */}
              {result.messagingStrategy && (
                <div className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-5">
                  <h4 className="text-[11px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-3">
                    Messaging Strategy
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold text-af-text-tertiary">Primary Hook</span>
                      <p className="text-[12px] text-af-text-primary mt-0.5">{result.messagingStrategy.primaryHook}</p>
                    </div>
                    {result.messagingStrategy.emotionalTriggers.length > 0 && (
                      <div>
                        <span className="text-[10px] font-semibold text-af-text-tertiary">Emotional Triggers</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {result.messagingStrategy.emotionalTriggers.map((t, i) => (
                            <span key={i} className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded px-2 py-0.5">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Ad Format Strategy */}
              {result.adFormatStrategy?.recommendedFormats && result.adFormatStrategy.recommendedFormats.length > 0 && (
                <div className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-5">
                  <h4 className="text-[11px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-3">
                    Recommended Ad Formats
                  </h4>
                  <div className="space-y-2">
                    {result.adFormatStrategy.recommendedFormats.map((f, i) => (
                      <div key={i} className="bg-af-bg-tertiary rounded-md p-3">
                        <span className="text-[12px] font-semibold text-af-text-primary">{f.format}</span>
                        <p className="text-[11px] text-af-text-secondary mt-0.5">{f.rationale}</p>
                        <p className="text-[10px] text-af-text-tertiary mt-0.5">Best for: {f.bestFor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget Guidance */}
              {result.budgetGuidance && (
                <div className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-5">
                  <h4 className="text-[11px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-3">
                    Budget Guidance
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-af-bg-tertiary rounded-md p-3">
                      <span className="text-[10px] text-af-text-tertiary">Min Test Budget</span>
                      <p className="text-[14px] font-semibold text-af-text-primary">{result.budgetGuidance.minimumTestBudget}</p>
                    </div>
                    <div className="bg-af-bg-tertiary rounded-md p-3">
                      <span className="text-[10px] text-af-text-tertiary">Recommended</span>
                      <p className="text-[14px] font-semibold text-af-accent">{result.budgetGuidance.recommendedBudget}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-af-text-secondary mt-2">{result.budgetGuidance.splitRecommendation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
