import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCommercialSampleResume, createResume, createSampleResume } from '../data/defaults';
import { uid } from '../lib/id';
import type { Resume, Section } from '../types/resume';
import type { ThemeConfig } from '../types/theme';

const now = () => new Date().toISOString();

interface ResumeStore {
  resumes: Resume[];
  activeResumeId: string | null;
  /** True cuando ya se sembró el CV de ejemplo en la primera visita. */
  seeded: boolean;
  /** True una vez que el preset comercial (Candela) existe/ya se sembró. */
  commercialSeeded: boolean;
  /** Versión de los presets sembrados: si el sample guardado es viejo, se regenera. */
  presetsVersion: number;
  addResume: (name?: string) => string;
  addSampleResume: () => string;
  addCommercialSampleResume: () => string;
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
      commercialSeeded: false,
      presetsVersion: 0,

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

      addCommercialSampleResume: () => {
        const resume = createCommercialSampleResume();
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
        commercialSeeded: state.commercialSeeded,
        presetsVersion: state.presetsVersion,
      }),
    },
  ),
);

export function selectResume(resumes: Resume[], id: string | null): Resume | undefined {
  return resumes.find((r) => r.id === id);
}

/**
 * Migración idempotente del estado local. Se llama en cada montaje; si no hay
 * nada que cambiar, no toca el estado.
 * 1) Deduplica "Mi CV de ejemplo" (el bug de StrictMode en dev sembraba 2 idénticos).
 * 2) Usuario nuevo → siembra los dos presets (básico + comercial Candela).
 * 3) Usuarios existentes → agrega el preset comercial UNA sola vez (flag
 *    `commercialSeeded`). Si lo borran a propósito, no vuelve a aparecer.
 */
export function ensurePresets() {
  // Bump cuando cambies createSampleResume()/createCommercialSampleResume():
  // los usuarios con el preset viejo guardado lo regeneran al recargar.
  const PRESETS_VERSION = 4;
  const { resumes, activeResumeId, seeded, commercialSeeded, presetsVersion } = useResumeStore.getState();
  let next: Resume[] = resumes;
  let changed = false;
  let nextCommercialSeeded = commercialSeeded;

  // 1) Regenerar los presets si la versión guardada es vieja.
  if (presetsVersion < PRESETS_VERSION) {
    const sampleIdx = next.findIndex((r) => r.documentName === 'Mi CV de ejemplo');
    if (sampleIdx >= 0) {
      next = [...next.slice(0, sampleIdx), createSampleResume(), ...next.slice(sampleIdx + 1)];
      changed = true;
    }
    const commercialIdx = next.findIndex((r) => r.documentName === 'CV Comercial de ejemplo');
    if (commercialIdx >= 0) {
      next = [...next.slice(0, commercialIdx), createCommercialSampleResume(), ...next.slice(commercialIdx + 1)];
      changed = true;
    }
  }

  // 1b) Safety net: si el comercial guarda datos personales reales (Candela),
  //     se reemplaza por el de datos ficticios. Idempotente.
  {
    const commercialIdx = next.findIndex((r) => r.documentName === 'CV Comercial de ejemplo');
    if (commercialIdx >= 0) {
      const basics = next[commercialIdx].sections.find((s) => s.type === 'basics');
      const email =
        basics && 'fields' in basics ? ((basics.fields as { email?: string }).email ?? '') : '';
      if (email === 'gcande720@gmail.com') {
        next = [...next.slice(0, commercialIdx), createCommercialSampleResume(), ...next.slice(commercialIdx + 1)];
        changed = true;
      }
    }
  }

  // 2) Dedupe: quita el "Mi CV de ejemplo" duplicado por el bug de StrictMode.
  const seen = new Set<string>();
  const deduped: Resume[] = [];
  for (const r of next) {
    if (r.documentName === 'Mi CV de ejemplo' && seen.has('Mi CV de ejemplo')) continue;
    seen.add(r.documentName);
    deduped.push(r);
  }
  if (deduped.length !== next.length) {
    next = deduped;
    changed = true;
  }

  // 3) Usuario nuevo: sembrar los dos presets.
  if (next.length === 0 && !seeded) {
    next = [createSampleResume(), createCommercialSampleResume()];
    nextCommercialSeeded = true;
    changed = true;
  } else if (!seeded && next.length > 0) {
    // 3a) Migración: cuenta con CVs guardados de antes de los presets.
    if (!next.some((r) => r.documentName === 'Mi CV de ejemplo')) {
      next = [...next, createSampleResume()];
      changed = true;
    }
    if (!next.some((r) => r.documentName === 'CV Comercial de ejemplo')) {
      next = [...next, createCommercialSampleResume()];
      nextCommercialSeeded = true;
      changed = true;
    }
  } else if (seeded && !commercialSeeded && !next.some((r) => r.documentName === 'CV Comercial de ejemplo')) {
    // 3b) Migración puntual: el preset de Candela llega a cuentas existentes (una sola vez).
    next = [...next, createCommercialSampleResume()];
    nextCommercialSeeded = true;
    changed = true;
  }

  // Si el comercial ya existe (lo crearon o lo cargaron), dejar de intentar sembrarlo.
  if (next.some((r) => r.documentName === 'CV Comercial de ejemplo')) nextCommercialSeeded = true;

  if (!changed && nextCommercialSeeded === commercialSeeded) return;
  const activeOk = next.some((r) => r.id === activeResumeId);
  useResumeStore.setState({
    resumes: next,
    activeResumeId: activeOk ? activeResumeId : next[0]?.id ?? null,
    seeded: true,
    commercialSeeded: nextCommercialSeeded,
    presetsVersion: PRESETS_VERSION,
  });
}
