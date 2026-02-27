// ============================================
// AdForge — Project Manager Component
// ============================================

'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '@/lib/types';

interface ProjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  currentProject: Project | null;
  saving: boolean;
  loading: boolean;
  onFetchProjects: () => Promise<void>;
  onSaveProject: (name?: string) => Promise<void>;
  onLoadProject: (id: string) => Promise<void>;
  onNewProject: () => void;
}

export default function ProjectManager({
  isOpen,
  onClose,
  projects,
  currentProject,
  saving,
  loading,
  onFetchProjects,
  onSaveProject,
  onLoadProject,
  onNewProject,
}: ProjectManagerProps) {
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    if (isOpen) {
      onFetchProjects();
      setProjectName(currentProject?.name || '');
    }
  }, [isOpen, onFetchProjects, currentProject?.name]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const name = projectName.trim() || 'Untitled Project';
    await onSaveProject(name);
  };

  const handleNew = () => {
    onNewProject();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[200]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] max-h-[80vh] bg-af-bg-secondary border border-af-border-default rounded-lg shadow-2xl z-[201] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-af-border-subtle">
          <h2 className="text-[14px] font-semibold text-af-text-primary">
            Projects
          </h2>
          <button
            onClick={onClose}
            className="w-[24px] h-[24px] flex items-center justify-center rounded text-af-text-tertiary hover:text-af-text-primary hover:bg-af-bg-hover transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* Save Section */}
        <div className="px-5 py-3 border-b border-af-border-subtle">
          <label className="block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5">
            {currentProject ? 'Update Project' : 'Save New Project'}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
              placeholder="Project name..."
              className="flex-1 bg-af-bg-tertiary border border-af-border-default rounded text-af-text-primary text-[12px] px-3 py-[6px] outline-none focus:border-af-accent"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-[6px] rounded text-[11px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {saving ? 'Saving...' : currentProject ? 'Update' : 'Save'}
            </button>
          </div>
        </div>

        {/* New Project */}
        <div className="px-5 py-2.5 border-b border-af-border-subtle">
          <button
            onClick={handleNew}
            className="flex items-center gap-2 text-[11.5px] font-medium text-af-accent hover:text-af-text-primary transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 2v12M2 8h12" />
            </svg>
            New Empty Project
          </button>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto px-5 py-3 min-h-0">
          {loading && (
            <div className="text-center text-[11px] text-af-text-tertiary py-6">
              Loading projects...
            </div>
          )}

          {!loading && projects.length === 0 && (
            <div className="text-center text-[11px] text-af-text-tertiary py-6">
              No saved projects yet.
            </div>
          )}

          {!loading &&
            projects.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  if (p.id) {
                    onLoadProject(p.id);
                    onClose();
                  }
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded cursor-pointer mb-1 transition-all group ${
                  currentProject?.id === p.id
                    ? 'bg-af-accent-subtle border border-af-accent/20'
                    : 'hover:bg-af-bg-hover border border-transparent'
                }`}
              >
                <div>
                  <div className="text-[12px] font-medium text-af-text-primary">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-af-text-tertiary mt-0.5">
                    {p.updated_at
                      ? new Date(p.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </div>
                </div>
                <div className="text-[10px] text-af-text-tertiary group-hover:text-af-accent transition-colors">
                  {currentProject?.id === p.id ? 'Current' : 'Load →'}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
