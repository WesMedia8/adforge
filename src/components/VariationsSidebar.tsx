// ============================================
// AdForge — Variations Sidebar
// ============================================

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Variation } from '@/lib/types';

interface VariationsSidebarProps {
  variations: Variation[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onUpdate: (index: number, headline: string, subtext: string) => void;
  onRemove: (index: number) => void;
  onBulkImport: (data: Array<{ headline: string; subtext?: string }>) => void;
}

export default function VariationsSidebar({
  variations,
  activeIndex,
  onSelect,
  onAdd,
  onUpdate,
  onRemove,
  onBulkImport,
}: VariationsSidebarProps) {
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editHeadline, setEditHeadline] = useState('');
  const [editSubtext, setEditSubtext] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const handleImport = () => {
    try {
      const data = JSON.parse(importText);
      if (!Array.isArray(data)) throw new Error('Not an array');
      const valid = data.filter(
        (d: any) => d.headline && typeof d.headline === 'string'
      );
      if (valid.length === 0) throw new Error('No valid items');
      onBulkImport(valid);
      setShowImport(false);
      setImportText('');
    } catch (err: any) {
      alert(
        'Invalid JSON. Expected: [{"headline":"...","subtext":"..."}]\n\n' +
          err.message
      );
    }
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditHeadline(variations[index].headline);
    setEditSubtext(variations[index].subtext);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    onUpdate(editingIndex, editHeadline || 'Untitled', editSubtext);
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  // Scroll to bottom when a new variation is added
  useEffect(() => {
    if (listRef.current && activeIndex === variations.length - 1) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [variations.length, activeIndex]);

  return (
    <aside className="w-[280px] min-w-[280px] bg-af-bg-secondary border-r border-af-border-subtle flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-af-border-subtle shrink-0">
        <h3 className="text-[10.5px] font-semibold text-af-text-tertiary uppercase tracking-[0.08em]">
          Ad Variations
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setShowImport(!showImport)}
            title="Bulk Import JSON"
            className="w-[26px] h-[26px] flex items-center justify-center border border-af-border-default rounded bg-af-bg-tertiary text-af-text-tertiary hover:text-af-text-primary hover:border-af-border-bright hover:bg-af-bg-hover transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2h5l2 2h5v10H2V2z" />
            </svg>
          </button>
          <button
            onClick={onAdd}
            title="Add Variation"
            className="w-[26px] h-[26px] flex items-center justify-center border border-[rgba(0,102,255,0.3)] rounded bg-af-accent-subtle text-af-accent hover:bg-[rgba(0,102,255,0.18)] transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 2v12M2 8h12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bulk Import Panel */}
      {showImport && (
        <div className="px-3 py-2.5 border-b border-af-border-subtle bg-af-bg-tertiary">
          <label className="block text-[10px] text-af-text-tertiary mb-1.5 uppercase tracking-[0.05em] font-medium">
            Paste JSON array of {'{headline, subtext}'}
          </label>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={'[{"headline":"Your Headline","subtext":"Your subtext here."}]'}
            rows={5}
            className="w-full bg-af-bg-primary border border-af-border-default rounded text-af-text-primary font-mono text-[11px] p-2 resize-y outline-none focus:border-af-accent leading-[1.4]"
          />
          <div className="flex gap-1.5 mt-[7px] justify-end">
            <button
              onClick={() => { setShowImport(false); setImportText(''); }}
              className="px-3 py-1 rounded text-[11px] font-medium border border-af-border-default bg-transparent text-af-text-secondary hover:text-af-text-primary transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              className="px-3 py-1 rounded text-[11px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all"
            >
              Import
            </button>
          </div>
        </div>
      )}

      {/* Variations List */}
      <div ref={listRef} className="flex-1 overflow-y-auto py-1">
        {variations.map((v, i) => (
          <div
            key={i}
            onClick={() => {
              if (editingIndex !== i) {
                onSelect(i);
              }
            }}
            className={`px-3 py-2.5 cursor-pointer border-l-2 transition-all relative group ${
              i === activeIndex
                ? 'bg-af-bg-tertiary border-l-af-accent'
                : 'border-l-transparent hover:bg-[rgba(255,255,255,0.02)]'
            }`}
          >
            {editingIndex === i ? (
              /* Edit Mode */
              <div className="flex flex-col gap-[5px]">
                <input
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  placeholder="Headline"
                  autoFocus
                  className="w-full bg-af-bg-primary border border-af-border-default rounded text-af-text-primary text-[11.5px] px-2 py-1.5 outline-none focus:border-af-accent"
                />
                <input
                  value={editSubtext}
                  onChange={(e) => setEditSubtext(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  placeholder="Subtext"
                  className="w-full bg-af-bg-primary border border-af-border-default rounded text-af-text-primary text-[11.5px] px-2 py-1.5 outline-none focus:border-af-accent"
                />
                <div className="flex gap-[5px] mt-[3px]">
                  <button
                    onClick={(e) => { e.stopPropagation(); cancelEdit(); }}
                    className="px-3 py-1 rounded text-[11px] font-medium border border-af-border-default bg-transparent text-af-text-secondary hover:text-af-text-primary transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); saveEdit(); }}
                    className="px-3 py-1 rounded text-[11px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              /* Display Mode */
              <>
                <div className="text-[9px] font-semibold text-af-text-tertiary uppercase tracking-[0.08em] mb-[3px]">
                  Variation {String(i + 1).padStart(2, '0')}
                </div>
                <div className="text-[12.5px] font-semibold text-af-text-primary mb-[2px] leading-[1.3]">
                  {v.headline}
                </div>
                <div className="text-[11px] text-af-text-tertiary leading-[1.35] line-clamp-2">
                  {v.subtext}
                </div>

                {/* Action buttons on hover */}
                <div className="absolute right-2 top-2 hidden group-hover:flex gap-[3px]">
                  <button
                    onClick={(e) => { e.stopPropagation(); startEdit(i); }}
                    title="Edit"
                    className="w-[22px] h-[22px] flex items-center justify-center border border-af-border-default rounded-[3px] bg-af-bg-elevated text-af-text-tertiary hover:text-af-text-primary hover:border-af-border-bright transition-all"
                  >
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (variations.length > 1) onRemove(i);
                    }}
                    title="Delete"
                    className="w-[22px] h-[22px] flex items-center justify-center border border-af-border-default rounded-[3px] bg-af-bg-elevated text-af-text-tertiary hover:text-af-danger hover:border-af-danger transition-all"
                  >
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4l8 8M12 4l-8 8" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
