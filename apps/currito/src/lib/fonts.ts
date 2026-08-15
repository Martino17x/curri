import type { FontId } from '../types/theme';

export interface FontMeta {
  label: string;
  css: string;
  /** Fuentes que los ATS reconocen sin fallback (según guías 2026). */
  safe: boolean;
}

export const FONTS: Record<FontId, FontMeta> = {
  helvetica: {
    label: 'Helvetica',
    css: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    safe: true,
  },
  arial: {
    label: 'Arial',
    css: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
    safe: true,
  },
  calibri: {
    label: 'Calibri',
    css: "Calibri, 'Segoe UI', Arial, sans-serif",
    safe: true,
  },
  roboto: {
    label: 'Roboto',
    css: "Roboto, Arial, sans-serif",
    safe: true,
  },
  opensans: {
    label: 'Open Sans',
    css: "'Open Sans', Arial, sans-serif",
    safe: true,
  },
  verdana: {
    label: 'Verdana',
    css: "Verdana, Geneva, sans-serif",
    safe: true,
  },
  georgia: {
    label: 'Georgia',
    css: "Georgia, 'Times New Roman', serif",
    safe: true,
  },
  times: {
    label: 'Times New Roman',
    css: "'Times New Roman', Times, serif",
    safe: true,
  },
};

export const FONT_IDS = Object.keys(FONTS) as FontId[];
