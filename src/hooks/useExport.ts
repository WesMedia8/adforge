import { useState } from 'react';
import { Project } from '@/lib/types';
import { exportProject } from '@/lib/export';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async (
    project: Project,
    format: 'csv' | 'json' | 'zip'
  ) => {
    setIsExporting(true);
    setExportError(null);

    try {
      await exportProject(project, format);
    } catch (error) {
      console.error('Export error:', error);
      setExportError('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportError,
    handleExport,
  };
}
