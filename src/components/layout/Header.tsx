import { useNavigate, useParams } from 'react-router-dom';
import { useResumeStore } from '../../store/resumeStore';
import { useUiStore } from '../../store/uiStore';
import type { TemplateId } from '../../types/resume';
import { Select } from '../ui/Select';
import { PaletteIcon, ScanSearchIcon } from '../ui/icons';

const TEMPLATE_OPTIONS: { value: TemplateId; label: string }[] = [
  { value: 'modern', label: 'Moderna' },
  { value: 'classic', label: 'Clásica' },
  { value: 'minimal', label: 'Mínima' },
];

export function Header() {
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const resumes = useResumeStore((s) => s.resumes);
  const renameResume = useResumeStore((s) => s.renameResume);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setShowThemePanel = useUiStore((s) => s.setShowThemePanel);
  const setShowAtsPanel = useUiStore((s) => s.setShowAtsPanel);

  // En la página principal el header es mínimo: solo identidad. Las herramientas
  // de edición (selector de CV, nombre, plantilla, Tema/ATS) viven en el builder.
  const resume = resumeId ? resumes.find((r) => r.id === resumeId) : undefined;
  const isBuilder = !!resume;

  return (
    <header className={`app-header ${isBuilder ? 'app-header--builder' : 'app-header--list'}`}>
      <div className="header-brand">
        <button type="button" className="logo" onClick={() => navigate('/')} title="Volver a tus CVs">
          <span className="logo-mark" aria-hidden="true" />
          Curri
        </button>
        {!isBuilder && <span className="header-tagline">Editor de CV compatibles con ATS · 100% local</span>}
      </div>

      {isBuilder && (
        <>
          <span className="header-sep" aria-hidden="true" />

          <Select
            className="select--sm header-cv"
            options={resumes.map((r) => ({ value: r.id, label: r.documentName || 'Sin nombre' }))}
            value={resume.id}
            onChange={(id) => navigate(`/cv/${id}`)}
            ariaLabel="Elegí otro CV"
          />

          <input
            className="doc-name-input"
            value={resume.documentName}
            onChange={(e) => renameResume(resume.id, e.target.value)}
            aria-label="Nombre del documento"
            placeholder="Nombre del CV"
          />

          <span className="header-sep" aria-hidden="true" />

          <Select
            className="select--sm header-template"
            options={TEMPLATE_OPTIONS}
            value={resume.templateId}
            onChange={(v) => setTemplate(resume.id, v as TemplateId)}
            ariaLabel="Plantilla"
            placeholder="Plantilla"
          />

          <div className="header-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowThemePanel(true)}
              aria-haspopup="dialog"
            >
              <PaletteIcon width={15} height={15} />
              Tema
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowAtsPanel(true)}
              aria-haspopup="dialog"
            >
              <ScanSearchIcon width={15} height={15} />
              ATS
            </button>
          </div>
        </>
      )}
    </header>
  );
}
