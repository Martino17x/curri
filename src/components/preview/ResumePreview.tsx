import { useEffect, useRef, useState } from 'react';
import type { Resume } from '../../types/resume';
import { TemplateRenderer } from './TemplateRenderer';
import { AlertIcon } from '../ui/icons';

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

  // Overflow REAL: el último bloque de contenido supera la altura de una hoja A4.
  // Se mide el borde inferior del último hijo con contenido (ignora padding/margen
  // final = espacio en blanco) para no paginar ni marcar de más.
  useEffect(() => {
    const el = docRef.current;
    if (!el) return;
    const pageH = PAGE_H * MM_TO_PX;
    const check = () => {
      // Solo cuentan bloques con contenido REAL (texto o media): un div vacío o el
      // margen/padding final es espacio en blanco y no debe marcar ni paginar de más.
      let realBottom = 0;
      for (const child of Array.from(el.children)) {
        const h = (child as HTMLElement).offsetHeight;
        const top = (child as HTMLElement).offsetTop;
        if (h <= 0) continue;
        const hasText = ((child as HTMLElement).innerText ?? '').trim().length > 0;
        const hasMedia = (child as HTMLElement).querySelector('img, svg, table') !== null;
        if ((hasText || hasMedia) && top + h > realBottom) realBottom = top + h;
      }
      const o = realBottom > pageH + 2;
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
        </div>
        {/* Marcador FUERA del frame escalado: queda legible a cualquier zoom. */}
        {overflow && (
          <div className="page-break-marker" style={{ top: `${PAGE_H * effective}mm` }} role="status">
            <span className="page-break-line" />
            <span className="page-break-label">
              <AlertIcon width={18} height={18} />
              <span className="page-break-label-text">
                <strong>Fin de la página 1</strong>
                <small>El contenido continúa en una 2.ª hoja</small>
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
