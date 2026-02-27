// ============================================
// ProjectManager Component
// ============================================

'use client';

import React, { useState } from 'react';

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'draft';
  adCount: number;
  lastModified: string;
  platform: string;
  color: string;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Summer Campaign 2024',
    client: 'AcmeCorp',
    status: 'active',
    adCount: 24,
    lastModified: '2 hours ago',
    platform: 'Multi-Platform',
    color: '#6366f1',
  },
  {
    id: '2',
    name: 'Product Launch - V2',
    client: 'TechStart',
    status: 'active',
    adCount: 12,
    lastModified: '1 day ago',
    platform: 'Instagram',
    color: '#0891b2',
  },
  {
    id: '3',
    name: 'Holiday Retargeting',
    client: 'RetailBrand',
    status: 'completed',
    adCount: 48,
    lastModified: '1 week ago',
    platform: 'Facebook',
    color: '#7c3aed',
  },
  {
    id: '4',
    name: 'Q1 B2B Awareness',
    client: 'Enterprise Co',
    status: 'draft',
    adCount: 6,
    lastModified: '3 days ago',
    platform: 'LinkedIn',
    color: '#b45309',
  },
];

export default function ProjectManager() {
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'draft'>('all');

  const filteredProjects = projects.filter(
    (p) => filter === 'all' || p.status === filter
  );

  const statusColor = (status: Project['status']) =>
    status === 'active'
      ? 'text-emerald-400 bg-emerald-900/30'
      : status === 'completed'
      ? 'text-blue-400 bg-blue-900/30'
      : 'text-gray-400 bg-gray-800';

  return (
    <div className="flex-1 flex gap-4 p-6 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-semibold text-white">Projects</h2>
          <div className="flex bg-gray-800 rounded-lg p-0.5">
            {(['all', 'active', 'completed', 'draft'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-md capitalize transition-colors ${
                  filter === f ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
            + New Project
          </button>
        </div>

        {/* Project List */}
        <div className="space-y-3 overflow-y-auto">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`rounded-xl border p-4 cursor-pointer transition-all ${
                selectedProject?.id === project.id
                  ? 'border-indigo-500 bg-gray-800'
                  : 'border-gray-800 bg-gray-900 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: project.color }}
                >
                  {project.name[0]}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">{project.name}</div>
                  <div className="text-xs text-gray-500">{project.client} · {project.platform}</div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <div className="text-xs text-gray-600 mt-1">{project.lastModified}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedProject && (
        <div className="w-72 bg-gray-900 rounded-xl border border-gray-800 p-5 flex flex-col gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xl"
            style={{ backgroundColor: selectedProject.color }}
          >
            {selectedProject.name[0]}
          </div>
          <div>
            <h3 className="font-semibold text-white">{selectedProject.name}</h3>
            <div className="text-sm text-gray-500">{selectedProject.client}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500">Ads</div>
              <div className="font-semibold text-white">{selectedProject.adCount}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500">Platform</div>
              <div className="font-semibold text-white text-xs">{selectedProject.platform}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 rounded-lg transition-colors">
              Open
            </button>
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 rounded-lg transition-colors">
              Duplicate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
