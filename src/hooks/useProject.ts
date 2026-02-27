import { useState, useCallback } from 'react';
import { Project, defaultProject } from '@/lib/defaults';

export function useProject() {
  const [project, setProject] = useState<Project>(defaultProject);

  const updateProject = useCallback((updates: Partial<Project>) => {
    setProject(prev => ({ ...prev, ...updates }));
  }, []);

  const resetProject = useCallback(() => {
    setProject(defaultProject);
  }, []);

  const saveProject = useCallback(async () => {
    // TODO: Implement Supabase save
    localStorage.setItem('adforge_project', JSON.stringify(project));
  }, [project]);

  const loadProject = useCallback(() => {
    const saved = localStorage.getItem('adforge_project');
    if (saved) {
      setProject(JSON.parse(saved));
    }
  }, []);

  return {
    project,
    updateProject,
    resetProject,
    saveProject,
    loadProject,
  };
}
