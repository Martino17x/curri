import { useResumeStore } from '../../store/resumeStore';
import { useUiStore } from '../../store/uiStore';
import type { TemplateId } from '../../types/resume';
import { Select } from '../ui/Select';

const TEMPLATE_OPTIONS: { value: TemplateId; label: string }[] = [
  { value: 'modern', label: 'Moderna' },
  { value: 'classic', label: 'Clásica' },
  { value: 'minimal', label: 'Mínima' },
];

export function Header({ resume }: { resume?: { id: string; documentName: string; templateId: TemplateId } }) {
  const resumes = useResumeStore((s) => s.resumes);
  const setActiveResume = useResumeStore((s) => s.setActiveResume);
  const renameResume = useResumeStore((s) => s.renameResume);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setView = useUiStore((s) => s.setView);
  const setShowThemePanel = useUiStore((s) => s.setShowThemePanel);
  const setShowAtsPanel = useUiStore((s) => s.setShowAtsPanel);
  const setShowPreviewMobile = useUiStore((s) => s.setShowPreviewMobile);

  return (
    <header className="app-header">
      <div className="header-brand">
        <button type="button" className="logo" onClick={() => setView({ name: 'list' })} title="Volver a tus CVs">
          Curri
        </button>
      </div>

      {resume && (
        <>
          <span className="header-sep" aria-hidden="true" />

          <div className="doc-controls">
            <Select
              className="select--sm"
              options={resumes.map((r) => ({ value: r.id, label: r.documentName || 'Sin nombre' }))}
              value={resume.id}
              onChange={setActiveResume}
              ariaLabel="Elegí otro CV"
            />
            <input
              className="doc-name-input"
              value={resume.documentName}
              onChange={(e) => renameResume(resume.id, e.target.value)}
              aria-label="Nombre del documento"
              placeholder="Nombre del CV"
            />
          </div>

          <span className="header-sep" aria-hidden="true" />

          <div className="header-actions">
            <Select
              className="select--sm select--template"
              options={TEMPLATE_OPTIONS}
              value={resume.templateId}
              onChange={(v) => setTemplate(resume.id, v as TemplateId)}
              ariaLabel="Plantilla"
              placeholder="Plantilla"
            />
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowThemePanel(true);
                setShowPreviewMobile(true);
              }}
            >
              Tema
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowAtsPanel(true);
                setShowPreviewMobile(true);
              }}
            >
              ATS
            </button>
          </div>
        </>
      )}
    </header>
  );
}
