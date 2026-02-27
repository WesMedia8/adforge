// ============================================
// AdForge — Main Page
// ============================================

'use client';

import React, { useState, useCallback } from 'react';
import Header, { ActiveTab } from '@/components/Header';
import VariationsSidebar from '@/components/VariationsSidebar';
import TemplateCustomizer from '@/components/TemplateCustomizer';
import AdPreview from '@/components/AdPreview';
import ThumbnailStrip from '@/components/ThumbnailStrip';
import ExportBar from '@/components/ExportBar';
import AIStudio from '@/components/AIStudio';
import SmartGenerator from '@/components/SmartGenerator';
import AdRemix from '@/components/AdRemix';
import CompetitorSpy from '@/components/CompetitorSpy';
import ConsumerResearch from '@/components/ConsumerResearch';
import FrameworkSelector from '@/components/FrameworkSelector';
import DiversityDashboard from '@/components/DiversityDashboard';
import ProjectManager from '@/components/ProjectManager';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AdVariation {
  id: string;
  name: string;
  headline: string;
  subtext: string;
  cta: string;
  color: string;
  emoji: string;
}

interface Template {
  id: string;
  name: string;
  platform: string;
  size: string;
  layout: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('create');
  const [selectedVariation, setSelectedVariation] = useState(0);

  const [variations, setVariations] = useState<AdVariation[]>([
    {
      id: '1',
      name: 'Variation A',
      headline: 'Transform Your Marketing',
      subtext: 'AI-powered ad creation that converts',
      cta: 'Get Started Free',
      color: '#6366f1',
      emoji: '🚀',
    },
    {
      id: '2',
      name: 'Variation B',
      headline: 'Scale Your Campaigns',
      subtext: 'Generate hundreds of variations instantly',
      cta: 'Try It Now',
      color: '#8b5cf6',
      emoji: '⚡',
    },
    {
      id: '3',
      name: 'Variation C',
      headline: 'Beat the Competition',
      subtext: 'Data-driven ads that outperform',
      cta: 'Start Today',
      color: '#06b6d4',
      emoji: '🎯',
    },
  ]);

  const [template, setTemplate] = useState<Template>({
    id: '1',
    name: 'Social Square',
    platform: 'Instagram',
    size: '1080x1080',
    layout: 'centered',
  });

  const handleVariationUpdate = useCallback(
    (index: number, updates: Partial<AdVariation>) => {
      setVariations((prev) =>
        prev.map((v, i) => (i === index ? { ...v, ...updates } : v))
      );
    },
    []
  );

  const currentVariation = variations[selectedVariation];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'create' && (
          <>
            {/* Left sidebar */}
            <VariationsSidebar
              variations={variations}
              selectedIndex={selectedVariation}
              onSelect={setSelectedVariation}
              onUpdate={handleVariationUpdate}
            />

            {/* Center canvas */}
            <div className="flex-1 flex flex-col">
              <AdPreview variation={currentVariation} template={template} />
              <ThumbnailStrip
                variations={variations}
                selectedIndex={selectedVariation}
                onSelect={setSelectedVariation}
              />
            </div>

            {/* Right panel */}
            <TemplateCustomizer
              template={template}
              variation={currentVariation}
              onTemplateChange={setTemplate}
              onVariationChange={(updates) =>
                handleVariationUpdate(selectedVariation, updates)
              }
            />
          </>
        )}

        {activeTab === 'ai-studio' && <AIStudio />}
        {activeTab === 'smart-gen' && <SmartGenerator />}
        {activeTab === 'remix' && <AdRemix />}
        {activeTab === 'competitor' && <CompetitorSpy />}
        {activeTab === 'research' && <ConsumerResearch />}
        {activeTab === 'frameworks' && <FrameworkSelector />}
        {activeTab === 'diversity' && <DiversityDashboard />}
        {activeTab === 'projects' && <ProjectManager />}
      </main>

      {/* Export bar */}
      <ExportBar variation={currentVariation} template={template} />
    </div>
  );
}
