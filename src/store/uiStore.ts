import { create } from 'zustand';

interface UiState {
  /** Zoom del preview. `null` = usar el preset por dispositivo (35/60/80%). */
  zoom: number | null;
  activeSectionId: string | null;
  showThemePanel: boolean;
  showAtsPanel: boolean;
  showPreviewMobile: boolean;
  setZoom: (zoom: number) => void;
  setActiveSectionId: (id: string | null) => void;
  setShowThemePanel: (show: boolean) => void;
  setShowAtsPanel: (show: boolean) => void;
  setShowPreviewMobile: (show: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  zoom: null,
  activeSectionId: null,
  showThemePanel: false,
  showAtsPanel: false,
  showPreviewMobile: false,
  setZoom: (zoom) => set({ zoom }),
  setActiveSectionId: (activeSectionId) => set({ activeSectionId }),
  setShowThemePanel: (showThemePanel) => set({ showThemePanel }),
  setShowAtsPanel: (showAtsPanel) => set({ showAtsPanel }),
  setShowPreviewMobile: (showPreviewMobile) => set({ showPreviewMobile }),
}));
