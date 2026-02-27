// ============================================
// AdForge — useProject Hook
// Manages all project + ad state
// ============================================

'use client';

import { useState, useCallback } from 'react';
import {
  Variation,
  TemplateSettings,
  LayoutType,
  Project,
  GeneratedImage,
} from '@/lib/types';
import { DEFAULT_VARIATIONS, DEFAULT_TEMPLATE_SETTINGS } from '@/lib/defaults';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export function useProject() {
  const [variations, setVariations] = useState<Variation[]>(() =>
    DEFAULT_VARIATIONS.map((v, i) => ({ ...v, sort_order: i }))
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [layout, setLayout] = useState<LayoutType>('classic');
  const [templateSettings, setTemplateSettings] = useState<TemplateSettings>({
    ...DEFAULT_TEMPLATE_SETTINGS,
  });
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabaseReady = isSupabaseConfigured();

  // ---- Variation CRUD ----

  const addVariation = useCallback(() => {
    setVariations((prev) => {
      const next = [
        ...prev,
        {
          headline: 'New Headline Here',
          subtext: 'Add your subtext here.',
          sort_order: prev.length,
        },
      ];
      setActiveIndex(next.length - 1);
      return next;
    });
  }, []);

  const updateVariation = useCallback(
    (index: number, headline: string, subtext: string) => {
      setVariations((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], headline, subtext };
        return next;
      });
    },
    []
  );

  const removeVariation = useCallback(
    (index: number) => {
      setVariations((prev) => {
        if (prev.length <= 1) return prev;
        const next = prev.filter((_, i) => i !== index);
        setActiveIndex((ai) => {
          if (ai >= next.length) return next.length - 1;
          if (ai > index) return ai - 1;
          return ai;
        });
        return next;
      });
    },
    []
  );

  const bulkImport = useCallback((data: Array<{ headline: string; subtext?: string }>) => {
    const valid = data.filter((d) => d.headline && typeof d.headline === 'string');
    if (valid.length === 0) return;
    setVariations((prev) => {
      const startIdx = prev.length;
      const next = [
        ...prev,
        ...valid.map((item, i) => ({
          headline: item.headline,
          subtext: item.subtext || '',
          sort_order: startIdx + i,
        })),
      ];
      setActiveIndex(startIdx);
      return next;
    });
  }, []);

  // ---- Smart Generator: Replace / Append variations ----

  const replaceVariations = useCallback(
    (data: Array<{ headline: string; subtext: string }>) => {
      const valid = data.filter(
        (d) => d.headline && typeof d.headline === 'string'
      );
      if (valid.length === 0) return;
      setVariations(
        valid.map((item, i) => ({
          headline: item.headline,
          subtext: item.subtext || '',
          sort_order: i,
        }))
      );
      setActiveIndex(0);
    },
    []
  );

  const appendVariations = useCallback(
    (data: Array<{ headline: string; subtext: string }>) => {
      const valid = data.filter(
        (d) => d.headline && typeof d.headline === 'string'
      );
      if (valid.length === 0) return;
      setVariations((prev) => {
        const startIdx = prev.length;
        const next = [
          ...prev,
          ...valid.map((item, i) => ({
            headline: item.headline,
            subtext: item.subtext || '',
            sort_order: startIdx + i,
          })),
        ];
        setActiveIndex(startIdx);
        return next;
      });
    },
    []
  );

  // ---- Template Settings ----

  const updateSettings = useCallback(
    (partial: Partial<TemplateSettings>) => {
      setTemplateSettings((prev) => ({ ...prev, ...partial }));
    },
    []
  );

  // ---- Supabase Project CRUD ----

  const fetchProjects = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    setLoading(true);
    try {
      const { data, error } = await sb
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProject = useCallback(
    async (name?: string) => {
      const sb = getSupabase();
      if (!sb) return;
      setSaving(true);
      try {
        const projectData = {
          name: name || currentProject?.name || 'Untitled Project',
          template_settings: templateSettings,
          layout,
          updated_at: new Date().toISOString(),
        };

        let projectId = currentProject?.id;

        if (projectId) {
          // Update existing
          const { error } = await sb
            .from('projects')
            .update(projectData)
            .eq('id', projectId);
          if (error) throw error;
        } else {
          // Create new
          const { data, error } = await sb
            .from('projects')
            .insert(projectData)
            .select()
            .single();
          if (error) throw error;
          projectId = data.id;
          setCurrentProject(data);
        }

        // Save variations
        if (projectId) {
          // Delete old variations
          await sb.from('ad_variations').delete().eq('project_id', projectId);
          // Insert new
          const variationsData = variations.map((v, i) => ({
            project_id: projectId,
            headline: v.headline,
            subtext: v.subtext,
            sort_order: i,
          }));
          const { error: varError } = await sb
            .from('ad_variations')
            .insert(variationsData);
          if (varError) throw varError;
        }

        await fetchProjects();
      } catch (err) {
        console.error('Failed to save project:', err);
      } finally {
        setSaving(false);
      }
    },
    [currentProject, templateSettings, layout, variations, fetchProjects]
  );

  const loadProject = useCallback(
    async (projectId: string) => {
      const sb = getSupabase();
      if (!sb) return;
      setLoading(true);
      try {
        // Fetch project
        const { data: project, error: projError } = await sb
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        if (projError) throw projError;

        // Fetch variations
        const { data: vars, error: varError } = await sb
          .from('ad_variations')
          .select('*')
          .eq('project_id', projectId)
          .order('sort_order', { ascending: true });
        if (varError) throw varError;

        // Fetch generated images
        const { data: images, error: imgError } = await sb
          .from('generated_images')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
        if (imgError) throw imgError;

        setCurrentProject(project);
        setLayout(project.layout || 'classic');
        setTemplateSettings({
          ...DEFAULT_TEMPLATE_SETTINGS,
          ...project.template_settings,
        });
        if (vars && vars.length > 0) {
          setVariations(
            vars.map((v: any) => ({
              id: v.id,
              headline: v.headline,
              subtext: v.subtext,
              sort_order: v.sort_order,
            }))
          );
        } else {
          setVariations([
            { headline: 'New Headline Here', subtext: 'Add your subtext here.', sort_order: 0 },
          ]);
        }
        setActiveIndex(0);
        setGeneratedImages(images || []);
      } catch (err) {
        console.error('Failed to load project:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const newProject = useCallback(() => {
    setCurrentProject(null);
    setVariations(DEFAULT_VARIATIONS.map((v, i) => ({ ...v, sort_order: i })));
    setTemplateSettings({ ...DEFAULT_TEMPLATE_SETTINGS });
    setLayout('classic');
    setActiveIndex(0);
    setGeneratedImages([]);
  }, []);

  // ---- AI Image ----

  const saveGeneratedImage = useCallback(
    async (image: GeneratedImage) => {
      setGeneratedImages((prev) => [image, ...prev]);
      const sb = getSupabase();
      if (!sb || !currentProject?.id) return;
      try {
        await sb.from('generated_images').insert({
          project_id: currentProject.id,
          prompt: image.prompt,
          image_url: image.image_url,
          image_type: image.image_type,
        });
      } catch (err) {
        console.error('Failed to save generated image:', err);
      }
    },
    [currentProject]
  );

  return {
    // State
    variations,
    activeIndex,
    layout,
    templateSettings,
    currentProject,
    projects,
    generatedImages,
    saving,
    loading,
    supabaseReady,

    // Variation actions
    setActiveIndex,
    addVariation,
    updateVariation,
    removeVariation,
    bulkImport,

    // Smart Generator actions
    replaceVariations,
    appendVariations,

    // Settings actions
    setLayout,
    updateSettings,

    // Project actions
    fetchProjects,
    saveProject,
    loadProject,
    newProject,

    // AI Image
    saveGeneratedImage,
  };
}
