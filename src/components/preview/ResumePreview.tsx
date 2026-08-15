import { useEffect, useRef, useState } from 'react';
import type { Resume } from '../../types/resume';
import { TemplateRenderer } from './TemplateRenderer';

const PAGE_W = 210; // mm
const PAGE_H = 297; // mm

export function ResumePreview({
  resume,
  zoom,
  onOverflowChange,
}: {
  resume: Resume;
  zoom: number;
  onOverflowChange?: (overflow: boolean) => void;
}) {
  const clipRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);

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
    <div className="preview-scroll">
      <div className="preview-stage" style={{ width: `${PAGE_W * zoom}mm` }}>
        <div
          ref={clipRef}
          className="page-clip"
          style={{
            width: `${PAGE_W}mm`,
            height: `${PAGE_H}mm`,
            transform: `scale(${zoom})`,
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
