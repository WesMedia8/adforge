// ============================================
// AdForge — useExport Hook
// Handles PNG download & ZIP export
// ============================================

'use client';

import { useState, useCallback, useRef } from 'react';
import { Variation, TemplateSettings, LayoutType } from '@/lib/types';
import { buildAdHTML } from '@/lib/export';

export function useExport() {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [progressMessage, setProgressMessage] = useState('');
  const renderRef = useRef<HTMLDivElement | null>(null);

  const setRenderRef = useCallback((el: HTMLDivElement | null) => {
    renderRef.current = el;
  }, []);

  /**
   * Render a variation into the offscreen canvas and return the element
   */
  const renderToCanvas = useCallback(
    (
      variation: Variation,
      settings: TemplateSettings,
      layout: LayoutType
    ): HTMLElement | null => {
      if (!renderRef.current) return null;
      renderRef.current.innerHTML = buildAdHTML(variation, settings, layout);
      return renderRef.current.firstElementChild as HTMLElement;
    },
    []
  );

  /**
   * Download the currently previewed variation as PNG
   */
  const downloadCurrent = useCallback(
    async (
      variation: Variation,
      settings: TemplateSettings,
      layout: LayoutType,
      index: number
    ) => {
      if (!renderRef.current) return;
      setExporting(true);
      setProgressMessage('Rendering...');

      try {
        renderRef.current.innerHTML = buildAdHTML(variation, settings, layout);
        const target = renderRef.current.firstElementChild as HTMLElement;
        if (!target) throw new Error('No render target');

        await new Promise((r) => setTimeout(r, 150));

        const { toPng } = await import('html-to-image');
        const dataUrl = await toPng(target, {
          width: 1080,
          height: 1080,
          pixelRatio: 1,
          cacheBust: true,
        });

        // Convert data URL to blob for download
        const parts = dataUrl.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/png';
        const bytes = atob(parts[1]);
        const arr = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
        const blob = new Blob([arr], { type: mime });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `ad-${String(index + 1).padStart(3, '0')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Export failed:', err);
        alert('Export failed. Try again.');
      } finally {
        setExporting(false);
        setProgressMessage('');
      }
    },
    []
  );

  /**
   * Download all variations as a ZIP file
   */
  const downloadAll = useCallback(
    async (
      variations: Variation[],
      settings: TemplateSettings,
      layout: LayoutType
    ) => {
      if (!renderRef.current) return;
      setExporting(true);
      const total = variations.length;
      setProgress({ current: 0, total });
      setProgressMessage(`Rendering 0 / ${total}...`);

      try {
        const { toPng } = await import('html-to-image');
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        for (let i = 0; i < total; i++) {
          renderRef.current.innerHTML = buildAdHTML(variations[i], settings, layout);
          const target = renderRef.current.firstElementChild as HTMLElement;
          if (!target) continue;

          await new Promise((r) => setTimeout(r, 180));

          try {
            const dataUrl = await toPng(target, {
              width: 1080,
              height: 1080,
              pixelRatio: 1,
              cacheBust: true,
            });
            const base64 = dataUrl.split(',')[1];
            zip.file(`ad-${String(i + 1).padStart(3, '0')}.png`, base64, {
              base64: true,
            });
          } catch (err) {
            console.error(`Variation ${i + 1} failed:`, err);
          }

          setProgress({ current: i + 1, total });
          setProgressMessage(`Rendering ${i + 1} / ${total}...`);
        }

        setProgressMessage('Creating ZIP...');

        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'adforge-ads.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('ZIP export failed:', err);
        alert('ZIP creation failed.');
      } finally {
        setTimeout(() => {
          setExporting(false);
          setProgress({ current: 0, total: 0 });
          setProgressMessage('');
        }, 600);
      }
    },
    []
  );

  return {
    exporting,
    progress,
    progressMessage,
    setRenderRef,
    downloadCurrent,
    downloadAll,
  };
}
