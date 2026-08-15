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

/** CV comercial de ejemplo, replicado del template de candela-app
 *  (cv-comercial-ventas-stock.html). Entra en UNA hoja A4 con tema compacto. */
export function createCommercialSampleResume(): Resume {
  const work: WorkItem[] = [
    {
      id: uid(),
      position: 'Vendedora y asistente comercial',
      company: 'Angelicos Regalería y Sublimación',
      location: '',
      start: d(2021, 1),
      end: d(2024, 2),
      current: false,
      summary: '',
      highlights: [
        'Asesoré a clientes en la selección de regalos y productos personalizados, logrando cierres alineados a necesidades y presupuesto.',
        'Gestioné reposición y control de stock, manteniendo la oferta actualizada según la demanda y la temporada.',
        'Organicé el mostrador y la vidriera, resaltando productos de mayor rotación para impulsar ventas.',
      ],
    },
    {
      id: uid(),
      position: 'Atención al cliente, gestión de stock y redes sociales',
      company: 'Origami Librería',
      location: '',
      start: d(2024, 11),
      end: d(2025, 8),
      current: false,
      summary: '',
      highlights: [
        'Brindé atención al cliente en librería, recomendando productos escolares, de oficina y regalos con foco en la venta.',
        'Controlé y repondí stock de mercadería, manteniendo el orden del local y disponibilidad de alta rotación.',
        'Gestioné redes sociales para difundir productos y sostener la comunicación con la clientela, derivando consultas a la venta.',
      ],
    },
    {
      id: uid(),
      position: 'Emprendedora y responsable de operaciones',
      company: 'Chocobajonero',
      location: '',
      start: d(2023, 12),
      end: d(2025, 8),
      current: false,
      summary: 'En pausa por mudanza a Córdoba Capital.',
      highlights: [
        'Llevé adelante la venta directa y por redes, gestionando la cartera de clientes y el seguimiento de cada pedido hasta la entrega.',
        'Organicé la producción y el stock de insumos para sostener la operación diaria, cumpliendo con la demanda en fechas pico.',
        'Definí precios, promociones y combos según margen y estacionalidad, ajustando la oferta para sostener las ventas.',
      ],
    },
    {
      id: uid(),
      position: 'Atención al cliente y control de stock',
      company: "MOE'S Bebidas",
      location: '',
      start: d(2019, 8),
      end: d(2020, 2),
      current: false,
      summary: '',
      highlights: [
        'Atendí clientes en vinoteca, recomendando productos y cerrando ventas con asesoramiento personalizado.',
        'Gestioné la reposición y el control de mercadería, asegurando disponibilidad y exhibiciones atractivas en góndola.',
      ],
    },
  ];

  const education: EducationItem[] = [
    {
      id: uid(),
      degree: 'Bachiller en Economía y Administración',
      institution: 'IPEM 273 Manuel Belgrano',
      location: '',
      start: d(2015),
      end: d(2021),
      current: false,
      description: '',
    },
    {
      id: uid(),
      degree: 'Tecnicatura Superior en Diseño de Espacios',
      institution: 'ESBA – Roberto Viola',
      location: '',
      start: d(2025),
      end: null,
      current: true,
      description: 'En curso.',
    },
    {
      id: uid(),
      degree: 'Introducción a la Programación Web',
      institution: 'UNLaR – Universidad Nacional de La Rioja',
      location: '',
      start: d(2024, 9),
      end: null,
      current: false,
      description: '',
    },
    {
      id: uid(),
      degree: 'Inglés Inicial',
      institution: 'Portal de Capacitación Integral de la Provincia',
      location: '',
      start: d(2023, 3),
      end: null,
      current: false,
      description: '',
    },
  ];

  const skills: SkillGroup[] = [
    {
      id: uid(),
      name: '',
      keywords: [
        'Ventas y asesoramiento comercial',
        'Cierre de ventas y postventa',
        'Control de stock e inventario',
        'Reposición de mercadería',
        'Organización del punto de venta',
        'Atención al cliente',
        'Manejo de caja y registro de ventas',
        'Comunicación efectiva',
      ],
    },
  ];

  const languages: LanguageItem[] = [
    { id: uid(), language: 'Español', level: 'Nativo' },
    { id: uid(), language: 'Inglés', level: 'Inicial (A2)' },
  ];

  return {
    id: uid(),
    documentName: 'CV Comercial de ejemplo',
    updatedAt: now(),
    templateId: 'modern',
    // Tema compacto + títulos subrayados: replica la densidad y el estilo del template de Candela.
    theme: { ...DEFAULT_THEME, baseFontSize: 10, headingScale: 1.1, spacing: 'compact', headerStyle: 'underline' },
    sections: [
      {
        id: uid(),
        type: 'basics',
        title: 'Datos personales',
        visible: true,
        fields: {
          name: 'Candela González',
          label: 'Vendedora · Asistente Comercial · Control de Stock',
          email: 'gcande720@gmail.com',
          phone: '(3549) 559939',
          location: 'Córdoba Capital – Zona General Paz',
          linkedin: '',
          website: '',
          photo: null,
        },
      },
      {
        id: uid(),
        type: 'summary',
        title: 'Perfil profesional',
        visible: true,
        text:
          'Vendedora con experiencia en comercio físico, asesoramiento comercial y control de inventario. Manejo el ciclo completo de venta: detección de necesidades, recomendación, cierre y postventa. Cuento con sólida experiencia en control de stock, reposición de mercadería y organización del punto de venta. Me mudé recientemente a Córdoba Capital por decisión personal, cuento con disponibilidad inmediata y no tengo inconvenientes de relocalización.',
      },
      { id: uid(), type: 'experience', title: 'Experiencia laboral', visible: true, items: work },
      { id: uid(), type: 'education', title: 'Formación', visible: true, items: education },
      { id: uid(), type: 'skills', title: 'Competencias', visible: true, groups: skills },
      { id: uid(), type: 'languages', title: 'Idiomas', visible: true, items: languages },
    ],
  };
}
