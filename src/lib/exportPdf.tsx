import { renderToStaticMarkup } from 'react-dom/server';
import { TemplateRenderer } from '../components/preview/TemplateRenderer';
import type { Resume } from '../types/resume';
import templatesCssRaw from '../styles/templates.css?raw';

const PRINT_EXTRA_CSS = `
@page { size: A4; margin: 0; }
html, body { margin: 0; padding: 0; background: #fff !important; }
`;

export function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'cv';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Documento HTML standalone con el CV renderizado. El texto es seleccionable,
 * por lo que el PDF generado se parsea bien en los ATS.
 */
export function buildStandaloneHtml(resume: Resume): string {
  const body = renderToStaticMarkup(<TemplateRenderer resume={resume} />);
  return [
    '<!DOCTYPE html>',
    '<html lang="es"><head><meta charset="UTF-8" />',
    `<title>${escapeHtml(resume.documentName)}</title>`,
    `<style>${templatesCssRaw}</style>`,
    `<style>${PRINT_EXTRA_CSS}</style>`,
    '</head><body>',
    `<div class="doc-page">${body}</div>`,
    '</body></html>',
  ].join('');
}

export function exportPdf(resume: Resume) {
  const html = buildStandaloneHtml(resume);
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const cleanup = () => {
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
  };

  iframe.onload = () => {
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error('No se pudo abrir el diálogo de impresión', err);
        cleanup();
      }
      setTimeout(cleanup, 1000);
    }, 250);
  };

  const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
  } else {
    cleanup();
  }
}
