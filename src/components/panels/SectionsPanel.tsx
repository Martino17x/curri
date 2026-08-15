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
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SECTION_TYPE_LABELS, createSection } from '../../data/defaults';
import { useResumeStore } from '../../store/resumeStore';
import { useUiStore } from '../../store/uiStore';
import type { Resume, Section } from '../../types/resume';
import { SectionForms } from '../editor/SectionForms';
import { ChevronLeftIcon, EyeIcon, EyeOffIcon, GearIcon, GripIcon, PlusIcon, XIcon } from '../ui/icons';

function SortableRow({
  section,
  onActivate,
  onToggle,
  onRemove,
}: {
  section: Section;
  onActivate: () => void;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const isBasics = section.type === 'basics';
  return (
    <div ref={setNodeRef} style={style} className={`section-row ${isDragging ? 'section-row--dragging' : ''}`}>
      {!isBasics && (
        <button
          type="button"
          className="drag-handle"
          aria-label="Arrastrar para reordenar"
          {...attributes}
          {...listeners}
        >
          <GripIcon width={18} height={18} />
        </button>
      )}
      <button type="button" className="section-row-title" onClick={onActivate} title="Configurar sección">
        {section.title}
      </button>
      <button type="button" className="btn-icon" title="Configurar sección" onClick={onActivate}>
        <GearIcon />
      </button>
      <button
        type="button"
        className={`btn-icon ${section.visible ? '' : 'btn-icon--off'}`}
        title={section.visible ? 'Ocultar sección' : 'Mostrar sección'}
        onClick={onToggle}
      >
        {section.visible ? <EyeIcon /> : <EyeOffIcon />}
      </button>
      {!isBasics && (
        <button type="button" className="btn-icon" title="Eliminar sección" onClick={onRemove}>
          <XIcon />
        </button>
      )}
    </div>
  );
}

export function SectionsPanel({ resume }: { resume: Resume }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const addSection = useResumeStore((s) => s.addSection);
  const removeSection = useResumeStore((s) => s.removeSection);
  const toggleSectionVisible = useResumeStore((s) => s.toggleSectionVisible);
  const renameSection = useResumeStore((s) => s.renameSection);
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

  const activeSection = resume.sections.find((s) => s.id === activeSectionId);

  // Vista detalle: config de la sección dentro del MISMO panel, con botón "volver".
  if (activeSection) {
    return (
      <div className="panel panel-form">
        <div className="panel-head panel-head--detail">
          <button type="button" className="btn-back" onClick={() => setActiveSectionId(null)}>
            <ChevronLeftIcon width={16} height={16} />
            Volver
          </button>
        </div>
        <label className="field">
          <span className="field-label">Título de la sección</span>
          <input
            className="section-title-input"
            value={activeSection.title}
            onChange={(e) => renameSection(resume.id, activeSection.id, e.target.value)}
          />
        </label>
        <SectionForms key={activeSection.id} resume={resume} section={activeSection} />
      </div>
    );
  }

  // Vista lista: secciones reordenables.
  const existing = new Set(resume.sections.map((s) => s.type));
  const sortable = resume.sections.filter((s) => s.type !== 'basics');

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Secciones</h2>
        <div className="add-section-wrap">
          <button type="button" className="btn-primary btn-small" onClick={() => setMenuOpen((v) => !v)}>
            <PlusIcon width={14} height={14} />
            Agregar
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
                        const section = createSection(type);
                        addSection(resume.id, section);
                        setActiveSectionId(section.id);
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
      <p className="panel-hint">Tocá una sección para configurarla. Arrastrá el agarre para reordenar.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={sortable.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {resume.sections.map((s) => (
            <SortableRow
              key={s.id}
              section={s}
              onActivate={() => setActiveSectionId(s.id)}
              onToggle={() => toggleSectionVisible(resume.id, s.id)}
              onRemove={() => removeSection(resume.id, s.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
