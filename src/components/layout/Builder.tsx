import { useEffect, useRef, useState } from 'react';
import { exportPdf } from '../../lib/exportPdf';
import { exportJsonResume, importResumeFile } from '../../lib/exportJson';
import { useResumeStore } from '../../store/resumeStore';
import { useUiStore } from '../../store/uiStore';
import type { Resume } from '../../types/resume';
import { AtsPanel } from '../panels/AtsPanel';
import { SectionsPanel } from '../panels/SectionsPanel';
import { ThemePanel } from '../panels/ThemePanel';
import { ResumePreview } from '../preview/ResumePreview';
import { ZoomControls } from '../preview/ZoomControls';

export function Builder({ resume }: { resume: Resume }) {
  const zoom = useUiStore((s) => s.zoom);
  const showThemePanel = useUiStore((s) => s.showThemePanel);
  const showAtsPanel = useUiStore((s) => s.showAtsPanel);
  const showPreviewMobile = useUiStore((s) => s.showPreviewMobile);
  const setShowPreviewMobile = useUiStore((s) => s.setShowPreviewMobile);
  const importResume = useResumeStore((s) => s.importResume);
  const [pageOverflow, setPageOverflow] = useState(false);
  const [effectiveZoom, setEffectiveZoom] = useState(1);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 1020px)').matches);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1020px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

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

  const previewColumn = (
    <section className="builder-right">
      <div className="preview-toolbar">
        <ZoomControls effectiveZoom={effectiveZoom} />
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
      <ResumePreview
        resume={resume}
        zoom={zoom}
        onOverflowChange={setPageOverflow}
        onEffectiveZoomChange={setEffectiveZoom}
      />
      {showThemePanel && <ThemePanel resume={resume} />}
      {showAtsPanel && <AtsPanel resume={resume} pageOverflow={pageOverflow} />}
    </section>
  );

  return (
    <div className="builder">
      {isMobile && (
        <div className="builder-mobile-bar">
          <button
            type="button"
            className={showPreviewMobile ? 'btn-secondary' : 'btn-primary'}
            onClick={() => setShowPreviewMobile(!showPreviewMobile)}
          >
            {showPreviewMobile ? '✕ Ocultar vista previa' : '👁 Ver vista previa'}
          </button>
        </div>
      )}

      {isMobile && showPreviewMobile && previewColumn}

      <aside className="builder-left">
        <SectionsPanel resume={resume} />
      </aside>

      {!isMobile && previewColumn}
    </div>
  );
}
