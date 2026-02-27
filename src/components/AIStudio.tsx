// ============================================
// AdForge — AI Studio Component
// Standalone AI image generation tab
// ============================================

'use client';

import React, { useState } from 'react';
import { GeneratedImage, ImageType } from '@/lib/types';

interface AIStudioProps {
  generatedImages: GeneratedImage[];
  onSaveImage: (image: GeneratedImage) => void;
}

export default function AIStudio({
  generatedImages,
  onSaveImage,
}: AIStudioProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('modern');
  const [colorScheme, setColorScheme] = useState('dark');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);

    const fullPrompt = `Create a Facebook ad for ${prompt.trim()}. Style: ${style}. Color scheme: ${colorScheme}.`;

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          type: 'standalone' as ImageType,
          width: 1080,
          height: 1080,
        }),
      });
      const data = await res.json();
      if (data.success && data.image_url) {
        onSaveImage({
          prompt: fullPrompt,
          image_url: data.image_url,
          image_type: 'standalone',
        });
      } else {
        alert('Failed to generate image: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('AI Studio generation failed:', err);
      alert('Failed to generate image.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadImage = async (url: string, index: number) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `ai-creative-${String(index + 1).padStart(3, '0')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  };

  const standaloneImages = generatedImages.filter(
    (img) => img.image_type === 'standalone'
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-af-bg-primary">
      {/* Header / Generator */}
      <div className="bg-af-bg-secondary border-b border-af-border-subtle px-6 py-5">
        <div className="flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-af-accent">
            <path d="M8 1l2 4 4.5.7-3.2 3.2.8 4.6L8 11.3 3.9 13.5l.8-4.6L1.5 5.7 6 5z" />
          </svg>
          <h2 className="text-[15px] font-semibold text-af-text-primary">
            AI Creative Studio
          </h2>
          <span className="text-[10px] font-medium text-af-text-tertiary bg-af-bg-tertiary border border-af-border-default rounded px-2 py-0.5">
            Beta
          </span>
        </div>

        <div className="flex flex-col gap-3 max-w-[700px]">
          {/* Prompt */}
          <div>
            <label className="block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5">
              Product / Concept
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerate();
              }}
              placeholder="e.g. a premium fitness app, an AI writing tool, organic skincare line..."
              className="w-full bg-af-bg-tertiary border border-af-border-default rounded-md text-af-text-primary text-[13px] px-3 py-2.5 outline-none focus:border-af-accent"
            />
          </div>

          {/* Options row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5">
                Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-af-bg-tertiary border border-af-border-default rounded text-af-text-primary text-[12px] px-3 py-2 outline-none cursor-pointer focus:border-af-accent"
              >
                <option value="modern">Modern</option>
                <option value="bold">Bold</option>
                <option value="minimal">Minimal</option>
                <option value="luxury">Luxury</option>
                <option value="playful">Playful</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-semibold text-af-text-tertiary uppercase tracking-[0.06em] mb-1.5">
                Color Scheme
              </label>
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value)}
                className="w-full bg-af-bg-tertiary border border-af-border-default rounded text-af-text-primary text-[12px] px-3 py-2 outline-none cursor-pointer focus:border-af-accent"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="vibrant">Vibrant</option>
                <option value="pastel">Pastel</option>
                <option value="monochrome">Monochrome</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                className="px-5 py-2 rounded-md text-[12px] font-medium bg-af-accent border border-af-accent text-white hover:bg-af-accent-hover transition-all disabled:opacity-40 whitespace-nowrap"
              >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Creative'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="flex-1 overflow-y-auto p-6">
        {standaloneImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="text-af-border-default mb-4"
            >
              <path d="M8 1l2 4 4.5.7-3.2 3.2.8 4.6L8 11.3 3.9 13.5l.8-4.6L1.5 5.7 6 5z" />
            </svg>
            <p className="text-[13px] text-af-text-tertiary mb-1">
              No AI creatives generated yet
            </p>
            <p className="text-[11px] text-af-text-tertiary/60">
              Describe your product above and click &ldquo;Generate Creative&rdquo; to start
            </p>
          </div>
        ) : (
          <div className="ai-gallery-grid">
            {standaloneImages.map((img, i) => (
              <div
                key={img.id || i}
                className="bg-af-bg-secondary border border-af-border-subtle rounded-lg overflow-hidden group"
              >
                <div className="aspect-square overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.image_url}
                    alt={img.prompt}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDownloadImage(img.image_url, i)}
                      className="px-4 py-2 rounded-md text-[11px] font-medium bg-white text-black hover:bg-gray-200 transition-all"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="inline-block mr-1.5 -mt-[1px]"
                      >
                        <path d="M8 2v8M8 10L5 7M8 10l3-3M3 13h10" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-[10px] text-af-text-tertiary line-clamp-2 leading-[1.4]">
                    {img.prompt}
                  </p>
                  {img.created_at && (
                    <p className="text-[9px] text-af-text-tertiary/50 mt-1">
                      {new Date(img.created_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
