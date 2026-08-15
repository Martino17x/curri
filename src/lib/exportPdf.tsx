import { createRoot, type Root } from 'react-dom/client';
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
 * Documento HTML standalone con el CV renderizado (lo usa el smoke test SSR).
 * El PDF de la app se genera con exportPdf() desde el documento principal.
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

interface PdfCallbacks {
  onDone?: () => void;
  onError?: (err: unknown) => void;
}

let printRootEl: HTMLDivElement | null = null;
let printReactRoot: Root | null = null;

function ensurePrintRoot(): Root {
  if (!printRootEl || !document.body.contains(printRootEl)) {
    printRootEl = document.createElement('div');
    printRootEl.id = 'print-root';
    document.body.appendChild(printRootEl);
    printReactRoot = createRoot(printRootEl);
  }
  return printReactRoot as Root;
}

function teardownPrintRoot() {
  try {
    printReactRoot?.unmount();
  } catch {
    /* noop */
  }
  printReactRoot = null;
  printRootEl?.remove();
  printRootEl = null;
}

/**
 * Exporta el PDF imprimiendo el documento principal: renderiza el CV en
 * #print-root (visible solo en @media print) y llama window.print().
 * Más confiable que el iframe oculto en browsers embebidos.
 */
export function exportPdf(resume: Resume, callbacks?: PdfCallbacks) {
  try {
    const root = ensurePrintRoot();
    root.render(
      <div className="doc-page">
        <TemplateRenderer resume={resume} />
      </div>,
    );
    setTimeout(() => {
      try {
        window.focus();
        window.print();
      } catch (err) {
        callbacks?.onError?.(err);
      } finally {
        teardownPrintRoot();
        callbacks?.onDone?.();
      }
    }, 60);
  } catch (err) {
    teardownPrintRoot();
    callbacks?.onError?.(err);
    callbacks?.onDone?.();
  }
}
