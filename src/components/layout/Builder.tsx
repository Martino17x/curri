import { useEffect, useRef, useState } from 'react';
import { exportPdf } from '../../lib/exportPdf';
import { exportJsonResume, importResumeFile } from '../../lib/exportJson';
import { useResumeStore } from '../../store/resumeStore';
import { useUiStore } from '../../store/uiStore';
import type { Resume } from '../../types/resume';
import { SectionForms } from '../editor/SectionForms';
import { AtsPanel } from '../panels/AtsPanel';
import { SectionsPanel } from '../panels/SectionsPanel';
import { ThemePanel } from '../panels/ThemePanel';
import { ResumePreview } from '../preview/ResumePreview';
import { ZoomControls } from '../preview/ZoomControls';

export function Builder({ resume }: { resume: Resume }) {
  const activeSectionId = useUiStore((s) => s.activeSectionId);
  const zoom = useUiStore((s) => s.zoom);
  const showThemePanel = useUiStore((s) => s.showThemePanel);
  const showAtsPanel = useUiStore((s) => s.showAtsPanel);
  const importResume = useResumeStore((s) => s.importResume);
  const [pageOverflow, setPageOverflow] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const activeSection =
    resume.sections.find((s) => s.id === activeSectionId) ?? resume.sections.find((s) => s.type === 'basics');

  const handleImport = async (file: File) => {
    try {
      const imported = await importResumeFile(file);
      importResume(imported);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo importar el archivo.');
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        exportPdf(resume);
      }
      if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        exportJsonResume(resume);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [resume]);

  return (
    <div className="builder">
      <aside className="builder-left">
        <SectionsPanel resume={resume} />
        <div className="panel panel-form">
          <div className="panel-head">
            <h2>{activeSection?.title ?? 'Sección'}</h2>
          </div>
          {activeSection ? (
            <SectionForms key={activeSection.id} resume={resume} section={activeSection} />
          ) : (
            <p className="panel-hint">Seleccioná una sección para editarla.</p>
          )}
        </div>
      </aside>

      <section className="builder-right">
        <div className="preview-toolbar">
          <ZoomControls />
          <div className="preview-toolbar-actions">
            <button type="button" className="btn-primary btn-small" onClick={() => exportPdf(resume)}>
              Exportar PDF
            </button>
            <button type="button" className="btn-secondary btn-small" onClick={() => exportJsonResume(resume)}>
              JSON
            </button>
            <button type="button" className="btn-secondary btn-small" onClick={() => fileRef.current?.click()}>
              Importar
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleImport(file);
                e.target.value = '';
              }}
            />
          </div>
        </div>
        <ResumePreview resume={resume} zoom={zoom} onOverflowChange={setPageOverflow} />
        {showThemePanel && <ThemePanel resume={resume} />}
        {showAtsPanel && <AtsPanel resume={resume} pageOverflow={pageOverflow} />}
      </section>
    </div>
  );
}
