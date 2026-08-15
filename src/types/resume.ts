import type { ThemeConfig } from './theme';

export type SectionType =
  | 'basics'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'projects'
  | 'certificates'
  | 'interests'
  | 'custom';

export interface SectionBase {
  id: string;
  title: string;
  visible: boolean;
}

/** Fecha estructurada. Mes opcional, año obligatorio (formato ATS-safe MM/YYYY). */
export interface DateRef {
  month?: number; // 1-12
  year: number;
}

export interface BasicsSection extends SectionBase {
  type: 'basics';
  fields: {
    name: string;
    label: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    photo: string | null; // dataURL
  };
}

export interface SummarySection extends SectionBase {
  type: 'summary';
  text: string;
}

export interface WorkItem {
  id: string;
  position: string;
  company: string;
  location?: string;
  start: DateRef | null;
  end: DateRef | null;
  current: boolean;
  summary: string;
  highlights: string[];
}

export interface ExperienceSection extends SectionBase {
  type: 'experience';
  items: WorkItem[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  start: DateRef | null;
  end: DateRef | null;
  current: boolean;
  description: string;
}

export interface EducationSection extends SectionBase {
  type: 'education';
  items: EducationItem[];
}

export interface SkillGroup {
  id: string;
  name: string;
  keywords: string[];
}

export interface SkillsSection extends SectionBase {
  type: 'skills';
  groups: SkillGroup[];
}

export interface LanguageItem {
  id: string;
  language: string;
  level: string;
}

export interface LanguagesSection extends SectionBase {
  type: 'languages';
  items: LanguageItem[];
}

export interface ProjectItem {
  id: string;
  name: string;
  url?: string;
  start: DateRef | null;
  end: DateRef | null;
  current: boolean;
  summary: string;
  highlights: string[];
}

export interface ProjectsSection extends SectionBase {
  type: 'projects';
  items: ProjectItem[];
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  /** Formato YYYY-MM (o vacío). */
  date: string;
}

export interface CertificatesSection extends SectionBase {
  type: 'certificates';
  items: CertificateItem[];
}

export interface InterestsSection extends SectionBase {
  type: 'interests';
  items: string[];
}

export interface CustomItem {
  id: string;
  heading: string;
  value: string;
  url?: string;
}

export interface CustomSection extends SectionBase {
  type: 'custom';
  items: CustomItem[];
}

export type Section =
  | BasicsSection
  | SummarySection
  | ExperienceSection
  | EducationSection
  | SkillsSection
  | LanguagesSection
  | ProjectsSection
  | CertificatesSection
  | InterestsSection
  | CustomSection;

export type TemplateId = 'modern' | 'classic' | 'minimal';

export interface Resume {
  id: string;
  documentName: string;
  updatedAt: string;
  templateId: TemplateId;
  theme: ThemeConfig;
  sections: Section[];
}
