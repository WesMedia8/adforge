// ============================================
// AdForge — Project Manager Component
// ============================================

'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types';

interface ProjectManagerProps {
  projects: Project[];
  currentProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string) => void;
  onDeleteProject: (id: string) => void;
  onClose: () => void;
}

export default function ProjectManager({
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onClose,
}: ProjectManagerProps) {
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreateProject(newName.trim());
    setNewName('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-af-bg-secondary border border-af-border-default rounded-lg p-6 flex flex-col gap-4"
        style={{ width: '100%', maxWidth: 480 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-af-text-primary">Projects</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded text-af-text-tertiary hover:text-af-text-primary hover:bg-af-bg-tertiary transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        {/* Create new */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
            placeholder="New project name..."
            className="flex-1 bg-af-bg-tertiary border border-af-border-default rounded text-af-text-primary text-[13px] px-3 py-2 outline-none focus:border-af-accent"
          />
          <button
            onClick={handleCreate}
            disabled={!newName.trim()}
            className="px-4 py-2 rounded text-[12px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all disabled:opacity-40"
          >
            Create
          </button>
        </div>

        {/* Project list */}
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
          {projects.length === 0 && (
            <p className="text-[12px] text-af-text-tertiary text-center py-4">No projects yet</p>
          )}
          {projects.map((p) => (
            <div
              key={p.id}
              className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all ${
                p.id === currentProjectId
                  ? 'bg-af-accent/10 border border-af-accent/20'
                  : 'hover:bg-af-bg-tertiary border border-transparent'
              }`}
              onClick={() => { onSelectProject(p.id); onClose(); }}
            >
              <div>
                <p className="text-[13px] font-medium text-af-text-primary">{p.name}</p>
                <p className="text-[10px] text-af-text-tertiary">
                  {p.variations.length} variation{p.variations.length !== 1 ? 's' : ''} · {new Date(p.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteProject(p.id); }}
                className="w-6 h-6 flex items-center justify-center rounded text-af-text-tertiary hover:text-[#ff3355] hover:bg-[rgba(255,51,85,0.1)] transition-all"
              >
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    <>
    </>
  );
}
