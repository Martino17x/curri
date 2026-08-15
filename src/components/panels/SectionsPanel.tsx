import { useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SECTION_TYPE_LABELS, createSection } from '../../data/defaults';
import { useResumeStore } from '../../store/resumeStore';
import { useUiStore } from '../../store/uiStore';
import type { Resume, Section } from '../../types/resume';

function SortableRow({
  section,
  active,
  onActivate,
}: {
  section: Section;
  active: boolean;
  onActivate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const resumeStore = useResumeStore();
  const resume = resumeStore.resumes.find((r) => r.id === resumeStore.activeResumeId);
  if (!resume) return null;

  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`section-row ${active ? 'section-row--active' : ''} ${isDragging ? 'section-row--dragging' : ''}`}
    >
      <button
        type="button"
        className="drag-handle"
        aria-label="Arrastrar para reordenar"
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>
      <button type="button" className="section-row-title" onClick={onActivate}>
        {section.title}
      </button>
      <button
        type="button"
        className={`btn-icon ${section.visible ? '' : 'btn-icon--off'}`}
        title={section.visible ? 'Ocultar sección' : 'Mostrar sección'}
        onClick={() => resumeStore.toggleSectionVisible(resume.id, section.id)}
      >
        {section.visible ? '👁' : '—'}
      </button>
      {section.type !== 'basics' && (
        <button
          type="button"
          className="btn-icon"
          title="Eliminar sección"
          onClick={() => resumeStore.removeSection(resume.id, section.id)}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function SectionsPanel({ resume }: { resume: Resume }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const addSection = useResumeStore((s) => s.addSection);
  const activeSectionId = useUiStore((s) => s.activeSectionId);
  const setActiveSectionId = useUiStore((s) => s.setActiveSectionId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = resume.sections.findIndex((s) => s.id === active.id);
    const to = resume.sections.findIndex((s) => s.id === over.id);
    if (from < 0 || to < 0) return;
    useResumeStore.getState().reorderSections(resume.id, from, to);
  };

  const existing = new Set(resume.sections.map((s) => s.type));
  const sortable = resume.sections.filter((s) => s.type !== 'basics');

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Secciones</h2>
        <div className="add-section-wrap">
          <button type="button" className="btn-primary btn-small" onClick={() => setMenuOpen((v) => !v)}>
            + Agregar
          </button>
          {menuOpen && (
            <div className="menu">
              {(Object.keys(SECTION_TYPE_LABELS) as (keyof typeof SECTION_TYPE_LABELS)[])
                .filter((t) => t !== 'basics')
                .map((type) => {
                  const disabled = type !== 'custom' && existing.has(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      className="menu-item"
                      disabled={disabled}
                      onClick={() => {
                        addSection(resume.id, createSection(type));
                        setMenuOpen(false);
                      }}
                    >
                      {SECTION_TYPE_LABELS[type]}
                      {disabled && ' (ya existe)'}
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      </div>
      <p className="panel-hint">Arrastrá para ordenar. Hacé clic para editar.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={sortable.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {resume.sections.map((s) => (
            <SortableRow
              key={s.id}
              section={s}
              active={activeSectionId === s.id}
              onActivate={() => setActiveSectionId(s.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
