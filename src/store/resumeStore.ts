import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createResume, createSampleResume } from '../data/defaults';
import { uid } from '../lib/id';
import type { Resume, Section } from '../types/resume';
import type { ThemeConfig } from '../types/theme';

const now = () => new Date().toISOString();

interface ResumeStore {
  resumes: Resume[];
  activeResumeId: string | null;
  /** True cuando ya se sembró el CV de ejemplo en la primera visita. */
  seeded: boolean;
  addResume: (name?: string) => string;
  addSampleResume: () => string;
  duplicateResume: (id: string) => string;
  deleteResume: (id: string) => void;
  setActiveResume: (id: string | null) => void;
  renameResume: (id: string, name: string) => void;
  setTemplate: (id: string, templateId: Resume['templateId']) => void;
  updateTheme: (id: string, updater: (t: ThemeConfig) => ThemeConfig) => void;
  addSection: (id: string, section: Section) => void;
  removeSection: (id: string, sectionId: string) => void;
  toggleSectionVisible: (id: string, sectionId: string) => void;
  renameSection: (id: string, sectionId: string, title: string) => void;
  reorderSections: (id: string, from: number, to: number) => void;
  updateSection: (id: string, sectionId: string, updater: (s: Section) => Section) => void;
  importResume: (resume: Resume) => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumes: [],
      activeResumeId: null,
      seeded: false,

      addResume: (name) => {
        const resume = createResume(name || 'CV nuevo');
        set((state) => ({
          resumes: [...state.resumes, resume],
          activeResumeId: resume.id,
        }));
        return resume.id;
      },

      addSampleResume: () => {
        const resume = createSampleResume();
        set((state) => ({
          resumes: [...state.resumes, resume],
          activeResumeId: resume.id,
          seeded: true,
        }));
        return resume.id;
      },

      duplicateResume: (id) => {
        const source = get().resumes.find((r) => r.id === id);
        if (!source) return '';
        const copy: Resume = {
          ...structuredClone(source),
          id: uid(),
          documentName: `${source.documentName} (copia)`,
          updatedAt: now(),
        };
        set((state) => ({
          resumes: [...state.resumes, copy],
          activeResumeId: copy.id,
        }));
        return copy.id;
      },

      deleteResume: (id) => {
        set((state) => {
          const resumes = state.resumes.filter((r) => r.id !== id);
          const activeResumeId =
            state.activeResumeId === id ? resumes[resumes.length - 1]?.id ?? null : state.activeResumeId;
          return { resumes, activeResumeId };
        });
      },

      setActiveResume: (id) => set({ activeResumeId: id }),

      renameResume: (id, name) =>
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id ? { ...r, documentName: name, updatedAt: now() } : r,
          ),
        })),

      setTemplate: (id, templateId) =>
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id ? { ...r, templateId, updatedAt: now() } : r,
          ),
        })),

      updateTheme: (id, updater) =>
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id ? { ...r, theme: updater(r.theme), updatedAt: now() } : r,
          ),
        })),

      addSection: (id, section) =>
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id ? { ...r, sections: [...r.sections, section], updatedAt: now() } : r,
          ),
        })),

      removeSection: (id, sectionId) =>
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id
              ? { ...r, sections: r.sections.filter((s) => s.id !== sectionId), updatedAt: now() }
              : r,
          ),
        })),

      toggleSectionVisible: (id, sectionId) =>
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id
              ? {
                  ...r,
                  updatedAt: now(),
                  sections: r.sections.map((s) =>
                    s.id === sectionId ? { ...s, visible: !s.visible } : s,
                  ),
                }
              : r,
          ),
        })),

      renameSection: (id, sectionId, title) =>
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id
              ? {
                  ...r,
                  updatedAt: now(),
                  sections: r.sections.map((s) => (s.id === sectionId ? { ...s, title } : s)),
                }
              : r,
          ),
        })),

      reorderSections: (id, from, to) =>
        set((state) => ({
          resumes: state.resumes.map((r) => {
            if (r.id !== id) return r;
            const sections = [...r.sections];
            const [moved] = sections.splice(from, 1);
            sections.splice(to, 0, moved);
            return { ...r, updatedAt: now(), sections };
          }),
        })),

      updateSection: (id, sectionId, updater) =>
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id
              ? {
                  ...r,
                  updatedAt: now(),
                  sections: r.sections.map((s) => (s.id === sectionId ? updater(s) : s)),
                }
              : r,
          ),
        })),

      importResume: (resume) =>
        set((state) => ({
          resumes: [...state.resumes, resume],
          activeResumeId: resume.id,
        })),
    }),
    {
      name: 'curri:resumes:v1',
      version: 1,
      partialize: (state) => ({
        resumes: state.resumes,
        activeResumeId: state.activeResumeId,
        seeded: state.seeded,
      }),
    },
  ),
);

export function selectResume(resumes: Resume[], id: string | null): Resume | undefined {
  return resumes.find((r) => r.id === id);
}
