import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { DEFAULT_THEME } from '../../data/defaults';
import { useResumeStore } from '../../store/resumeStore';
import { useUiStore } from '../../store/uiStore';
import type { TemplateId } from '../../types/resume';
import { Select } from '../ui/Select';
import { PaletteIcon, ScanSearchIcon } from '../ui/icons';

const TEMPLATE_OPTIONS: { value: string; label: string }[] = [
  { value: 'default', label: 'Predeterminada' },
  { value: 'modern', label: 'Moderna' },
  { value: 'classic', label: 'Clásica' },
  { value: 'minimal', label: 'Mínima' },
  { value: 'executive', label: 'Ejecutiva' },
  { value: 'creative', label: 'Creativa' },
];

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  // Determinístico: matchea la URL contra el patrón del editor. useParams() fuera
  // de una <Route> hija no garantiza ver el param en todas las versiones del router.
  const match = matchPath('/cv/:resumeId', location.pathname);
  const resumeId = match?.params.resumeId;
  const resumes = useResumeStore((s) => s.resumes);
  const renameResume = useResumeStore((s) => s.renameResume);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const updateTheme = useResumeStore((s) => s.updateTheme);
  const setShowThemePanel = useUiStore((s) => s.setShowThemePanel);
  const setShowAtsPanel = useUiStore((s) => s.setShowAtsPanel);

  // En la página principal el header es mínimo: solo identidad. Las herramientas
  // de edición (selector de CV, nombre, plantilla, Tema/ATS) viven en el builder.
  const resume = resumeId ? resumes.find((r) => r.id === resumeId) : undefined;
  const isBuilder = !!resume;

  const isDefaultStyle =
    !!resume &&
    resume.templateId === 'modern' &&
    resume.theme.accentColor === DEFAULT_THEME.accentColor &&
    resume.theme.fontFamily === DEFAULT_THEME.fontFamily &&
    resume.theme.baseFontSize === DEFAULT_THEME.baseFontSize &&
    resume.theme.headingScale === DEFAULT_THEME.headingScale &&
    resume.theme.spacing === DEFAULT_THEME.spacing &&
    resume.theme.headerStyle === DEFAULT_THEME.headerStyle &&
    resume.theme.nameUppercase === DEFAULT_THEME.nameUppercase &&
    resume.theme.contactLabels === DEFAULT_THEME.contactLabels;

  const handleTemplateChange = (v: string) => {
    if (!resume) return;
    if (v === 'default') {
      // Vuelve al estilo original: plantilla moderna + tema por defecto completo.
      setTemplate(resume.id, 'modern');
      updateTheme(resume.id, () => ({ ...DEFAULT_THEME }));
      return;
    }
    setTemplate(resume.id, v as TemplateId);
  };

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
            value={isDefaultStyle ? 'default' : resume.templateId}
            onChange={handleTemplateChange}
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
