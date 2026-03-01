// ============================================
// AdForge — Competitor Spy Component
// Search and analyze competitor ads
// ============================================

'use client';

import React, { useState } from 'react';

interface CompetitorSpyProps {
  onAppendVariations: (data: Array<{ headline: string; subtext: string }>) => void;
  onSwitchToEditor: () => void;
}

interface CompetitorResult {
  name: string;
  estimatedAdSpend: string;
  primaryMessages: string[];
  adFormats: string[];
  targetingApproach: string;
  strengths: string[];
  weaknesses: string[];
}

interface AnalysisResult {
  competitors: CompetitorResult[];
  marketInsights: {
    commonThemes: string[];
    gaps: string[];
    opportunities: string[];
  };
  recommendations: string[];
}

export default function CompetitorSpy({
  onAppendVariations,
  onSwitchToEditor,
}: CompetitorSpyProps) {
  const [competitors, setCompetitors] = useState('');
  const [industry, setIndustry] = useState('');
  const [product, setProduct] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [remixing, setRemixing] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!competitors.trim()) return;
    setAnalyzing(true);
    setError('');

    try {
      const res = await fetch('/api/competitor-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitors: competitors.split(',').map((c) => c.trim()).filter(Boolean),
          industry: industry.trim(),
          product: product.trim(),
        }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error('Competitor analysis failed:', err);
      setError('Failed to analyze competitors. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Remix a competitor's messaging into ad variations
  const handleRemix = async (competitor: CompetitorResult) => {
    setRemixing(competitor.name);

    try {
      const res = await fetch('/api/remix-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ad: {
            headline: competitor.primaryMessages[0] || competitor.name,
            body: competitor.primaryMessages.slice(1).join('. ') || competitor.targetingApproach,
            cta: 'Learn More',
          },
          remixType: 'audience',
        }),
      });
      const data = await res.json();

      if (data.headline) {
        onAppendVariations([
          {
            headline: data.headline,
            subtext: data.body || data.description || '',
          },
        ]);
        onSwitchToEditor();
      }
    } catch (err) {
      console.error('Remix failed:', err);
    } finally {
      setRemixing(null);
    }
  };

  // Turn opportunities into ad variations
  const handleUseOpportunities = () => {
    if (!result?.marketInsights) return;

    const variations = result.marketInsights.opportunities
      .slice(0, 4)
      .map((opp) => ({
        headline: opp.length > 60 ? opp.substring(0, 57) + '...' : opp,
        subtext: `Opportunity identified from competitor analysis in the ${industry || 'your'} market.`,
      }));

    if (variations.length > 0) {
      onAppendVariations(variations);
      onSwitchToEditor();
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
            <path d="M10.5 8a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
          </svg>
          <h2 className="text-[15px] font-semibold text-af-text-primary">Competitor Spy</h2>
        </div>
        <p className="text-[11px] text-af-text-tertiary">
          Analyze competitor ads and find gaps to exploit in your campaigns
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[800px] mx-auto">
          {!result ? (
            /* Input Form */
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Competitors (comma-separated) *</label>
                <input
                  type="text"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  placeholder="e.g. Nike, Adidas, New Balance"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Athletic Footwear"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Your Product</label>
                  <input
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="e.g. Performance running shoes"
                    className={inputClass}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">
                  <p className="text-[12px] text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={analyzing || !competitors.trim()}
                className="w-full px-5 py-3 rounded-md text-[13px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all disabled:opacity-40"
              >
                {analyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing Competitors...
                  </span>
                ) : (
                  'Analyze Competitors'
                )}
              </button>
            </div>
          ) : (
            /* Results */
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-af-text-primary">Competitor Analysis</h3>
                <button
                  onClick={() => {
                    setResult(null);
                    setError('');
                  }}
                  className="text-[11px] text-af-text-tertiary hover:text-af-text-primary transition-colors"
                >
                  New Analysis
                </button>
              </div>

              {/* Competitor Cards */}
              {result.competitors.map((comp, i) => (
                <div
                  key={i}
                  className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[13px] font-semibold text-af-text-primary">{comp.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded border ${
                        comp.estimatedAdSpend === 'high'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : comp.estimatedAdSpend === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-green-500/10 text-green-400 border-green-500/20'
                      }`}>
                        {comp.estimatedAdSpend} spend
                      </span>
                      <button
                        onClick={() => handleRemix(comp)}
                        disabled={remixing === comp.name}
                        className="text-[10px] font-medium text-af-accent hover:text-af-accent-hover transition-colors disabled:opacity-40"
                      >
                        {remixing === comp.name ? 'Remixing...' : 'Remix'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {comp.primaryMessages.length > 0 && (
                      <div>
                        <span className="text-[9px] font-semibold text-af-text-tertiary uppercase">Messages</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {comp.primaryMessages.map((msg, j) => (
                            <span key={j} className="text-[10px] bg-af-bg-tertiary text-af-text-secondary rounded px-2 py-0.5">
                              {msg}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {comp.strengths.length > 0 && (
                      <div>
                        <span className="text-[9px] font-semibold text-green-400 uppercase">Strengths</span>
                        <ul className="mt-1 space-y-0.5">
                          {comp.strengths.map((s, j) => (
                            <li key={j} className="text-[11px] text-af-text-secondary">{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {comp.weaknesses.length > 0 && (
                      <div>
                        <span className="text-[9px] font-semibold text-red-400 uppercase">Weaknesses</span>
                        <ul className="mt-1 space-y-0.5">
                          {comp.weaknesses.map((w, j) => (
                            <li key={j} className="text-[11px] text-af-text-secondary">{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Market Insights */}
              {result.marketInsights && (
                <div className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-5">
                  <h4 className="text-[11px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-3">
                    Market Insights
                  </h4>
                  <div className="space-y-3">
                    {result.marketInsights.gaps.length > 0 && (
                      <div>
                        <span className="text-[10px] font-semibold text-amber-400">Gaps in the Market</span>
                        <ul className="mt-1 space-y-0.5">
                          {result.marketInsights.gaps.map((g, i) => (
                            <li key={i} className="text-[11px] text-af-text-secondary">{g}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.marketInsights.opportunities.length > 0 && (
                      <div>
                        <span className="text-[10px] font-semibold text-green-400">Opportunities</span>
                        <ul className="mt-1 space-y-0.5">
                          {result.marketInsights.opportunities.map((o, i) => (
                            <li key={i} className="text-[11px] text-af-text-secondary">{o}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {result.marketInsights.opportunities.length > 0 && (
                    <button
                      onClick={handleUseOpportunities}
                      className="mt-4 w-full px-4 py-2.5 rounded-md text-[12px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all"
                    >
                      Turn Opportunities into Ad Variations
                    </button>
                  )}
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="bg-af-bg-secondary border border-af-border-subtle rounded-lg p-5">
                  <h4 className="text-[11px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-3">
                    Recommendations
                  </h4>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <span className="w-5 h-5 rounded-full bg-af-accent/20 text-af-accent text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-[11px] text-af-text-secondary leading-[1.5]">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
