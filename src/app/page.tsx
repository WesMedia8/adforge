'use client';

import { useState } from 'react';
import { ProjectSetup } from '@/components/ProjectSetup';
import { ResearchPhase } from '@/components/ResearchPhase';
import { AdCreationPhase } from '@/components/AdCreationPhase';
import { ReviewPhase } from '@/components/ReviewPhase';
import { MetaPublishPhase } from '@/components/MetaPublishPhase';
import { useProject } from '@/hooks/useProject';
import { Zap, ChevronRight } from 'lucide-react';

type Phase = 'setup' | 'research' | 'create' | 'review' | 'publish';

const phases: { id: Phase; label: string }[] = [
  { id: 'setup', label: 'Setup' },
  { id: 'research', label: 'Research' },
  { id: 'create', label: 'Create' },
  { id: 'review', label: 'Review' },
  { id: 'publish', label: 'Publish' },
];

export default function Home() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('setup');
  const { project, updateProject } = useProject();

  const handlePhaseComplete = (phase: Phase) => {
    const phaseOrder: Phase[] = ['setup', 'research', 'create', 'review', 'publish'];
    const currentIndex = phaseOrder.indexOf(phase);
    if (currentIndex < phaseOrder.length - 1) {
      setCurrentPhase(phaseOrder[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold">AdForge</span>
          </div>
          
          {/* Phase Navigation */}
          <nav className="flex items-center gap-1">
            {phases.map((phase, index) => (
              <div key={phase.id} className="flex items-center">
                <button
                  onClick={() => setCurrentPhase(phase.id)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    currentPhase === phase.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {phase.label}
                </button>
                {index < phases.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-600 mx-1" />
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPhase === 'setup' && (
          <ProjectSetup
            project={project}
            onUpdate={updateProject}
            onComplete={() => handlePhaseComplete('setup')}
          />
        )}
        {currentPhase === 'research' && (
          <ResearchPhase
            project={project}
            onUpdate={updateProject}
            onComplete={() => handlePhaseComplete('research')}
          />
        )}
        {currentPhase === 'create' && (
          <AdCreationPhase
            project={project}
            onUpdate={updateProject}
            onComplete={() => handlePhaseComplete('create')}
          />
        )}
        {currentPhase === 'review' && (
          <ReviewPhase
            project={project}
            onUpdate={updateProject}
            onComplete={() => handlePhaseComplete('review')}
          />
        )}
        {currentPhase === 'publish' && (
          <MetaPublishPhase
            project={project}
            onUpdate={updateProject}
          />
        )}
      </main>
    </div>
  );
}
