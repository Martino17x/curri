import { useUiStore } from '../../store/uiStore';

export function ZoomControls() {
  const zoom = useUiStore((s) => s.zoom);
  const setZoom = useUiStore((s) => s.setZoom);
  return (
    <div className="zoom-controls">
      <button type="button" onClick={() => setZoom(Math.max(0.4, +(zoom - 0.1).toFixed(2)))} aria-label="Alejar">
        −
      </button>
      <span className="zoom-value">{Math.round(zoom * 100)}%</span>
      <button type="button" onClick={() => setZoom(Math.min(2, +(zoom + 0.1).toFixed(2)))} aria-label="Acercar">
        +
      </button>
      <button type="button" className="btn-secondary btn-small" onClick={() => setZoom(1)}>
        100%
      </button>
    </div>
  );
}
