// ============================================
// Header Component
// ============================================

'use client';

import React from 'react';

export type ActiveTab =
  | 'create'
  | 'ai-studio'
  | 'smart-gen'
  | 'remix'
  | 'competitor'
  | 'research'
  | 'frameworks'
  | 'diversity'
  | 'projects';

const TABS: { id: ActiveTab; label: string; emoji: string }[] = [
  { id: 'create', label: 'Create', emoji: '✏️' },
  { id: 'ai-studio', label: 'AI Studio', emoji: '🤖' },
  { id: 'smart-gen', label: 'Smart Gen', emoji: '⚡' },
  { id: 'remix', label: 'Remix', emoji: '🎲' },
  { id: 'competitor', label: 'Competitor Spy', emoji: '🔍' },
  { id: 'research', label: 'Research', emoji: '📊' },
  { id: 'frameworks', label: 'Frameworks', emoji: '📐' },
  { id: 'diversity', label: 'Diversity', emoji: '🌈' },
  { id: 'projects', label: 'Projects', emoji: '📁' },
];

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="border-b border-gray-800 bg-gray-900 px-6 py-3 flex items-center gap-6">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold">
          A
        </div>
        <span className="font-bold text-white">AdForge</span>
      </div>

      {/* Tabs */}
      <nav className="flex gap-1 flex-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
          Settings
        </button>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-1.5 rounded-lg transition-colors">
          Upgrade
        </button>
      </div>
    </header>
  );
}
