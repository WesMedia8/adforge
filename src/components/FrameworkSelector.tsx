// ============================================
// FrameworkSelector Component
// ============================================

'use client';

import React, { useState } from 'react';

interface Framework {
  id: string;
  name: string;
  acronym: string;
  description: string;
  bestFor: string[];
  structure: FrameworkStep[];
  color: string;
  emoji: string;
  popularity: number;
}

interface FrameworkStep {
  letter: string;
  word: string;
  description: string;
  example: string;
}

const FRAMEWORKS: Framework[] = [
  {
    id: 'aida',
    name: 'AIDA',
    acronym: 'AIDA',
    description: 'The classic marketing funnel framework for guiding prospects through the buyer journey.',
    bestFor: ['Brand awareness', 'Top-of-funnel', 'Cold audiences'],
    color: '#6366f1',
    emoji: '🎯',
    popularity: 95,
    structure: [
      { letter: 'A', word: 'Attention', description: 'Grab the reader\'s attention immediately', example: '"Stop wasting money on ads that don\'t convert"' },
      { letter: 'I', word: 'Interest', description: 'Build interest with relevant information', example: '"Most marketers lose 40% of their budget to poor targeting"' },
      { letter: 'D', word: 'Desire', description: 'Create desire for your product or service', example: '"Imagine cutting your CAC in half while doubling ROAS"' },
      { letter: 'A', word: 'Action', description: 'Drive a specific action', example: '"Start your free trial today — no credit card required"' },
    ],
  },
  {
    id: 'pas',
    name: 'PAS',
    acronym: 'PAS',
    description: 'Problem-Agitate-Solution. A powerful copywriting framework that speaks to pain points.',
    bestFor: ['Direct response', 'Pain-aware audiences', 'Conversions'],
    color: '#dc2626',
    emoji: '💊',
    popularity: 88,
    structure: [
      { letter: 'P', word: 'Problem', description: 'Identify the core pain point', example: '"Your ads are getting clicks but no conversions"' },
      { letter: 'A', word: 'Agitate', description: 'Amplify the pain to create urgency', example: '"Every day you wait costs you $X in wasted ad spend"' },
      { letter: 'S', word: 'Solution', description: 'Present your solution as the fix', example: '"AdForge\'s AI optimization finds winning creatives in 24 hours"' },
    ],
  },
  {
    id: 'fab',
    name: 'FAB',
    acronym: 'FAB',
    description: 'Features-Advantages-Benefits. Translates product specs into customer value.',
    bestFor: ['Product ads', 'Feature launches', 'B2B marketing'],
    color: '#0891b2',
    emoji: '⚙️',
    popularity: 75,
    structure: [
      { letter: 'F', word: 'Features', description: 'What the product has or does', example: '"AI-powered creative optimization engine"' },
      { letter: 'A', word: 'Advantages', description: 'Why the feature matters', example: '"Analyzes 1,000+ data points to predict winning ads"' },
      { letter: 'B', word: 'Benefits', description: 'How it improves the customer\'s life', example: '"You spend less time guessing and more time scaling"' },
    ],
  },
  {
    id: 'bab',
    name: 'BAB',
    acronym: 'BAB',
    description: 'Before-After-Bridge. Creates compelling transformation narratives.',
    bestFor: ['Transformation stories', 'Case studies', 'Testimonial ads'],
    color: '#7c3aed',
    emoji: '🌉',
    popularity: 82,
    structure: [
      { letter: 'B', word: 'Before', description: 'Describe the current painful situation', example: '"You\'re spending 10 hours a week on ad creative. Results are mediocre."' },
      { letter: 'A', word: 'After', description: 'Paint the ideal future state', example: '"Imagine generating 50 optimized ad variations in minutes"' },
      { letter: 'B', word: 'Bridge', description: 'Show how your product bridges the gap', example: '"AdForge\'s AI does the heavy lifting so you can focus on strategy"' },
    ],
  },
  {
    id: '4ps',
    name: '4 Ps',
    acronym: '4PS',
    description: 'Promise-Picture-Proof-Push. A direct response framework with built-in social proof.',
    bestFor: ['Direct response', 'Email marketing', 'Sales copy'],
    color: '#b45309',
    emoji: '📜',
    popularity: 71,
    structure: [
      { letter: 'P', word: 'Promise', description: 'Make a bold, specific promise', example: '"Double your conversion rate in 30 days"' },
      { letter: 'P', word: 'Picture', description: 'Help them visualize the outcome', example: '"Imagine checking your dashboard to see ROAS climbing daily"' },
      { letter: 'P', word: 'Proof', description: 'Back up your promise with evidence', example: '"3,200 brands have already achieved this with AdForge"' },
      { letter: 'P', word: 'Push', description: 'Create urgency to act now', example: '"Start your free trial before prices increase next week"' },
    ],
  },
];

export default function FrameworkSelector() {
  const [selectedFramework, setSelectedFramework] = useState<Framework>(FRAMEWORKS[0]);
  const [inputText, setInputText] = useState('');
  const [generatedOutput, setGeneratedOutput] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1200));

    const mockOutputs: Record<string, string> = {};
    selectedFramework.structure.forEach((step) => {
      mockOutputs[step.letter + step.word] = `[${step.word.toUpperCase()}] ${step.example}`;
    });
    setGeneratedOutput(mockOutputs);
    setIsGenerating(false);
  };

  return (
    <div className="flex-1 flex gap-4 p-6 overflow-hidden">
      {/* Framework List */}
      <div className="w-56 flex flex-col gap-2 overflow-y-auto">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Frameworks</h3>
        {FRAMEWORKS.map((fw) => (
          <button
            key={fw.id}
            onClick={() => { setSelectedFramework(fw); setGeneratedOutput({}); }}
            className={`text-left rounded-xl border p-3 transition-all ${
              selectedFramework.id === fw.id
                ? 'border-indigo-500 bg-gray-800'
                : 'border-gray-800 bg-gray-900 hover:border-gray-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{fw.emoji}</span>
              <span className="font-semibold text-sm text-white">{fw.name}</span>
            </div>
            <div className="text-xs text-gray-500 line-clamp-2">{fw.description}</div>
            <div className="mt-2 flex items-center gap-1">
              <div className="flex-1 bg-gray-700 rounded-full h-1">
                <div
                  className="h-1 rounded-full bg-indigo-500"
                  style={{ width: `${fw.popularity}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{fw.popularity}%</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Framework Header */}
        <div
          className="rounded-xl p-5 flex items-start gap-4"
          style={{ backgroundColor: selectedFramework.color + '22', borderColor: selectedFramework.color + '44', border: '1px solid' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: selectedFramework.color }}
          >
            {selectedFramework.emoji}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-white text-xl">{selectedFramework.name}</h2>
            <p className="text-sm text-gray-300 mt-1">{selectedFramework.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedFramework.bestFor.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: selectedFramework.color + '33', color: selectedFramework.color }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder={`Describe your product (e.g., "AI ad platform for SMBs")...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !inputText.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {isGenerating ? 'Generating...' : `Apply ${selectedFramework.acronym}`}
          </button>
        </div>

        {/* Structure Steps */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {selectedFramework.structure.map((step) => {
            const key = step.letter + step.word;
            const isActive = activeStep === key;
            const hasOutput = !!generatedOutput[key];
            return (
              <div
                key={key}
                onClick={() => setActiveStep(isActive ? null : key)}
                className="rounded-xl border border-gray-800 bg-gray-900 p-4 cursor-pointer hover:border-gray-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: selectedFramework.color }}
                  >
                    {step.letter}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white text-sm">{step.word}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                  {hasOutput && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                </div>

                {isActive && (
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <div className="text-xs text-gray-400 mb-2">Example:</div>
                    <div className="text-sm text-gray-300 italic">{step.example}</div>
                    {hasOutput && (
                      <div className="mt-3">
                        <div className="text-xs text-indigo-400 mb-1">Generated Output:</div>
                        <div className="text-sm text-white bg-indigo-900/20 rounded-lg p-3">
                          {generatedOutput[key]}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
