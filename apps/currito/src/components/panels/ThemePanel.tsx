import { FONTS, FONT_IDS } from '../../lib/fonts';
import { useResumeStore } from '../../store/resumeStore';
import { useUiStore } from '../../store/uiStore';
import type { Resume } from '../../types/resume';
import { ToggleField } from '../editor/fields';
import { Select } from '../ui/Select';
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
          <Select
            options={FONT_IDS.map((id) => ({ value: id, label: FONTS[id].label }))}
            value={t.fontFamily}
            onChange={(fontFamily) => set({ fontFamily })}
            ariaLabel="Tipografía"
          />
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
          <Select
            options={[
              { value: 'compact', label: 'Compacto' },
              { value: 'comfortable', label: 'Cómodo' },
              { value: 'relaxed', label: 'Espaciado' },
            ]}
            value={t.spacing}
            onChange={(spacing) => set({ spacing })}
            ariaLabel="Espaciado"
          />
        </label>

        <label className="field">
          <span className="field-label">Estilo de títulos</span>
          <Select
            options={[
              { value: 'accent-bar', label: 'Barra de acento' },
              { value: 'underline', label: 'Subrayado' },
              { value: 'simple', label: 'Simple' },
            ]}
            value={t.headerStyle}
            onChange={(headerStyle) => set({ headerStyle })}
            ariaLabel="Estilo de títulos"
          />
        </label>

        <label className="field">
          <span className="field-label">Columnas</span>
          <Select
            options={[
              { value: '1', label: '1 columna' },
              { value: '2', label: '2 columnas' },
            ]}
            value={String(t.columns)}
            onChange={(v) => set({ columns: v === '2' ? 2 : 1 })}
            ariaLabel="Columnas"
          />
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
