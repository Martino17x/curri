import { FONTS, FONT_IDS } from '../../lib/fonts';
import { useResumeStore } from '../../store/resumeStore';
import { useUiStore } from '../../store/uiStore';
import type { Resume } from '../../types/resume';
import type { FontId, HeaderStyle, SpacingPreset } from '../../types/theme';
import { ToggleField } from '../editor/fields';
import { XIcon } from '../ui/icons';

export function ThemePanel({ resume }: { resume: Resume }) {
  const updateTheme = useResumeStore((s) => s.updateTheme);
  const setShowThemePanel = useUiStore((s) => s.setShowThemePanel);
  const t = resume.theme;
  const set = (patch: Partial<typeof t>) => updateTheme(resume.id, (th) => ({ ...th, ...patch }));

  return (
    <aside className="drawer">
      <div className="drawer-head">
        <h2>Tema</h2>
        <button type="button" className="btn-icon" onClick={() => setShowThemePanel(false)}>
          <XIcon />
        </button>
      </div>
      <div className="form">
        <label className="field">
          <span className="field-label">Color de acento</span>
          <div className="color-row">
            <input
              type="color"
              value={t.accentColor}
              onChange={(e) => set({ accentColor: e.target.value })}
              aria-label="Color de acento"
            />
            <span className="color-hex">{t.accentColor}</span>
          </div>
        </label>

        <label className="field">
          <span className="field-label">Tipografía (ATS-safe)</span>
          <select value={t.fontFamily} onChange={(e) => set({ fontFamily: e.target.value as FontId })}>
            {FONT_IDS.map((id) => (
              <option key={id} value={id}>
                {FONTS[id].label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Tamaño base: {t.baseFontSize}pt</span>
          <input
            type="range"
            min={10}
            max={12}
            step={0.5}
            value={t.baseFontSize}
            onChange={(e) => set({ baseFontSize: Number(e.target.value) })}
          />
        </label>

        <label className="field">
          <span className="field-label">Escala de títulos: ×{t.headingScale.toFixed(2)}</span>
          <input
            type="range"
            min={1.2}
            max={1.6}
            step={0.05}
            value={t.headingScale}
            onChange={(e) => set({ headingScale: Number(e.target.value) })}
          />
        </label>

        <label className="field">
          <span className="field-label">Espaciado</span>
          <select value={t.spacing} onChange={(e) => set({ spacing: e.target.value as SpacingPreset })}>
            <option value="compact">Compacto</option>
            <option value="comfortable">Cómodo</option>
            <option value="relaxed">Espaciado</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">Estilo de títulos</span>
          <select value={t.headerStyle} onChange={(e) => set({ headerStyle: e.target.value as HeaderStyle })}>
            <option value="accent-bar">Barra de acento</option>
            <option value="underline">Subrayado</option>
            <option value="simple">Simple</option>
          </select>
        </label>

        <ToggleField
          label="Nombre en mayúsculas"
          checked={t.nameUppercase}
          onChange={(nameUppercase) => set({ nameUppercase })}
        />
        <ToggleField
          label="Etiquetas de contacto (Email:, Tel:)"
          checked={t.contactLabels}
          onChange={(contactLabels) => set({ contactLabels })}
        />
        <p className="field-help">Etiquetas de texto: compatibles con el ATS (los iconos gráficos no lo son).</p>
      </div>
    </aside>
  );
}
