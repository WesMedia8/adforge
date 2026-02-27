'use client';

import React, { useState, useCallback } from 'react';
import Header, { ActiveTab } from '@/components/Header';
import VariationsSidebar from '@/components/VariationsSidebar';
import TemplateCustomizer from '@/components/TemplateCustomizer';
import AdPreview from '@/components/AdPreview';
import ThumbnailStrip from '@/components/ThumbnailStrip';
import ExportBar from '@/components/ExportBar';
import ProjectManager from '@/components/ProjectManager';
import SmartGenerator from '@/components/SmartGenerator';
import ConsumerResearch from '@/components/ConsumerResearch';
import CompetitorSpy from '@/components/CompetitorSpy';
import AdsManager from '@/components/AdsManager';
import { useProject } from '@/hooks/useProject';
import { useExport } from '@/hooks/useExport';

export default function Home() {
  const project = useProject();
  const exportHook = useExport();
  const [showProjects, setShowProjects] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('editor');

  const renderContainerRef = useCallback((el: HTMLDivElement | null) => { exportHook.setRenderRef(el); }, [exportHook]);

  const handleDownloadCurrent = () => {
    const variation = project.variations[project.activeIndex];
    if (!variation) return;
    exportHook.downloadCurrent(variation, project.templateSettings, project.layout, project.activeIndex);
  };

  const handleDownloadAll = () => { exportHook.downloadAll(project.variations, project.templateSettings, project.layout); };
  const handleTabChange = useCallback((tab: ActiveTab) => { setActiveTab(tab); }, []);
  const switchToEditor = useCallback(() => { setActiveTab('editor'); }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header layout={project.layout} onLayoutChange={project.setLayout} variationCount={project.variations.length} onDownloadCurrent={handleDownloadCurrent} onDownloadAll={handleDownloadAll} exporting={exportHook.exporting} supabaseReady={project.supabaseReady} currentProjectName={project.currentProject?.name || null} onOpenProjects={() => setShowProjects(true)} onTabChange={handleTabChange} activeTab={activeTab} />
      <ExportBar exporting={exportHook.exporting} progress={exportHook.progress} progressMessage={exportHook.progressMessage} />
      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'editor' ? (
          <>
            <VariationsSidebar variations={project.variations} activeIndex={project.activeIndex} onSelect={project.setActiveIndex} onAdd={project.addVariation} onUpdate={project.updateVariation} onRemove={project.removeVariation} onBulkImport={project.bulkImport} />
            <main className="flex-1 flex flex-col overflow-hidden min-w-0">
              <TemplateCustomizer settings={project.templateSettings} onUpdate={project.updateSettings} />
              <div className="flex-1 flex flex-col overflow-hidden">
                {project.variations[project.activeIndex] && (<AdPreview variation={project.variations[project.activeIndex]} settings={project.templateSettings} layout={project.layout} />)}
                <ThumbnailStrip variations={project.variations} activeIndex={project.activeIndex} settings={project.templateSettings} onSelect={project.setActiveIndex} />
              </div>
            </main>
          </>
        ) : activeTab === 'ai-studio' ? (
          <SmartGenerator generatedImages={project.generatedImages} onSaveImage={project.saveGeneratedImage} onReplaceVariations={project.replaceVariations} onAppendVariations={project.appendVariations} onSwitchToEditor={switchToEditor} onApplyBranding={(branding) => { const update: Parameters<typeof project.updateSettings>[0] = {}; if (branding.logoUrl) update.logoUrl = branding.logoUrl; if (branding.accentColor) update.accentColor = branding.accentColor; if (branding.bgColor) update.bgColor = branding.bgColor; project.updateSettings(update); }} />
        ) : activeTab === 'research' ? (
          <ConsumerResearch onResearchReady={undefined} projectId={project.currentProject?.id} />
        ) : activeTab === 'competitor-spy' ? (
          <CompetitorSpy onAppendVariations={project.appendVariations} onSwitchToEditor={switchToEditor} />
        ) : (
          <AdsManager />
        )}
      </div>
      <div ref={renderContainerRef} style={{ position: 'fixed', left: '-9999px', top: '-9999px', zIndex: -1, width: '1080px', height: '1080px', overflow: 'hidden' }} />
      {project.supabaseReady && (<ProjectManager isOpen={showProjects} onClose={() => setShowProjects(false)} projects={project.projects} currentProject={project.currentProject} saving={project.saving} loading={project.loading} onFetchProjects={project.fetchProjects} onSaveProject={project.saveProject} onLoadProject={project.loadProject} onNewProject={project.newProject} />)}
    </div>
  );
}
