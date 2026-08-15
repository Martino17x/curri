import type { CSSProperties, ReactNode } from 'react';
import { SPACING_PX } from '../../data/defaults';
import { formatRange } from '../../lib/dates';
import { FONTS } from '../../lib/fonts';
import type { BasicsSection, DateRef } from '../../types/resume';
import type { HeaderStyle, ThemeConfig } from '../../types/theme';

/** Variables CSS del documento, derivadas del tema. Cambiar el tema = cambiar estos datos. */
export function docVars(theme: ThemeConfig): CSSProperties {
  const lineHeight = theme.spacing === 'compact' ? 1.22 : theme.spacing === 'comfortable' ? 1.38 : 1.5;
  const padY = theme.spacing === 'compact' ? '9mm' : theme.spacing === 'comfortable' ? '11mm' : '14mm';
  const padX = theme.spacing === 'compact' ? '11mm' : theme.spacing === 'comfortable' ? '13mm' : '16mm';
  return {
    '--doc-font': FONTS[theme.fontFamily].css,
    '--doc-accent': theme.accentColor,
    '--doc-text': '#1f2430',
    '--doc-muted': '#5b6270',
    '--doc-base-pt': `${theme.baseFontSize}pt`,
    '--doc-heading-pt': `${theme.baseFontSize * theme.headingScale}pt`,
    '--doc-name-pt': `${theme.baseFontSize * theme.headingScale * 1.35}pt`,
    '--doc-line-height': String(lineHeight),
    '--doc-spacing': `${SPACING_PX[theme.spacing]}pt`,
    '--doc-pad-y': padY,
    '--doc-pad-x': padX,
  } as CSSProperties;
}

export function SectionTitle({ children, style }: { children: ReactNode; style: HeaderStyle }) {
  if (style === 'underline') {
    return <h2 className="sec-title sec-title--underline">{children}</h2>;
  }
  if (style === 'simple') {
    return <h2 className="sec-title sec-title--simple">{children}</h2>;
  }
  return (
    <h2 className="sec-title sec-title--bar">
      <span>{children}</span>
    </h2>
  );
}

export function DateRange({
  start,
  end,
  current,
}: {
  start?: DateRef | null;
  end?: DateRef | null;
  current?: boolean;
}) {
  const text = formatRange(start ?? null, end ?? null, Boolean(current));
  if (!text) return null;
  return <span className="date-range">{text}</span>;
}

export function Bullets({ items }: { items: string[] }) {
  const filtered = items.map((i) => i.trim()).filter(Boolean);
  if (!filtered.length) return null;
  return (
    <ul className="bullets">
      {filtered.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function InlineList({ items, sep = ' · ' }: { items: string[]; sep?: string }) {
  const filtered = items.map((i) => i.trim()).filter(Boolean);
  if (!filtered.length) return null;
  return <p className="inline-list">{filtered.join(sep)}</p>;
}

export function TextValue({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="text-value">{children}</p>;
}

/** Línea de contacto en el cuerpo de la página 1 (regla ATS: nada en header/footer). */
export function ContactLine({ basics, theme }: { basics?: BasicsSection; theme: ThemeConfig }) {
  if (!basics) return null;
  const f = basics.fields;
  const parts: string[] = [];
  if (f.location.trim()) parts.push(theme.contactLabels ? `Ubicación: ${f.location.trim()}` : f.location.trim());
  if (f.email.trim()) parts.push(theme.contactLabels ? `Email: ${f.email.trim()}` : f.email.trim());
  if (f.phone.trim()) parts.push(theme.contactLabels ? `Tel: ${f.phone.trim()}` : f.phone.trim());
  if (f.linkedin.trim()) parts.push(theme.contactLabels ? `LinkedIn: ${f.linkedin.trim()}` : f.linkedin.trim());
  if (f.website.trim()) parts.push(theme.contactLabels ? `Web: ${f.website.trim()}` : f.website.trim());
  if (!parts.length) return null;
  return <p className="contact-line">{parts.join(' · ')}</p>;
}
