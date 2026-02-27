// ============================================
// AIStudio Component
// ============================================

'use client';

import React, { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'playful', label: 'Playful' },
  { value: 'inspirational', label: 'Inspirational' },
];

const PLATFORM_OPTIONS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'google', label: 'Google Ads' },
];

export default function AIStudio() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Welcome to AI Studio! I'm your creative partner for crafting high-converting ad copy. Tell me about your product, target audience, or campaign goals, and I'll help you create compelling ads.",
    },
  ]);
  const [input, setInput] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<string[]>([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `Here's a ${selectedTone} ad for ${selectedPlatform}:\n\n**Headline:** Transform Your Business Today\n**Body:** Discover the power of AI-driven marketing. Join 10,000+ brands seeing 3x better results.\n**CTA:** Start Free Trial`,
        `Based on your brief, here are 3 variations:\n\n1. **"Stop Struggling, Start Scaling"** - Direct approach targeting pain points\n2. **"Your Competitors Are Already Using This"** - FOMO-driven urgency\n3. **"Join 50,000 Marketers Who Switched"** - Social proof focused`,
        `Great insight! For ${selectedPlatform}, I recommend:\n\n- Keep headlines under 40 characters\n- Use action verbs (Get, Start, Discover)\n- Include a specific benefit or number\n- End with a clear CTA`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: randomResponse },
      ]);
      setGeneratedCopy((prev) => [...prev, randomResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const quickPrompts = [
    'Write a Facebook ad for a SaaS product',
    'Create urgency-driven copy for a sale',
    'Generate 5 headline variations',
    'Optimize this copy for mobile',
    'Write a LinkedIn B2B ad',
    'Create a retargeting ad script',
  ];

  return (
    <div className="flex-1 flex gap-4 p-6 overflow-hidden">
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col bg-gray-900 rounded-xl border border-gray-800">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white">AI Copy Assistant</h2>
          <p className="text-sm text-gray-400">Powered by advanced language models</p>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-800 flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Tone</label>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
            >
              {TONE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
            >
              {PLATFORM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-200'
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your product or ask for copy help..."
              className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-72 flex flex-col gap-4">
        {/* Quick Prompts */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h3 className="font-medium text-sm text-white mb-3">Quick Prompts</h3>
          <div className="space-y-2">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt)}
                className="w-full text-left text-xs text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Copy Library */}
        {generatedCopy.length > 0 && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex-1 overflow-hidden flex flex-col">
            <h3 className="font-medium text-sm text-white mb-3">
              Generated Copy ({generatedCopy.length})
            </h3>
            <div className="overflow-y-auto space-y-2">
              {generatedCopy.map((copy, i) => (
                <div
                  key={i}
                  className="text-xs text-gray-400 bg-gray-800 rounded-lg p-2 cursor-pointer hover:bg-gray-700"
                >
                  <pre className="whitespace-pre-wrap font-sans line-clamp-3">
                    {copy.substring(0, 100)}...
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
