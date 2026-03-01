// ============================================
// AdForge — Export Utilities
// ============================================

import { Variation, TemplateSettings, LayoutType } from './types';

/** Escape HTML special characters */
export function escHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Wrap the first word in a colored span for thumbnails */
export function highlightFirst(html: string, color: string): string {
  return html.replace(/^(\S+)/, `<span style="color:${color}">$1</span>`);
}

/** Get CSS background string from template settings */
export function getBgCSS(settings: TemplateSettings): string {
  const { bgStyle, bgColor, bgImageUrl, gradColor1, gradColor2, gradDirection } = settings;
  let css = `background: ${bgColor};`;
  if (bgStyle === 'gradient') {
    css = `background: linear-gradient(${gradDirection}, ${gradColor1}, ${gradColor2});`;
  } else if (bgStyle === 'pattern') {
    css = `background: ${bgColor}; background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 24px 24px;`;
  }
  if (bgImageUrl) {
    css += ` background-image: url('${bgImageUrl}'); background-size: cover; background-position: center;`;
  }
  return css;
}

/**
 * Build the inline-styled HTML for a single ad variation at 1080x1080.
 * Used by AdPreview (scaled) and useExport (full-size render).
 */
export function buildAdHTML(
  variation: Variation,
  settings: TemplateSettings,
  layout: LayoutType,
  scale: number = 1
): string {
  const {
    bgStyle,
    bgColor,
    bgImageUrl,
    gradColor1,
    gradColor2,
    gradDirection,
    accentColor,
    textColor,
    fontFamily,
    headlineSize,
    subtextSize,
    padding,
    logoUrl,
    logoPosition,
    ctaText,
    ctaVisible,
    textPositionX,
    textPositionY,
    verticalAlign,
  } = settings;

  // Background
  let bgCSS = `background: ${bgColor};`;
  if (bgStyle === 'gradient') {
    bgCSS = `background: linear-gradient(${gradDirection}, ${gradColor1}, ${gradColor2});`;
  } else if (bgStyle === 'pattern') {
    bgCSS = `background: ${bgColor}; background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 24px 24px;`;
  }

  if (bgImageUrl) {
    bgCSS += ` background-image: url('${bgImageUrl}'); background-size: cover; background-position: center;`;
  }

  // Vertical alignment
  const alignMap: Record<string, string> = {
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end',
  };
  const justifyContent = alignMap[verticalAlign] || 'center';

  // Logo
  let logoHTML = '';
  if (logoUrl) {
    const logoStyles: Record<string, string> = {
      'bottom-left': `left: ${padding}px; bottom: ${padding}px;`,
      'bottom-center': `left: 50%; bottom: ${padding}px; transform: translateX(-50%);`,
      'bottom-right': `right: ${padding}px; bottom: ${padding}px;`,
    };
    logoHTML = `<img src="${logoUrl}" alt="Logo" style="position: absolute; ${logoStyles[logoPosition] || logoStyles['bottom-left']} height: 40px; max-width: 140px; object-fit: contain;" />`;
  }

  // CTA button
  let ctaHTML = '';
  if (ctaVisible && ctaText) {
    ctaHTML = `<div style="margin-top: 28px;"><span style="display: inline-block; padding: 14px 36px; background: ${accentColor}; color: #fff; font-size: 18px; font-weight: 700; border-radius: 8px; letter-spacing: 0.02em;">${ctaText}</span></div>`;
  }

  // Layout-specific content
  let contentHTML = '';

  switch (layout) {
    case 'bold':
      contentHTML = `
        <div style="text-transform: uppercase; letter-spacing: 0.05em;">
          <div style="font-size: ${headlineSize * 1.1}px; font-weight: 900; color: ${textColor}; line-height: 1.05; margin-bottom: 16px;">${variation.headline}</div>
          <div style="font-size: ${subtextSize}px; color: ${textColor}; opacity: 0.85; line-height: 1.4;">${variation.subtext}</div>
        </div>
      `;
      break;

    case 'centered':
      contentHTML = `
        <div style="text-align: center;">
          <div style="font-size: ${headlineSize}px; font-weight: 800; color: ${textColor}; line-height: 1.1; margin-bottom: 16px;">${variation.headline}</div>
          <div style="font-size: ${subtextSize}px; color: ${textColor}; opacity: 0.8; line-height: 1.5; max-width: 80%; margin: 0 auto;">${variation.subtext}</div>
          ${ctaHTML ? `<div style="text-align: center; margin-top: 28px;"><span style="display: inline-block; padding: 14px 36px; background: ${accentColor}; color: #fff; font-size: 18px; font-weight: 700; border-radius: 8px;">${ctaText}</span></div>` : ''}
        </div>
      `;
      // CTA already inlined for centered layout
      ctaHTML = '';
      break;

    case 'features':
    case 'benefits':
      const bullets = variation.bulletPoints || [];
      const bulletItems = bullets
        .map(
          (bp) =>
            `<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;"><span style="width: 8px; height: 8px; border-radius: 50%; background: ${accentColor}; flex-shrink: 0;"></span><span style="font-size: ${subtextSize * 0.9}px; color: ${textColor}; opacity: 0.85;">${bp}</span></div>`
        )
        .join('');
      contentHTML = `
        <div>
          <div style="font-size: ${headlineSize}px; font-weight: 800; color: ${textColor}; line-height: 1.1; margin-bottom: 20px;">${variation.headline}</div>
          ${bulletItems || `<div style="font-size: ${subtextSize}px; color: ${textColor}; opacity: 0.8; line-height: 1.5;">${variation.subtext}</div>`}
        </div>
      `;
      break;

    case 'testimonial':
      contentHTML = `
        <div>
          <div style="font-size: 72px; color: ${accentColor}; line-height: 1; margin-bottom: 8px;">&ldquo;</div>
          <div style="font-size: ${headlineSize * 0.75}px; font-weight: 600; color: ${textColor}; line-height: 1.3; font-style: italic; margin-bottom: 20px;">${variation.headline}</div>
          <div style="font-size: ${subtextSize * 0.9}px; color: ${textColor}; opacity: 0.7;">
            ${variation.testimonialAuthor ? `&mdash; ${variation.testimonialAuthor}` : ''}
            ${variation.testimonialRole ? `, ${variation.testimonialRole}` : ''}
          </div>
        </div>
      `;
      break;

    case 'before-after':
      contentHTML = `
        <div>
          <div style="display: flex; gap: 24px; margin-bottom: 20px;">
            <div style="flex: 1;">
              <div style="font-size: 14px; font-weight: 700; color: ${accentColor}; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">Before</div>
              <div style="font-size: ${subtextSize * 0.9}px; color: ${textColor}; opacity: 0.7; line-height: 1.4;">${variation.beforeText || 'The old way'}</div>
            </div>
            <div style="width: 2px; background: ${accentColor}; opacity: 0.3;"></div>
            <div style="flex: 1;">
              <div style="font-size: 14px; font-weight: 700; color: ${accentColor}; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">After</div>
              <div style="font-size: ${subtextSize * 0.9}px; color: ${textColor}; opacity: 0.7; line-height: 1.4;">${variation.afterText || 'The new way'}</div>
            </div>
          </div>
          <div style="font-size: ${headlineSize * 0.85}px; font-weight: 800; color: ${textColor}; line-height: 1.1;">${variation.headline}</div>
        </div>
      `;
      break;

    case 'stats':
      contentHTML = `
        <div style="text-align: center;">
          <div style="font-size: ${headlineSize * 1.5}px; font-weight: 900; color: ${accentColor}; line-height: 1;">${variation.statNumber || '97%'}</div>
          <div style="font-size: ${subtextSize}px; color: ${textColor}; opacity: 0.7; margin-top: 8px; margin-bottom: 24px;">${variation.statLabel || variation.subtext}</div>
          <div style="font-size: ${headlineSize * 0.7}px; font-weight: 700; color: ${textColor}; line-height: 1.2;">${variation.headline}</div>
        </div>
      `;
      break;

    case 'listicle':
      const listItems = variation.bulletPoints || [];
      const listHTML = listItems
        .map(
          (item, idx) =>
            `<div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;"><span style="width: 28px; height: 28px; border-radius: 50%; background: ${accentColor}; color: #fff; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${idx + 1}</span><span style="font-size: ${subtextSize * 0.9}px; color: ${textColor}; opacity: 0.85; padding-top: 4px;">${item}</span></div>`
        )
        .join('');
      contentHTML = `
        <div>
          <div style="font-size: ${headlineSize * 0.85}px; font-weight: 800; color: ${textColor}; line-height: 1.1; margin-bottom: 24px;">${variation.headline}</div>
          ${listHTML || `<div style="font-size: ${subtextSize}px; color: ${textColor}; opacity: 0.8; line-height: 1.5;">${variation.subtext}</div>`}
        </div>
      `;
      break;

    default: // 'classic'
      contentHTML = `
        <div>
          <div style="font-size: ${headlineSize}px; font-weight: 800; color: ${textColor}; line-height: 1.1; margin-bottom: 16px;">${variation.headline}</div>
          <div style="font-size: ${subtextSize}px; color: ${textColor}; opacity: 0.8; line-height: 1.5;">${variation.subtext}</div>
        </div>
      `;
      break;
  }

  const width = 1080;
  const height = 1080;

  return `<div style="width: ${width}px; height: ${height}px; ${bgCSS} position: relative; display: flex; flex-direction: column; justify-content: ${justifyContent}; padding: ${padding}px; box-sizing: border-box; font-family: ${fontFamily}; overflow: hidden; transform: scale(${scale}); transform-origin: top left;">
    <div style="transform: translate(${textPositionX}px, ${textPositionY}px);">
      ${contentHTML}
      ${ctaHTML}
    </div>
    ${logoHTML}
  </div>`;
}
