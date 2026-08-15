import { create } from 'zustand';

export type View = { name: 'list' } | { name: 'builder' };

interface UiState {
  view: View;
  /** Zoom del preview. `null` = usar el preset por dispositivo (35/60/80%). */
  zoom: number | null;
  activeSectionId: string | null;
  showThemePanel: boolean;
  showAtsPanel: boolean;
  showPreviewMobile: boolean;
  setView: (view: View) => void;
  setZoom: (zoom: number) => void;
  setActiveSectionId: (id: string | null) => void;
  setShowThemePanel: (show: boolean) => void;
  setShowAtsPanel: (show: boolean) => void;
  setShowPreviewMobile: (show: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  view: { name: 'list' },
  zoom: null,
  activeSectionId: null,
  showThemePanel: false,
  showAtsPanel: false,
  showPreviewMobile: false,
  // Navegar cierra los paneles flotantes (Tema / ATS) para que no queden colgados.
  setView: (view) => set({ view, showThemePanel: false, showAtsPanel: false }),
  setZoom: (zoom) => set({ zoom }),
  setActiveSectionId: (activeSectionId) => set({ activeSectionId }),
  setShowThemePanel: (showThemePanel) => set({ showThemePanel }),
  setShowAtsPanel: (showAtsPanel) => set({ showAtsPanel }),
  setShowPreviewMobile: (showPreviewMobile) => set({ showPreviewMobile }),
}));
