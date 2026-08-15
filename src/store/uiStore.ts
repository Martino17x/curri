import { create } from 'zustand';

export type View = { name: 'list' } | { name: 'builder' };

interface UiState {
  view: View;
  zoom: number;
  activeSectionId: string | null;
  showThemePanel: boolean;
  showAtsPanel: boolean;
  setView: (view: View) => void;
  setZoom: (zoom: number) => void;
  setActiveSectionId: (id: string | null) => void;
  setShowThemePanel: (show: boolean) => void;
  setShowAtsPanel: (show: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  view: { name: 'list' },
  zoom: 1,
  activeSectionId: null,
  showThemePanel: false,
  showAtsPanel: false,
  setView: (view) => set({ view }),
  setZoom: (zoom) => set({ zoom }),
  setActiveSectionId: (activeSectionId) => set({ activeSectionId }),
  setShowThemePanel: (showThemePanel) => set({ showThemePanel }),
  setShowAtsPanel: (showAtsPanel) => set({ showAtsPanel }),
}));
