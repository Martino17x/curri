import { useState } from 'react';
import { exportJsonResumeWithOptions, type JsonExportFormat } from '../../lib/exportJson';
import type { Resume } from '../../types/resume';

export function ExportJsonModal({ resume, onClose }: { resume: Resume; onClose: () => void }) {
  const [format, setFormat] = useState<JsonExportFormat>('curri');
  const [includePhoto, setIncludePhoto] = useState(false);
  const [includeTheme, setIncludeTheme] = useState(true);

  const download = () => {
    exportJsonResumeWithOptions(resume, { format, includePhoto, includeTheme });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Exportar JSON"
      >
        <div className="modal-head">
          <h2>Exportar JSON</h2>
          <button type="button" className="btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <fieldset className="modal-group">
            <legend className="field-label">Formato</legend>
            <label className="field field--toggle">
              <input
                type="radio"
                name="json-format"
                checked={format === 'curri'}
                onChange={() => setFormat('curri')}
              />
              <span>Curri (nativo — conserva secciones, tema y orden)</span>
            </label>
            <label className="field field--toggle">
              <input
                type="radio"
                name="json-format"
                checked={format === 'jsonresume'}
                onChange={() => setFormat('jsonresume')}
              />
              <span>JSON Resume (estándar — sin foto ni tema)</span>
            </label>
          </fieldset>

          {format === 'curri' && (
            <div className="modal-group">
              <label className="field field--toggle">
                <input
                  type="checkbox"
                  checked={includePhoto}
                  onChange={(e) => setIncludePhoto(e.target.checked)}
                />
                <span>Incluir foto</span>
              </label>
              <label className="field field--toggle">
                <input
                  type="checkbox"
                  checked={includeTheme}
                  onChange={(e) => setIncludeTheme(e.target.checked)}
                />
                <span>Incluir tema</span>
              </label>
            </div>
          )}
        </div>

        <div className="modal-foot">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn-primary" onClick={download}>
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
}
