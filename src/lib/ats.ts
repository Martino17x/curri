import type { Resume, Section } from '../types/resume';
import { isValidDateString } from './dates';
import { FONTS } from './fonts';

export type AtsSeverity = 'error' | 'warning' | 'info';
export type AtsRuleId =
  | 'dates'
  | 'headers'
  | 'contact'
  | 'icons'
  | 'fonts'
  | 'empty-section'
  | 'single-page';

export interface AtsIssue {
  id: string;
  rule: AtsRuleId;
  severity: AtsSeverity;
  sectionId?: string;
  message: string;
}

const STANDARD_HEADERS: Record<string, string[]> = {
  summary: ['resumen profesional', 'resumen', 'perfil profesional', 'perfil', 'profile', 'summary', 'about me'],
  experience: ['experiencia laboral', 'experiencia', 'trabajo', 'experience', 'work experience', 'professional experience'],
  education: ['educación', 'educacion', 'formación académica', 'formacion', 'education', 'academic background'],
  skills: ['habilidades', 'skills', 'competencias', 'competencias técnicas', 'tecnologías', 'tecnologias', 'aptitudes'],
  languages: ['idiomas', 'languages'],
  projects: ['proyectos', 'projects'],
  certificates: ['certificaciones', 'certificados', 'cursos', 'certificates', 'certifications'],
  interests: ['intereses', 'interests'],
};

const HEADER_RULE_LABEL: Record<string, string> = {
  summary: 'Resumen',
  experience: 'Experiencia',
  education: 'Educación',
  skills: 'Habilidades',
  languages: 'Idiomas',
  projects: 'Proyectos',
  certificates: 'Certificaciones',
  interests: 'Intereses',
};

let counter = 0;
const issue = (rule: AtsRuleId, severity: AtsSeverity, message: string, sectionId?: string): AtsIssue => ({
  id: `ats-${rule}-${counter++}`,
  rule,
  severity,
  message,
  sectionId,
});

function hasContent(section: Section): boolean {
  switch (section.type) {
    case 'summary':
      return section.text.trim().length > 0;
    case 'experience':
      return section.items.length > 0;
    case 'education':
      return section.items.length > 0;
    case 'skills':
      return section.groups.some((g) => g.name.trim() || g.keywords.length > 0);
    case 'languages':
      return section.items.length > 0;
    case 'projects':
      return section.items.length > 0;
    case 'certificates':
      return section.items.length > 0;
    case 'interests':
      return section.items.length > 0;
    case 'custom':
      return section.items.length > 0;
    case 'basics':
      return true;
  }
}

/** Validación ATS pura, sin DOM. Las reglas de página se agregan aparte. */
export function checkAts(resume: Resume): AtsIssue[] {
  counter = 0;
  const out: AtsIssue[] = [];
  const basics = resume.sections.find((s): s is Extract<Section, { type: 'basics' }> => s.type === 'basics');

  // Regla: contacto completo
  if (basics) {
    if (!basics.fields.name.trim()) {
      out.push(issue('contact', 'error', 'Falta el nombre completo en los datos personales.'));
    }
    if (!basics.fields.email.trim()) {
      out.push(issue('contact', 'warning', 'Falta el email: el ATS necesita un canal de contacto.', basics.id));
    }
    if (!basics.fields.phone.trim()) {
      out.push(issue('contact', 'warning', 'Falta el teléfono.', basics.id));
    }
  } else {
    out.push(issue('contact', 'error', 'No hay sección de datos personales.'));
  }

  // Regla: iconos (las etiquetas de texto son ATS-safe; los iconos gráficos no lo son).
  if (resume.theme.contactLabels) {
    out.push(issue('icons', 'info', 'Etiquetas de contacto activas: el texto plano es compatible con el ATS.'));
  }

  // Regla: fuentes
  const fontMeta = FONTS[resume.theme.fontFamily];
  if (!fontMeta?.safe) {
    out.push(issue('fonts', 'warning', 'La fuente elegida no está en la lista ATS-safe.'));
  }

  for (const section of resume.sections) {
    if (!section.visible) continue;

    // Regla: headers estándar
    if (section.type !== 'basics' && section.type !== 'custom') {
      const accepted = STANDARD_HEADERS[section.type];
      const normalized = section.title.trim().toLowerCase();
      if (accepted && !accepted.includes(normalized)) {
        out.push(
          issue(
            'headers',
            'warning',
            `El header "${section.title}" no es estándar. Usá por ejemplo "${HEADER_RULE_LABEL[section.type]}". El parser puede ignorar esa sección.`,
            section.id,
          ),
        );
      }
    }

    // Regla: fechas
    if (section.type === 'experience') {
      for (const item of section.items) {
        if (item.position || item.company) {
          if (!item.start) {
            out.push(
              issue('dates', 'warning', `Falta la fecha de inicio en "${item.position || item.company}".`, section.id),
            );
          }
          if (item.start && item.end && !item.current) {
            const s = item.start;
            const e = item.end;
            if (e.year < s.year || (e.year === s.year && (e.month ?? 1) < (s.month ?? 1))) {
              out.push(
                issue('dates', 'error', `El rango de fechas en "${item.position}" está invertido.`, section.id),
              );
            }
          }
        }
      }
    }

    if (section.type === 'education') {
      for (const item of section.items) {
        if (item.start && item.end && !item.current) {
          const s = item.start;
          const e = item.end;
          if (e.year < s.year || (e.year === s.year && (e.month ?? 1) < (s.month ?? 1))) {
            out.push(
              issue('dates', 'error', `El rango de fechas en "${item.institution}" está invertido.`, section.id),
            );
          }
        }
      }
    }

    if (section.type === 'certificates') {
      for (const item of section.items) {
        if (!isValidDateString(item.date)) {
          out.push(
            issue('dates', 'error', `La fecha "${item.date}" no usa el formato YYYY-MM.`, section.id),
          );
        }
      }
    }

    // Regla: sección vacía
    if (!hasContent(section) && section.type !== 'basics') {
      out.push(issue('empty-section', 'info', `La sección "${section.title}" está vacía y visible.`, section.id));
    }
  }

  return out;
}

export const SEVERITY_LABEL: Record<AtsSeverity, string> = {
  error: 'Error',
  warning: 'Advertencia',
  info: 'Info',
};
