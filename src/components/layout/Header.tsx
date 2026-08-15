import { useResumeStore } from '../../store/resumeStore';
import { useUiStore } from '../../store/uiStore';
import type { TemplateId } from '../../types/resume';

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
      <button type="button" className="logo" onClick={() => setView({ name: 'list' })}>
        Curri
      </button>

      {resume && (
        <>
          <select
            className="doc-select"
            value={resume.id}
            onChange={(e) => setActiveResume(e.target.value)}
            title="Elegí otro CV"
          >
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.documentName}
              </option>
            ))}
          </select>

          <input
            className="doc-name-input"
            value={resume.documentName}
            onChange={(e) => renameResume(resume.id, e.target.value)}
            aria-label="Nombre del documento"
          />

          <div className="header-actions">
            <select
              value={resume.templateId}
              onChange={(e) => setTemplate(resume.id, e.target.value as TemplateId)}
              title="Plantilla"
            >
              <option value="modern">Plantilla: Moderna</option>
              <option value="classic">Plantilla: Clásica</option>
              <option value="minimal">Plantilla: Mínima</option>
            </select>
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
