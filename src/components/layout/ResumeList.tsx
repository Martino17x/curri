import { useResumeStore } from '../../store/resumeStore';
import { useUiStore } from '../../store/uiStore';
import { PlusIcon, SparklesIcon } from '../ui/icons';

function formatUpdated(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function ResumeList() {
  const resumes = useResumeStore((s) => s.resumes);
  const addResume = useResumeStore((s) => s.addResume);
  const addSampleResume = useResumeStore((s) => s.addSampleResume);
  const duplicateResume = useResumeStore((s) => s.duplicateResume);
  const deleteResume = useResumeStore((s) => s.deleteResume);
  const setActiveResume = useResumeStore((s) => s.setActiveResume);
  const setView = useUiStore((s) => s.setView);

  const open = (id: string) => {
    setActiveResume(id);
    setView({ name: 'builder' });
  };

  return (
    <main className="list-page">
      <div className="list-hero">
        <h1>Tus CVs</h1>
        <p>Creá, editá y exportá currículums compatibles con ATS. Todo se guarda en este navegador.</p>
      </div>

      <div className="list-grid">
        {resumes.map((r) => {
          const visibleSections = r.sections.filter((s) => s.visible).length;
          return (
            <article className="resume-card" key={r.id}>
              <button type="button" className="resume-card-main" onClick={() => open(r.id)}>
                <span className="resume-card-name">{r.documentName || 'Sin nombre'}</span>
                <span className="resume-card-meta">
                  {visibleSections} secciones · editado {formatUpdated(r.updatedAt)}
                </span>
              </button>
              <div className="resume-card-actions">
                <button type="button" className="btn-secondary btn-small" onClick={() => open(r.id)}>
                  Editar
                </button>
                <button
                  type="button"
                  className="btn-secondary btn-small"
                  onClick={() => open(duplicateResume(r.id))}
                >
                  Duplicar
                </button>
                <button type="button" className="btn-danger btn-small" onClick={() => deleteResume(r.id)}>
                  Borrar
                </button>
              </div>
            </article>
          );
        })}

        <button
          type="button"
          className="resume-card resume-card--new"
          onClick={() => {
            const id = addResume();
            open(id);
          }}
        >
          <span className="resume-card-plus">
            <PlusIcon width={22} height={22} />
          </span>
          <span>Nuevo CV</span>
        </button>

        <button
          type="button"
          className="resume-card resume-card--new"
          onClick={() => {
            const id = addSampleResume();
            open(id);
          }}
        >
          <span className="resume-card-plus">
            <SparklesIcon width={22} height={22} />
          </span>
          <span>Cargar CV de ejemplo</span>
        </button>
      </div>
    </main>
  );
}
