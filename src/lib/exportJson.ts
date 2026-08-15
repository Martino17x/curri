import { DEFAULT_THEME, createResume } from '../data/defaults';
import { uid } from './id';
import { slugify } from './exportPdf';
import type { DateRef, Resume, Section } from '../types/resume';

/* eslint-disable @typescript-eslint/no-explicit-any */

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportJsonResume(resume: Resume) {
  downloadJson(`curri-${slugify(resume.documentName)}.json`, resume);
}

function dateRef(value: unknown): DateRef | null {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4})(?:-(\d{2}))?/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  if (!year) return null;
  const month = match[2] ? Number(match[2]) : undefined;
  return { year, month: month && month >= 1 && month <= 12 ? month : undefined };
}

function normalizeNative(json: any): Resume {
  return {
    id: typeof json.id === 'string' ? json.id : uid(),
    documentName: typeof json.documentName === 'string' ? json.documentName : 'CV importado',
    updatedAt: new Date().toISOString(),
    templateId: json.templateId === 'classic' || json.templateId === 'minimal' ? json.templateId : 'modern',
    theme: { ...DEFAULT_THEME, ...(json.theme ?? {}) },
    sections: Array.isArray(json.sections) ? json.sections : [],
  };
}

export function fromJsonResume(json: any): Resume {
  const resume = createResume('CV importado');
  const basics = json.basics ?? {};
  const basicsSec = resume.sections.find((s): s is Extract<Section, { type: 'basics' }> => s.type === 'basics');
  const summarySec = resume.sections.find((s): s is Extract<Section, { type: 'summary' }> => s.type === 'summary');
  const expSec = resume.sections.find((s): s is Extract<Section, { type: 'experience' }> => s.type === 'experience');
  const eduSec = resume.sections.find((s): s is Extract<Section, { type: 'education' }> => s.type === 'education');
  const skillSec = resume.sections.find((s): s is Extract<Section, { type: 'skills' }> => s.type === 'skills');
  const langSec = resume.sections.find((s): s is Extract<Section, { type: 'languages' }> => s.type === 'languages');
  const projSec = resume.sections.find((s): s is Extract<Section, { type: 'projects' }> => s.type === 'projects');
  const certSec = resume.sections.find((s): s is Extract<Section, { type: 'certificates' }> => s.type === 'certificates');

  if (basicsSec) {
    basicsSec.fields = {
      name: basics.name ?? '',
      label: basics.label ?? '',
      email: basics.email ?? '',
      phone: basics.phone ?? '',
      location: [basics.location?.city, basics.location?.region, basics.location?.address]
        .filter(Boolean)
        .join(', '),
      linkedin: (basics.profiles ?? []).find((p: any) => /linkedin/i.test(p?.network ?? ''))?.url ?? '',
      website: basics.url ?? '',
      photo: basics.image || null,
    };
  }
  if (summarySec) summarySec.text = basics.summary ?? '';

  if (expSec && Array.isArray(json.work)) {
    expSec.items = json.work.map((w: any) => ({
      id: uid(),
      position: w.position ?? '',
      company: w.name ?? '',
      location: '',
      start: dateRef(w.startDate),
      end: dateRef(w.endDate),
      current: Boolean(!w.endDate),
      summary: w.summary ?? '',
      highlights: Array.isArray(w.highlights) ? w.highlights : [],
    }));
  }

  if (eduSec && Array.isArray(json.education)) {
    eduSec.items = json.education.map((e: any) => ({
      id: uid(),
      degree: e.area ?? e.studyType ?? '',
      institution: e.institution ?? '',
      location: '',
      start: dateRef(e.startDate),
      end: dateRef(e.endDate),
      current: Boolean(!e.endDate),
      description: e.description ?? '',
    }));
  }

  if (skillSec && Array.isArray(json.skills)) {
    skillSec.groups = json.skills.map((s: any) => ({
      id: uid(),
      name: s.name ?? '',
      keywords: Array.isArray(s.keywords) ? s.keywords : [],
    }));
  }

  if (langSec && Array.isArray(json.languages)) {
    langSec.items = json.languages.map((l: any) => ({
      id: uid(),
      language: l.language ?? '',
      level: l.fluency ?? '',
    }));
  }

  if (projSec && Array.isArray(json.projects)) {
    projSec.items = json.projects.map((p: any) => ({
      id: uid(),
      name: p.name ?? '',
      url: p.url ?? '',
      start: dateRef(p.startDate),
      end: dateRef(p.endDate),
      current: Boolean(!p.endDate),
      summary: p.description ?? '',
      highlights: Array.isArray(p.highlights) ? p.highlights : [],
    }));
  }

  if (certSec && Array.isArray(json.certificates)) {
    certSec.items = json.certificates.map((c: any) => ({
      id: uid(),
      name: c.name ?? '',
      issuer: c.issuer ?? '',
      date: typeof c.date === 'string' ? c.date.slice(0, 7) : '',
    }));
  }

  return resume;
}

export async function importResumeFile(file: File): Promise<Resume> {
  const text = await file.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error('El archivo no es un JSON válido.');
  }
  if (Array.isArray(json?.sections)) return normalizeNative(json);
  if (json?.basics || json?.work || json?.education || json?.skills) return fromJsonResume(json);
  throw new Error('El archivo no parece un CV válido (formato Curri o JSON Resume).');
}
