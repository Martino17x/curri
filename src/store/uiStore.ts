import { create } from 'zustand';

export type View = { name: 'list' } | { name: 'builder' };

interface UiState {
  view: View;
  /** Zoom del preview. `null` = auto (ajustar el documento completo al área visible). */
  zoom: number | null;
  activeSectionId: string | null;
  showThemePanel: boolean;
  showAtsPanel: boolean;
  showPreviewMobile: boolean;
  setView: (view: View) => void;
  setZoom: (zoom: number) => void;
  setZoomFit: () => void;
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
  setView: (view) => set({ view }),
  setZoom: (zoom) => set({ zoom }),
  setZoomFit: () => set({ zoom: null }),
  setActiveSectionId: (activeSectionId) => set({ activeSectionId }),
  setShowThemePanel: (showThemePanel) => set({ showThemePanel }),
  setShowAtsPanel: (showAtsPanel) => set({ showAtsPanel }),
  setShowPreviewMobile: (showPreviewMobile) => set({ showPreviewMobile }),
}));
