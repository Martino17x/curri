import { uid } from '../lib/id';
import type {
  CertificateItem,
  DateRef,
  EducationItem,
  LanguageItem,
  ProjectItem,
  Resume,
  Section,
  SectionType,
  SkillGroup,
  WorkItem,
} from '../types/resume';
import type { SpacingPreset, ThemeConfig } from '../types/theme';

export const DEFAULT_THEME: ThemeConfig = {
  accentColor: '#1e3a5f',
  fontFamily: 'helvetica',
  baseFontSize: 10,
  headingScale: 1.25,
  spacing: 'comfortable',
  headerStyle: 'accent-bar',
  nameUppercase: true,
  contactLabels: false,
};

export const SPACING_PX: Record<SpacingPreset, number> = {
  compact: 5,
  comfortable: 8,
  relaxed: 12,
};

const now = () => new Date().toISOString();

export function basicsSection(): Section {
  return {
    id: uid(),
    type: 'basics',
    title: 'Datos personales',
    visible: true,
    fields: {
      name: '',
      label: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      photo: null,
    },
  };
}

export function summarySection(): Section {
  return { id: uid(), type: 'summary', title: 'Resumen profesional', visible: true, text: '' };
}

export function experienceSection(): Section {
  return { id: uid(), type: 'experience', title: 'Experiencia laboral', visible: true, items: [] };
}

export function educationSection(): Section {
  return { id: uid(), type: 'education', title: 'Educación', visible: true, items: [] };
}

export function skillsSection(): Section {
  return { id: uid(), type: 'skills', title: 'Habilidades', visible: true, groups: [] };
}

export function languagesSection(): Section {
  return { id: uid(), type: 'languages', title: 'Idiomas', visible: true, items: [] };
}

export function projectsSection(): Section {
  return { id: uid(), type: 'projects', title: 'Proyectos', visible: true, items: [] };
}

export function certificatesSection(): Section {
  return { id: uid(), type: 'certificates', title: 'Certificaciones', visible: true, items: [] };
}

export function interestsSection(): Section {
  return { id: uid(), type: 'interests', title: 'Intereses', visible: true, items: [] };
}

export function customSection(): Section {
  return { id: uid(), type: 'custom', title: 'Sección personalizada', visible: true, items: [] };
}

export function createSection(type: SectionType): Section {
  switch (type) {
    case 'basics':
      return basicsSection();
    case 'summary':
      return summarySection();
    case 'experience':
      return experienceSection();
    case 'education':
      return educationSection();
    case 'skills':
      return skillsSection();
    case 'languages':
      return languagesSection();
    case 'projects':
      return projectsSection();
    case 'certificates':
      return certificatesSection();
    case 'interests':
      return interestsSection();
    case 'custom':
      return customSection();
  }
}

export function createResume(documentName: string): Resume {
  return {
    id: uid(),
    documentName,
    updatedAt: now(),
    templateId: 'modern',
    theme: { ...DEFAULT_THEME },
    sections: [
      basicsSection(),
      summarySection(),
      experienceSection(),
      educationSection(),
      skillsSection(),
      languagesSection(),
      projectsSection(),
      certificatesSection(),
      interestsSection(),
    ],
  };
}

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  basics: 'Datos personales',
  summary: 'Resumen profesional',
  experience: 'Experiencia laboral',
  education: 'Educación',
  skills: 'Habilidades',
  languages: 'Idiomas',
  projects: 'Proyectos',
  certificates: 'Certificaciones',
  interests: 'Intereses',
  custom: 'Sección personalizada',
};

export const SECTION_TYPE_ORDER: SectionType[] = [
  'basics',
  'summary',
  'experience',
  'education',
  'skills',
  'languages',
  'projects',
  'certificates',
  'interests',
  'custom',
];

const d = (year: number, month?: number): DateRef => ({ year, month });

/** CV de ejemplo que demuestra todos los tipos de sección. */
export function createSampleResume(): Resume {
  const work: WorkItem[] = [
    {
      id: uid(),
      position: 'Desarrolladora Frontend',
      company: 'Nubel S.A.',
      location: 'Córdoba, Argentina',
      start: d(2024, 3),
      end: null,
      current: true,
      summary: 'Mantenimiento y desarrollo de una plataforma web de facturación para +2.000 pymes.',
      highlights: [
        'Migré el dashboard principal de JavaScript a React + TypeScript, reduciendo errores en runtime un 40%.',
        'Implementé diseño responsive y accesibilidad (WCAG AA) en módulos de alta demanda.',
      ],
    },
    {
      id: uid(),
      position: 'Desarrolladora Web Trainee',
      company: 'Estudio Digital Pixel',
      location: 'Córdoba, Argentina',
      start: d(2023, 2),
      end: d(2024, 2),
      current: false,
      summary: 'Desarrollo de landing pages y tiendas en línea para clientes locales.',
      highlights: [
        'Maqueté 15+ sitios con HTML, CSS y JavaScript vanilla, optimizados para SEO.',
      ],
    },
  ];

  const education: EducationItem[] = [
    {
      id: uid(),
      degree: 'Técnico Universitario en Programación',
      institution: 'Universidad Tecnológica Nacional',
      location: 'Córdoba, Argentina',
      start: d(2022, 3),
      end: d(2025, 12),
      current: false,
      description: 'Orientación en desarrollo web.',
    },
    {
      id: uid(),
      degree: 'Curso de React y TypeScript',
      institution: 'Plataforma online',
      start: d(2024, 1),
      end: d(2024, 6),
      current: false,
      description: '60 horas: React, hooks y TypeScript.',
    },
  ];

  const skills: SkillGroup[] = [
    {
      id: uid(),
      name: 'Frontend',
      keywords: ['React', 'TypeScript', 'HTML', 'CSS'],
    },
    {
      id: uid(),
      name: 'Backend y datos',
      keywords: ['Node.js', 'PostgreSQL', 'REST'],
    },
    {
      id: uid(),
      name: 'Herramientas',
      keywords: ['Git', 'Figma', 'Jest'],
    },
  ];

  const languages: LanguageItem[] = [
    { id: uid(), language: 'Español', level: 'Nativo' },
    { id: uid(), language: 'Inglés', level: 'Intermedio (B1)' },
  ];

  const projects: ProjectItem[] = [
    {
      id: uid(),
      name: 'Curri — editor de CV',
      url: 'https://github.com/martino/curri',
      start: d(2026, 8),
      end: null,
      current: true,
      summary: 'Editor de currículums 100% client-side con plantillas ATS-safe.',
      highlights: [
        'Exportación de PDF con texto seleccionable (ATS friendly).',
      ],
    },
  ];

  const certificates: CertificateItem[] = [
    {
      id: uid(),
      name: 'Fundamentos de AWS Cloud',
      issuer: 'AWS Academy',
      date: '2025-05',
    },
  ];

  return {
    id: uid(),
    documentName: 'Mi CV de ejemplo',
    updatedAt: now(),
    templateId: 'modern',
    // Tema compacto a propósito: el ejemplo debe entrar en UNA hoja A4.
    theme: { ...DEFAULT_THEME, baseFontSize: 10, spacing: 'compact' },
    sections: [
      {
        id: uid(),
        type: 'basics',
        title: 'Datos personales',
        visible: true,
        fields: {
          name: 'Sofía Herrera',
          label: 'Desarrolladora Frontend',
          email: 'sofia.herrera@email.com',
          phone: '(351) 555-1234',
          location: 'Córdoba, Argentina',
          linkedin: 'linkedin.com/in/sofiaherrera',
          website: 'sofiaherrera.dev',
          photo: null,
        },
      },
      {
        id: uid(),
        type: 'summary',
        title: 'Resumen profesional',
        visible: true,
        text:
          'Desarrolladora frontend con 2 años de experiencia en aplicaciones web con React y TypeScript. Me especializo en interfaces accesibles y código limpio.',
      },
      { id: uid(), type: 'experience', title: 'Experiencia laboral', visible: true, items: work },
      { id: uid(), type: 'education', title: 'Educación', visible: true, items: education },
      { id: uid(), type: 'skills', title: 'Habilidades', visible: true, groups: skills },
      { id: uid(), type: 'languages', title: 'Idiomas', visible: true, items: languages },
      { id: uid(), type: 'projects', title: 'Proyectos', visible: true, items: projects },
      { id: uid(), type: 'certificates', title: 'Certificaciones', visible: true, items: certificates },
      { id: uid(), type: 'interests', title: 'Intereses', visible: true, items: ['Ajedrez', 'Open Source', 'Música'] },
    ],
  };
}
