import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { isResumeEmpty } from '../../data/defaults';
import { useResumeStore } from '../../store/resumeStore';
import type { Resume, Section } from '../../types/resume';
import { SectionView } from '../templates/SectionView';
import { DocHeader, docVars } from '../templates/shared';
import { TemplateRenderer } from './TemplateRenderer';
import { AlertIcon, PencilIcon, SparklesIcon } from '../ui/icons';

const PAGE_W = 210; // mm
const PAGE_H = 297; // mm
const MM_TO_PX = 96 / 25.4;
const PAD = 40; // padding del contenedor (2 × 1.25rem)
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 1.25;

/** Sección editable del preview: click = seleccionar, arrastrar = reordenar. */
function EditableSection({
  section,
  resume,
  selected,
  onSelect,
  onEditSection,
}: {
  section: Section;
  resume: Resume;
  selected: boolean;
  onSelect: () => void;
  onEditSection: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`editable-sec ${selected ? 'editable-sec--selected' : ''} ${isDragging ? 'editable-sec--dragging' : ''}`}
      data-section-id={section.id}
      {...listeners}
      {...attributes}
      onClick={onSelect}
    >
      <SectionView section={section} headerStyle={resume.theme.headerStyle} forceRender />
      {selected && (
        <button
          type="button"
          className="sec-edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEditSection(section.id);
          }}
        >
          <PencilIcon width={11} height={11} />
          Editar
        </button>
      )}
    </div>
  );
}

/** Documento editable: misma estructura que los templates, con secciones sortables. */
function EditableDoc({ resume, onEditSection }: { resume: Resume; onEditSection: (id: string) => void }) {
  const { theme } = resume;
  const visible = resume.sections.filter((s) => s.visible);
  const basics = visible.find((s): s is Extract<Section, { type: 'basics' }> => s.type === 'basics');
  const rest = visible.filter((s) => s.type !== 'basics');
  const reorderSections = useResumeStore((s) => s.reorderSections);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = resume.sections.findIndex((s) => s.id === active.id);
    const to = resume.sections.findIndex((s) => s.id === over.id);
    if (from < 0 || to < 0) return;
    reorderSections(resume.id, from, to);
  };

  return (
    <div className={`tpl tpl-${resume.templateId}`}>
      <header className="doc-header">
        <DocHeader basics={basics} theme={theme} />
      </header>
      <div className="tpl-body" data-cols={theme.columns}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={rest.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {rest.map((s) => (
              <EditableSection
                key={s.id}
                section={s}
                resume={resume}
                selected={selectedId === s.id}
                onSelect={() => setSelectedId(s.id)}
                onEditSection={onEditSection}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export function ResumePreview({
  resume,
  zoom,
  presetZoom,
  onOverflowChange,
  onEffectiveZoomChange,
  onFitReady,
  editMode,
  onEditSection,
  onEmptyAction,
}: {
  resume: Resume;
  zoom: number | null;
  presetZoom: number;
  onOverflowChange?: (overflow: boolean) => void;
  onEffectiveZoomChange?: (zoom: number) => void;
  onFitReady?: (zoom: number) => void;
  editMode?: boolean;
  onEditSection?: (sectionId: string) => void;
  onEmptyAction?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const isEmpty = isResumeEmpty(resume);

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

  // Overflow REAL: el contenido del documento supera la altura de una hoja A4.
  // scrollHeight es altura de layout (sin el transform del zoom); el min-height
  // absorbe el espacio en blanco final. Tolerancia = padding inferior + aire por
  // diferencias de render entre navegadores.
  useEffect(() => {
    const el = docRef.current;
    if (!el || isEmpty) return;
    const pageH = PAGE_H * MM_TO_PX;
    const TOLERANCE = 56;
    const check = () => {
      const o = el.scrollHeight > pageH + TOLERANCE;
      setOverflow(o);
      onOverflowChange?.(o);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [resume, onOverflowChange, isEmpty]);

  const effective = zoom ?? presetZoom;

  useEffect(() => {
    onEffectiveZoomChange?.(effective);
  }, [effective, onEffectiveZoomChange]);

  // CV recién creado (sin secciones): guía en vez de un documento vacío.
  if (isEmpty) {
    return (
      <div className="preview-scroll">
        <div className="preview-empty">
          <span className="preview-empty-icon">
            <SparklesIcon width={26} height={26} />
          </span>
          <p className="preview-empty-title">Tu currículum todavía no tiene secciones</p>
          <p className="preview-empty-sub">Empezá a escribir para ver cómo progresa.</p>
          {onEmptyAction && (
            <button type="button" className="btn-primary" onClick={onEmptyAction}>
              Ver secciones
            </button>
          )}
        </div>
      </div>
    );
  }

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
          <div className="doc-page" style={docVars(resume.theme)} ref={docRef}>
            {editMode && onEditSection ? (
              <EditableDoc resume={resume} onEditSection={onEditSection} />
            ) : (
              <TemplateRenderer resume={resume} />
            )}
          </div>
        </div>
        {/* Marcador FUERA del frame escalado: queda legible a cualquier zoom. */}
        {overflow && (
          <div className="page-break-marker" style={{ top: `${PAGE_H * effective}mm` }} role="status">
            <span className="page-break-line" />
            <span className="page-break-label">
              <AlertIcon width={14} height={14} />
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
