import { uid } from '../../lib/id';
import { useResumeStore } from '../../store/resumeStore';
import type {
  BasicsSection,
  CertificateItem,
  CustomItem,
  EducationItem,
  LanguageItem,
  ProjectItem,
  Resume,
  Section,
  SkillGroup,
  WorkItem,
} from '../../types/resume';
import { CommaInput, DateRangeFields, ListEditor, StringListEditor, TextArea, TextField } from './fields';
import { PhotoUploader } from './PhotoUploader';

function useSectionUpdater<T extends Section>(resumeId: string, sectionId: string) {
  const updateSection = useResumeStore((s) => s.updateSection);
  return (patch: Partial<T>) => updateSection(resumeId, sectionId, (s) => ({ ...s, ...patch }) as Section);
}

function BasicsForm({ resume, section }: { resume: Resume; section: BasicsSection }) {
  const set = useSectionUpdater<BasicsSection>(resume.id, section.id);
  const f = section.fields;
  const setField = (key: keyof BasicsSection['fields']) => (v: string | null) =>
    set({ fields: { ...f, [key]: v } });
  return (
    <div className="form">
      <PhotoUploader value={f.photo} onChange={setField('photo')} />
      <TextField label="Nombre completo" value={f.name} onChange={setField('name')} autoComplete="name" />
      <TextField
        label="Título profesional"
        value={f.label}
        onChange={setField('label')}
        placeholder="Ej: Desarrolladora Frontend"
      />
      <TextField label="Email" type="email" value={f.email} onChange={setField('email')} autoComplete="email" />
      <TextField label="Teléfono" type="tel" value={f.phone} onChange={setField('phone')} autoComplete="tel" />
      <TextField label="Ubicación" value={f.location} onChange={setField('location')} placeholder="Ej: Córdoba, Argentina" />
      <TextField label="LinkedIn" value={f.linkedin} onChange={setField('linkedin')} placeholder="linkedin.com/in/usuario" />
      <TextField label="Sitio web" value={f.website} onChange={setField('website')} placeholder="midominio.com" />
    </div>
  );
}

function SummaryForm({ resume, section }: { resume: Resume; section: Extract<Section, { type: 'summary' }> }) {
  const set = useSectionUpdater<Extract<Section, { type: 'summary' }>>(resume.id, section.id);
  return (
    <div className="form">
      <TextArea
        label="Resumen"
        rows={6}
        value={section.text}
        onChange={(text) => set({ text })}
        placeholder="Contá en 3-4 líneas quién sos, tu experiencia y qué buscás."
      />
    </div>
  );
}

function ExperienceForm({ resume, section }: { resume: Resume; section: Extract<Section, { type: 'experience' }> }) {
  const set = useSectionUpdater<Extract<Section, { type: 'experience' }>>(resume.id, section.id);
  return (
    <div className="form">
      <ListEditor<WorkItem>
        items={section.items}
        onChange={(items) => set({ items })}
        makeItem={() => ({
          id: uid(),
          position: '',
          company: '',
          location: '',
          start: null,
          end: null,
          current: false,
          summary: '',
          highlights: [],
        })}
        addLabel="Agregar empleo"
        renderItem={(item, patch) => (
          <div className="form-stack">
            <TextField label="Puesto" value={item.position} onChange={(position) => patch({ position })} />
            <TextField label="Empresa" value={item.company} onChange={(company) => patch({ company })} />
            <TextField label="Ubicación" value={item.location ?? ''} onChange={(location) => patch({ location })} />
            <DateRangeFields
              start={item.start}
              end={item.end}
              current={item.current}
              onStart={(start) => patch({ start })}
              onEnd={(end) => patch({ end })}
              onCurrent={(current) => patch({ current })}
            />
            <TextArea
              label="Descripción"
              rows={3}
              value={item.summary}
              onChange={(summary) => patch({ summary })}
            />
            <span className="field-label">Logros (bullets)</span>
            <StringListEditor
              values={item.highlights}
              onChange={(highlights) => patch({ highlights })}
              placeholder="Ej: Reduje errores de runtime un 40%"
              addLabel="Agregar logro"
            />
          </div>
        )}
      />
    </div>
  );
}

function EducationForm({ resume, section }: { resume: Resume; section: Extract<Section, { type: 'education' }> }) {
  const set = useSectionUpdater<Extract<Section, { type: 'education' }>>(resume.id, section.id);
  return (
    <div className="form">
      <ListEditor<EducationItem>
        items={section.items}
        onChange={(items) => set({ items })}
        makeItem={() => ({
          id: uid(),
          degree: '',
          institution: '',
          location: '',
          start: null,
          end: null,
          current: false,
          description: '',
        })}
        addLabel="Agregar estudio"
        renderItem={(item, patch) => (
          <div className="form-stack">
            <TextField label="Título / Carrera" value={item.degree} onChange={(degree) => patch({ degree })} />
            <TextField label="Institución" value={item.institution} onChange={(institution) => patch({ institution })} />
            <TextField label="Ubicación" value={item.location ?? ''} onChange={(location) => patch({ location })} />
            <DateRangeFields
              start={item.start}
              end={item.end}
              current={item.current}
              onStart={(start) => patch({ start })}
              onEnd={(end) => patch({ end })}
              onCurrent={(current) => patch({ current })}
              currentLabel="En curso"
            />
            <TextArea
              label="Detalle"
              rows={2}
              value={item.description}
              onChange={(description) => patch({ description })}
            />
          </div>
        )}
      />
    </div>
  );
}

function SkillsForm({ resume, section }: { resume: Resume; section: Extract<Section, { type: 'skills' }> }) {
  const set = useSectionUpdater<Extract<Section, { type: 'skills' }>>(resume.id, section.id);
  return (
    <div className="form">
      <p className="field-help">
        Los ATS leen los keywords separados por coma. Evitá barras de progreso.
      </p>
      <ListEditor<SkillGroup>
        items={section.groups}
        onChange={(groups) => set({ groups })}
        makeItem={() => ({ id: uid(), name: '', keywords: [] })}
        addLabel="Agregar grupo"
        renderItem={(group, patch) => (
          <div className="form-stack">
            <TextField
              label="Grupo (opcional)"
              value={group.name}
              onChange={(name) => patch({ name })}
              placeholder="Ej: Frontend"
            />
            <CommaInput label="Habilidades" value={group.keywords} onChange={(keywords) => patch({ keywords })} />
          </div>
        )}
      />
    </div>
  );
}

function LanguagesForm({ resume, section }: { resume: Resume; section: Extract<Section, { type: 'languages' }> }) {
  const set = useSectionUpdater<Extract<Section, { type: 'languages' }>>(resume.id, section.id);
  return (
    <div className="form">
      <ListEditor<LanguageItem>
        items={section.items}
        onChange={(items) => set({ items })}
        makeItem={() => ({ id: uid(), language: '', level: '' })}
        addLabel="Agregar idioma"
        renderItem={(item, patch) => (
          <div className="form-stack">
            <TextField label="Idioma" value={item.language} onChange={(language) => patch({ language })} />
            <TextField
              label="Nivel"
              value={item.level}
              onChange={(level) => patch({ level })}
              placeholder="Ej: Nativo, B1"
            />
          </div>
        )}
      />
    </div>
  );
}

function ProjectsForm({ resume, section }: { resume: Resume; section: Extract<Section, { type: 'projects' }> }) {
  const set = useSectionUpdater<Extract<Section, { type: 'projects' }>>(resume.id, section.id);
  return (
    <div className="form">
      <ListEditor<ProjectItem>
        items={section.items}
        onChange={(items) => set({ items })}
        makeItem={() => ({
          id: uid(),
          name: '',
          url: '',
          start: null,
          end: null,
          current: false,
          summary: '',
          highlights: [],
        })}
        addLabel="Agregar proyecto"
        renderItem={(item, patch) => (
          <div className="form-stack">
            <TextField label="Nombre" value={item.name} onChange={(name) => patch({ name })} />
            <TextField label="URL (opcional)" value={item.url ?? ''} onChange={(url) => patch({ url })} />
            <DateRangeFields
              start={item.start}
              end={item.end}
              current={item.current}
              onStart={(start) => patch({ start })}
              onEnd={(end) => patch({ end })}
              onCurrent={(current) => patch({ current })}
              currentLabel="En desarrollo"
            />
            <TextArea
              label="Descripción"
              rows={3}
              value={item.summary}
              onChange={(summary) => patch({ summary })}
            />
            <span className="field-label">Logros</span>
            <StringListEditor
              values={item.highlights}
              onChange={(highlights) => patch({ highlights })}
              placeholder="Ej: Usado por 100+ usuarios"
            />
          </div>
        )}
      />
    </div>
  );
}

function CertificatesForm({ resume, section }: { resume: Resume; section: Extract<Section, { type: 'certificates' }> }) {
  const set = useSectionUpdater<Extract<Section, { type: 'certificates' }>>(resume.id, section.id);
  return (
    <div className="form">
      <ListEditor<CertificateItem>
        items={section.items}
        onChange={(items) => set({ items })}
        makeItem={() => ({ id: uid(), name: '', issuer: '', date: '' })}
        addLabel="Agregar certificación"
        renderItem={(item, patch) => (
          <div className="form-stack">
            <TextField label="Nombre" value={item.name} onChange={(name) => patch({ name })} />
            <TextField label="Emisor" value={item.issuer} onChange={(issuer) => patch({ issuer })} />
            <TextField
              label="Fecha (YYYY-MM)"
              value={item.date}
              onChange={(date) => patch({ date })}
              placeholder="2025-05"
            />
          </div>
        )}
      />
    </div>
  );
}

function InterestsForm({ resume, section }: { resume: Resume; section: Extract<Section, { type: 'interests' }> }) {
  const set = useSectionUpdater<Extract<Section, { type: 'interests' }>>(resume.id, section.id);
  return (
    <div className="form">
      <TextArea
        label="Intereses (uno por línea)"
        rows={4}
        value={section.items.join('\n')}
        onChange={(v) => set({ items: v.split('\n').map((s) => s.trim()).filter(Boolean) })}
        placeholder={'Ajedrez\nOpen Source'}
      />
    </div>
  );
}

function CustomForm({ resume, section }: { resume: Resume; section: Extract<Section, { type: 'custom' }> }) {
  const set = useSectionUpdater<Extract<Section, { type: 'custom' }>>(resume.id, section.id);
  return (
    <div className="form">
      <p className="field-help">Sección libre: sirve para voluntariado, publicaciones, hobbies, lo que quieras.</p>
      <ListEditor<CustomItem>
        items={section.items}
        onChange={(items) => set({ items })}
        makeItem={() => ({ id: uid(), heading: '', value: '', url: '' })}
        addLabel="Agregar ítem"
        renderItem={(item, patch) => (
          <div className="form-stack">
            <TextField label="Título" value={item.heading} onChange={(heading) => patch({ heading })} />
            <TextField label="URL (opcional)" value={item.url ?? ''} onChange={(url) => patch({ url })} />
            <TextArea label="Descripción" rows={3} value={item.value} onChange={(value) => patch({ value })} />
          </div>
        )}
      />
    </div>
  );
}

export function SectionForms({ resume, section }: { resume: Resume; section: Section }) {
  switch (section.type) {
    case 'basics':
      return <BasicsForm resume={resume} section={section} />;
    case 'summary':
      return <SummaryForm resume={resume} section={section} />;
    case 'experience':
      return <ExperienceForm resume={resume} section={section} />;
    case 'education':
      return <EducationForm resume={resume} section={section} />;
    case 'skills':
      return <SkillsForm resume={resume} section={section} />;
    case 'languages':
      return <LanguagesForm resume={resume} section={section} />;
    case 'projects':
      return <ProjectsForm resume={resume} section={section} />;
    case 'certificates':
      return <CertificatesForm resume={resume} section={section} />;
    case 'interests':
      return <InterestsForm resume={resume} section={section} />;
    case 'custom':
      return <CustomForm resume={resume} section={section} />;
  }
}
