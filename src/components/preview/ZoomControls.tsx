import { useUiStore } from '../../store/uiStore';

export function ZoomControls({ effectiveZoom }: { effectiveZoom: number }) {
  const setZoom = useUiStore((s) => s.setZoom);
  const setZoomFit = useUiStore((s) => s.setZoomFit);
  return (
    <div className="zoom-controls">
      <button
        type="button"
        onClick={() => setZoom(Math.max(0.3, +(effectiveZoom - 0.1).toFixed(2)))}
        aria-label="Alejar"
      >
        −
      </button>
      <span className="zoom-value">{Math.round(effectiveZoom * 100)}%</span>
      <button
        type="button"
        onClick={() => setZoom(Math.min(2, +(effectiveZoom + 0.1).toFixed(2)))}
        aria-label="Acercar"
      >
        +
      </button>
      <button type="button" className="btn-secondary btn-small" onClick={setZoomFit} title="Ajustar al área">
        Ajustar
      </button>
      <button type="button" className="btn-secondary btn-small" onClick={() => setZoom(1)} title="Tamaño real">
        100%
      </button>
    </div>
  );
}
