// ============================================
// SmartGenerator Component
// ============================================

'use client';

import React, { useState } from 'react';

interface GeneratedAd {
  id: string;
  headline: string;
  subtext: string;
  cta: string;
  platform: string;
  score: number;
  color: string;
  emoji: string;
  reasoning: string;
}

interface FormData {
  product: string;
  audience: string;
  goal: string;
  tone: string;
  platforms: string[];
  budget: string;
  uniqueValue: string;
}

const PLATFORM_OPTIONS = [
  { id: 'facebook', label: 'Facebook', emoji: '📘' },
  { id: 'instagram', label: 'Instagram', emoji: '📷' },
  { id: 'linkedin', label: 'LinkedIn', emoji: '💼' },
  { id: 'twitter', label: 'Twitter/X', emoji: '🐦' },
  { id: 'tiktok', label: 'TikTok', emoji: '🎵' },
  { id: 'google', label: 'Google', emoji: '🔍' },
];

const TONE_OPTIONS = ['Professional', 'Casual', 'Urgent', 'Playful', 'Inspirational', 'Authoritative'];
const GOAL_OPTIONS = ['Brand Awareness', 'Lead Generation', 'Direct Sales', 'App Installs', 'Event Signups', 'Retargeting'];

export default function SmartGenerator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    product: '',
    audience: '',
    goal: '',
    tone: '',
    platforms: [],
    budget: '',
    uniqueValue: '',
  });
  const [generatedAds, setGeneratedAds] = useState<GeneratedAd[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAd, setSelectedAd] = useState<GeneratedAd | null>(null);

  const updateForm = (key: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const togglePlatform = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(id)
        ? prev.platforms.filter((p) => p !== id)
        : [...prev.platforms, id],
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));

    const mockAds: GeneratedAd[] = [
      {
        id: '1',
        headline: `Transform Your ${formData.audience || 'Business'} Today`,
        subtext: `${formData.product || 'Our solution'} helps you achieve ${formData.goal || 'your goals'} faster than ever before.`,
        cta: 'Get Started Free',
        platform: formData.platforms[0] || 'Facebook',
        score: 94,
        color: '#6366f1',
        emoji: '🚀',
        reasoning: 'High-converting headline pattern with clear value proposition and low-friction CTA.',
      },
      {
        id: '2',
        headline: `Stop Struggling with ${formData.goal || 'Your Goals'}`,
        subtext: `Join 10,000+ teams using ${formData.product || 'our platform'} to get results.`,
        cta: 'See How It Works',
        platform: formData.platforms[1] || 'Instagram',
        score: 89,
        color: '#0891b2',
        emoji: '💡',
        reasoning: 'Pain-aware hook with social proof. Strong for cold audiences.',
      },
      {
        id: '3',
        headline: `The Smarter Way to ${formData.goal || 'Grow'}`,
        subtext: `${formData.uniqueValue || 'Built for results'}. Try it free for 14 days.`,
        cta: 'Start Free Trial',
        platform: formData.platforms[2] || 'LinkedIn',
        score: 87,
        color: '#7c3aed',
        emoji: '⚡',
        reasoning: 'Positions as premium alternative. Trial offer reduces conversion friction.',
      },
      {
        id: '4',
        headline: `${formData.audience || 'Smart Marketers'} Choose This`,
        subtext: 'Trusted by 50,000+ brands. See why in a free demo.',
        cta: 'Book a Demo',
        platform: 'Google',
        score: 85,
        color: '#b45309',
        emoji: '🎯',
        reasoning: 'Authority-based appeal with social proof. Ideal for B2B conversion.',
      },
    ];

    setGeneratedAds(mockAds);
    setStep(3);
    setIsGenerating(false);
  };

  return (
    <div className="flex-1 flex gap-4 p-6 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <button
                onClick={() => step > s && setStep(s)}
                className={`w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                  s === step
                    ? 'bg-indigo-600 text-white'
                    : s < step
                    ? 'bg-emerald-600 text-white cursor-pointer'
                    : 'bg-gray-700 text-gray-500'
                }`}
              >
                {s < step ? '✓' : s}
              </button>
              {s < 3 && (
                <div className={`flex-1 h-0.5 ${
                  s < step ? 'bg-emerald-600' : 'bg-gray-700'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Brief */}
        {step === 1 && (
          <div className="flex-1 overflow-y-auto space-y-4">
            <h2 className="font-semibold text-white">Campaign Brief</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Product / Service</label>
                <input
                  type="text"
                  placeholder="e.g., AI marketing platform"
                  value={formData.product}
                  onChange={(e) => updateForm('product', e.target.value)}
                  className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Target Audience</label>
                <input
                  type="text"
                  placeholder="e.g., SMB marketers"
                  value={formData.audience}
                  onChange={(e) => updateForm('audience', e.target.value)}
                  className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Campaign Goal</label>
                <select
                  value={formData.goal}
                  onChange={(e) => updateForm('goal', e.target.value)}
                  className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 border border-gray-700"
                >
                  <option value="">Select goal...</option>
                  {GOAL_OPTIONS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Tone of Voice</label>
                <select
                  value={formData.tone}
                  onChange={(e) => updateForm('tone', e.target.value)}
                  className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 border border-gray-700"
                >
                  <option value="">Select tone...</option>
                  {TONE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1.5">Unique Value Proposition</label>
                <textarea
                  placeholder="What makes your product/service unique?"
                  value={formData.uniqueValue}
                  onChange={(e) => updateForm('uniqueValue', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Next: Platforms →
            </button>
          </div>
        )}

        {/* Step 2: Platforms */}
        {step === 2 && (
          <div className="flex-1 overflow-y-auto space-y-4">
            <h2 className="font-semibold text-white">Select Platforms</h2>
            <div className="grid grid-cols-3 gap-3">
              {PLATFORM_OPTIONS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`rounded-xl border p-4 transition-all flex flex-col items-center gap-2 ${
                    formData.platforms.includes(platform.id)
                      ? 'border-indigo-500 bg-indigo-900/20'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <span className="text-3xl">{platform.emoji}</span>
                  <span className="text-sm text-white">{platform.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  '✨ Generate Ads'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <div className="flex-1 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white">Generated Ads ({generatedAds.length})</h2>
              <button
                onClick={() => { setStep(1); setGeneratedAds([]); setSelectedAd(null); }}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                ← Start Over
              </button>
            </div>
            {generatedAds.map((ad) => (
              <div
                key={ad.id}
                onClick={() => setSelectedAd(ad)}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  selectedAd?.id === ad.id
                    ? 'border-indigo-500 bg-gray-800'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: ad.color }}
                  >
                    {ad.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{ad.headline}</div>
                    <div className="text-sm text-gray-400 mt-0.5">{ad.subtext}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                        {ad.platform}
                      </span>
                      <span className="text-xs text-emerald-400 font-semibold">Score: {ad.score}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ad Detail */}
      {selectedAd && (
        <div className="w-72 bg-gray-900 rounded-xl border border-gray-800 p-5 flex flex-col gap-4">
          <div
            className="rounded-xl p-4 flex flex-col items-center text-center"
            style={{ backgroundColor: selectedAd.color }}
          >
            <div className="text-3xl mb-2">{selectedAd.emoji}</div>
            <div className="text-white font-bold">{selectedAd.headline}</div>
            <div className="text-white/70 text-sm mt-1">{selectedAd.subtext}</div>
            <button className="mt-3 bg-white text-gray-900 text-sm font-semibold px-4 py-1.5 rounded-full">
              {selectedAd.cta}
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">AI Reasoning</div>
            <div className="text-sm text-gray-300">{selectedAd.reasoning}</div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 rounded-lg transition-colors">
              Use This Ad
            </button>
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 rounded-lg transition-colors">
              Remix
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
