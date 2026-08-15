import type { Resume, Section } from '../../types/resume';
import { DocHeader } from './shared';
import { SectionView } from './SectionView';

/** Plantilla Creativa: header con bloque de color de acento y títulos marcados. */
export function TemplateCreative({ resume }: { resume: Resume }) {
  const { theme } = resume;
  const visible = resume.sections.filter((s) => s.visible);
  const basics = visible.find((s): s is Extract<Section, { type: 'basics' }> => s.type === 'basics');
  const rest = visible.filter((s) => s.type !== 'basics');

  return (
    <div className="tpl tpl-creative">
      <header className="doc-header">
        <DocHeader basics={basics} theme={theme} />
      </header>
      {rest.map((s) => (
        <SectionView key={s.id} section={s} headerStyle={theme.headerStyle} />
      ))}
    </div>
  );
}
