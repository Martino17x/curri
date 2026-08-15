import { useEffect, useRef, useState } from 'react';
import { useDeviceTier } from '../../hooks/useDeviceTier';
import { exportPdf } from '../../lib/exportPdf';
import { exportJsonResume, importResumeFile } from '../../lib/exportJson';
import { useResumeStore } from '../../store/resumeStore';
import { useUiStore } from '../../store/uiStore';
import type { Resume } from '../../types/resume';
import { AtsPanel } from '../panels/AtsPanel';
import { ExportJsonModal } from '../panels/ExportJsonModal';
import { SectionsPanel } from '../panels/SectionsPanel';
import { ThemePanel } from '../panels/ThemePanel';
import { ResumePreview } from '../preview/ResumePreview';
import { ZoomControls } from '../preview/ZoomControls';
import { EyeIcon, EyeOffIcon, PencilIcon, PrinterIcon } from '../ui/icons';

export function Builder({ resume }: { resume: Resume }) {
  const { presetZoom, isCompact } = useDeviceTier();
  const zoom = useUiStore((s) => s.zoom);
  const showThemePanel = useUiStore((s) => s.showThemePanel);
  const showAtsPanel = useUiStore((s) => s.showAtsPanel);
  const showPreview = useUiStore((s) => s.showPreviewMobile);
  const setShowPreview = useUiStore((s) => s.setShowPreviewMobile);
  const previewEditMode = useUiStore((s) => s.previewEditMode);
  const setPreviewEditMode = useUiStore((s) => s.setPreviewEditMode);
  const setActiveSectionId = useUiStore((s) => s.setActiveSectionId);
  const importResume = useResumeStore((s) => s.importResume);
  const leftRef = useRef<HTMLElement>(null);
  const [flashSections, setFlashSections] = useState(false);
  const [pageOverflow, setPageOverflow] = useState(false);
  const [effectiveZoom, setEffectiveZoom] = useState(presetZoom);
  const [fitZoom, setFitZoom] = useState(presetZoom);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportDialog, setExportDialog] = useState<'none' | 'json'>('none');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (file: File) => {
    try {
      const imported = await importResumeFile(file);
      importResume(imported);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo importar el archivo.');
    }
  };

  const handleExportPdf = () => {
    if (exportingPdf) return;
    setExportingPdf(true);
    exportPdf(resume, {
      onDone: () => setExportingPdf(false),
      onError: () => {
        setExportingPdf(false);
        alert('No se pudo abrir el diálogo de impresión.');
      },
    });
  };

  const handleEditSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    if (isCompact) setShowPreview(false); // en mobile: mostrar el panel de edición
  };

  const handleEmptyAction = () => {
    if (isCompact) {
      setShowPreview(false);
      return;
    }
    // Desktop: resaltar el panel de secciones y hacer scroll hasta él.
    setFlashSections(true);
    leftRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => setFlashSections(false), 1600);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleExportPdf();
      }
      if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        exportJsonResume(resume);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [resume, exportingPdf]);

  const previewColumn = (
    <section className="builder-right">
      <div className="preview-toolbar">
        <ZoomControls effectiveZoom={effectiveZoom} fitZoom={fitZoom} />
        <div className="preview-toolbar-actions">
          <button
            type="button"
            className={`btn-secondary btn-small ${previewEditMode ? 'btn-secondary--active' : ''}`}
            onClick={() => setPreviewEditMode(!previewEditMode)}
            aria-pressed={previewEditMode}
            title="Click en una sección para editarla, arrastrá para reordenar"
          >
            <PencilIcon width={13} height={13} />
            {previewEditMode ? 'Listo' : 'Editar secciones'}
          </button>
          <button
            type="button"
            className="btn-primary btn-small"
            onClick={handleExportPdf}
            disabled={exportingPdf}
            title="Imprimir el CV (abre el diálogo de impresión)"
          >
            <PrinterIcon width={14} height={14} />
            Imprimir
          </button>
          <button
            type="button"
            className="btn-secondary btn-small"
            onClick={handleExportPdf}
            disabled={exportingPdf}
          >
            {exportingPdf ? 'Preparando…' : 'Exportar PDF'}
          </button>
          <button type="button" className="btn-secondary btn-small" onClick={() => setExportDialog('json')}>
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
        presetZoom={presetZoom}
        onOverflowChange={setPageOverflow}
        onEffectiveZoomChange={setEffectiveZoom}
        onFitReady={setFitZoom}
        editMode={previewEditMode}
        onEditSection={handleEditSection}
        onEmptyAction={handleEmptyAction}
      />
    </section>
  );

  return (
    <div className="builder">
      {isCompact && (
        <div className="builder-mobile-bar">
          <button
            type="button"
            className={`btn ${showPreview ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setShowPreview(!showPreview)}
            aria-pressed={showPreview}
          >
            {showPreview ? <EyeOffIcon /> : <EyeIcon />}
            {showPreview ? 'Ocultar vista previa' : 'Ver vista previa'}
          </button>
        </div>
      )}

      {isCompact && showPreview && previewColumn}

      <aside
        ref={leftRef}
        className={`builder-left ${flashSections ? 'builder-left--flash' : ''}`}
      >
        <SectionsPanel resume={resume} />
      </aside>

      {!isCompact && previewColumn}

      {exportDialog === 'json' && <ExportJsonModal resume={resume} onClose={() => setExportDialog('none')} />}

      {/* Paneles flotantes Tema / ATS: overlay fijo + backdrop, no dependen del layout */}
      {(showThemePanel || showAtsPanel) && (
        <div
          className="drawer-backdrop"
          onClick={() => {
            useUiStore.setState({ showThemePanel: false, showAtsPanel: false });
          }}
          aria-hidden="true"
        />
      )}
      {showThemePanel && <ThemePanel resume={resume} />}
      {showAtsPanel && <AtsPanel resume={resume} pageOverflow={pageOverflow} />}
    </div>
  );
}
