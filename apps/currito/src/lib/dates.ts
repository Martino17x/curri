import type { DateRef } from '../types/resume';

export const MESES_CORTO = [
  '',
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

export function monthLabel(month: number | undefined): string {
  if (!month || month < 1 || month > 12) return '';
  return MESES_CORTO[month];
}

export function formatDateRef(ref: DateRef | null | undefined): string {
  if (!ref) return '';
  const m = ref.month ? `${monthLabel(ref.month)} ` : '';
  return `${m}${ref.year}`;
}

export function formatRange(
  start: DateRef | null | undefined,
  end: DateRef | null | undefined,
  current: boolean,
): string {
  const s = formatDateRef(start);
  if (current) return s ? `${s} – Presente` : 'Presente';
  const e = formatDateRef(end);
  if (s && e) return `${s} – ${e}`;
  // Fecha única (curso, certificación): mostrar solo el inicio.
  return s || e;
}

export function formatDateRefToJson(ref: DateRef | null | undefined): string {
  if (!ref) return '';
  const m = ref.month ? String(ref.month).padStart(2, '0') : '01';
  return `${ref.year}-${m}-01`;
}

/** Valida una fecha en formato YYYY o YYYY-MM (vacía = ok). */
export function isValidDateString(value: string): boolean {
  if (!value) return true;
  return /^\d{4}(-\d{2})?$/.test(value);
}
