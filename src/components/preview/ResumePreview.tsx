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
  onOverflowChange,
  onEffectiveZoomChange,
}: {
  resume: Resume;
  zoom: number | null;
  onOverflowChange?: (overflow: boolean) => void;
  onEffectiveZoomChange?: (zoom: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const [fitZoom, setFitZoom] = useState(0.6);

  // Zoom que hace entrar el documento completo (ancho Y alto) en el área visible.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => {
      const fitW = (el.clientWidth - PAD) / (PAGE_W * MM_TO_PX);
      const fitH = (el.clientHeight - PAD) / (PAGE_H * MM_TO_PX);
      const fit = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.min(fitW, fitH)));
      setFitZoom(fit);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const effective = zoom ?? fitZoom;

  useEffect(() => {
    onEffectiveZoomChange?.(effective);
  }, [effective, onEffectiveZoomChange]);

  useEffect(() => {
    const el = clipRef.current;
    if (!el) return;
    const check = () => {
      const o = el.scrollHeight > el.clientHeight + 1;
      setOverflow(o);
      onOverflowChange?.(o);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [resume, onOverflowChange]);

  return (
    <div className="preview-scroll" ref={scrollRef}>
      <div className="preview-stage" style={{ width: `${PAGE_W * effective}mm` }}>
        <div
          ref={clipRef}
          className="page-clip"
          style={{
            width: `${PAGE_W}mm`,
            height: `${PAGE_H}mm`,
            transform: `scale(${effective})`,
            transformOrigin: 'top center',
          }}
        >
          <div className="doc-page">
            <TemplateRenderer resume={resume} />
          </div>
        </div>
        {overflow && (
          <div className="overflow-banner" role="status">
            ⚠ El contenido se desborda la página A4. Acortá el texto, reducí secciones o achicá la tipografía.
          </div>
        )}
      </div>
    </div>
  );
}
