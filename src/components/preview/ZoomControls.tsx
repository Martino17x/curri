import { useUiStore } from '../../store/uiStore';
import { MinusIcon, PlusIcon } from '../ui/icons';

export function ZoomControls({ effectiveZoom, fitZoom }: { effectiveZoom: number; fitZoom: number }) {
  const setZoom = useUiStore((s) => s.setZoom);
  return (
    <div className="zoom-controls">
      <button
        type="button"
        className="zoom-step"
        onClick={() => setZoom(Math.max(0.3, +(effectiveZoom - 0.1).toFixed(2)))}
        aria-label="Alejar"
      >
        <MinusIcon />
      </button>
      <span className="zoom-value">{Math.round(effectiveZoom * 100)}%</span>
      <button
        type="button"
        className="zoom-step"
        onClick={() => setZoom(Math.min(2, +(effectiveZoom + 0.1).toFixed(2)))}
        aria-label="Acercar"
      >
        <PlusIcon />
      </button>
      <button
        type="button"
        className="btn-secondary btn-small zoom-action"
        onClick={() => setZoom(fitZoom)}
        title="Ajustar el documento completo al área visible"
      >
        Ajustar
      </button>
      <button
        type="button"
        className="btn-secondary btn-small zoom-action"
        onClick={() => setZoom(1)}
        title="Tamaño real (100%)"
      >
        100%
      </button>
    </div>
  );
}
