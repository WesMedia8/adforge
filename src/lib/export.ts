import { Project } from './types';
import JSZip from 'jszip';

export async function exportProject(
  project: Project,
  format: 'csv' | 'json' | 'zip'
): Promise<void> {
  switch (format) {
    case 'csv':
      exportAsCSV(project);
      break;
    case 'json':
      exportAsJSON(project);
      break;
    case 'zip':
      await exportAsZip(project);
      break;
  }
}

function exportAsCSV(project: Project): void {
  const headers = ['Headline', 'Body', 'CTA', 'Description', 'Framework', 'Angle', 'Score'];
  const rows = project.ads.map(ad => [
    `"${ad.headline.replace(/"/g, '""')}"`,
    `"${ad.body.replace(/"/g, '""')}"`,
    `"${ad.cta.replace(/"/g, '""')}"`,
    `"${(ad.description || '').replace(/"/g, '""')}"`,
    `"${ad.framework}"`,
    `"${ad.angle}"`,
    ad.score || '',
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  downloadFile(csvContent, `adforge-${project.businessName}-ads.csv`, 'text/csv');
}

function exportAsJSON(project: Project): void {
  const exportData = {
    businessName: project.businessName,
    exportDate: new Date().toISOString(),
    ads: project.ads,
    research: project.research,
  };

  downloadFile(
    JSON.stringify(exportData, null, 2),
    `adforge-${project.businessName}-ads.json`,
    'application/json'
  );
}

async function exportAsZip(project: Project): Promise<void> {
  const zip = new JSZip();

  // Add ads JSON
  zip.file('ads.json', JSON.stringify(project.ads, null, 2));

  // Add research JSON
  if (project.research) {
    zip.file('research.json', JSON.stringify(project.research, null, 2));
  }

  // Add CSV
  const headers = ['Headline', 'Body', 'CTA', 'Description', 'Framework', 'Angle'];
  const rows = project.ads.map(ad => [
    ad.headline, ad.body, ad.cta, ad.description || '', ad.framework, ad.angle
  ]);
  const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
  zip.file('ads.csv', csvContent);

  // Generate and download zip
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `adforge-${project.businessName}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
