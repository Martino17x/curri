import { useEffect, useRef, useState } from 'react';
import type { Resume } from '../../types/resume';
import { TemplateRenderer } from './TemplateRenderer';

const PAGE_W = 210; // mm
const PAGE_H = 297; // mm
const MM_TO_PX = 96 / 25.4;
const PAD = 40; // padding del contenedor (2 × 1.25rem)
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 1.25;

export function ResumePreview({
  resume,
  zoom,
  presetZoom,
  onOverflowChange,
  onEffectiveZoomChange,
  onFitReady,
}: {
  resume: Resume;
  zoom: number | null;
  presetZoom: number;
  onOverflowChange?: (overflow: boolean) => void;
  onEffectiveZoomChange?: (zoom: number) => void;
  onFitReady?: (zoom: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);

  // Fit: zoom que hace entrar el documento completo en el área visible.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => {
      const fitW = (el.clientWidth - PAD) / (PAGE_W * MM_TO_PX);
      const fitH = (el.clientHeight - PAD) / (PAGE_H * MM_TO_PX);
      const fit = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.min(fitW, fitH)));
      onFitReady?.(fit);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onFitReady]);

  // Overflow: el contenido del documento supera la altura de una hoja A4.
  useEffect(() => {
    const el = docRef.current;
    if (!el) return;
    const check = () => {
      const o = el.scrollHeight > PAGE_H * MM_TO_PX + 1;
      setOverflow(o);
      onOverflowChange?.(o);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [resume, onOverflowChange]);

  const effective = zoom ?? presetZoom;

  useEffect(() => {
    onEffectiveZoomChange?.(effective);
  }, [effective, onEffectiveZoomChange]);

  return (
    <div className="preview-scroll" ref={scrollRef}>
      <div className="preview-stage" style={{ width: `${PAGE_W * effective}mm` }}>
        <div
          className="page-frame"
          style={{
            width: `${PAGE_W}mm`,
            minHeight: `${PAGE_H}mm`,
            transform: `scale(${effective})`,
            transformOrigin: 'top center',
          }}
        >
          <div className="doc-page" ref={docRef}>
            <TemplateRenderer resume={resume} />
          </div>
          {overflow && (
            <div className="page-break-marker" role="status">
              <span className="page-break-line" />
              <span className="page-break-label">
                ⚠ Fin de la página 1 — el contenido continúa (se paginará a una 2.ª hoja)
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
