import type { Resume, Section } from '../../types/resume';
import { DocHeader } from './shared';
import { SectionView } from './SectionView';

/** Plantilla Ejecutiva: sobria, títulos con barra de acento y header con doble línea. */
export function TemplateExecutive({ resume }: { resume: Resume }) {
  const { theme } = resume;
  const visible = resume.sections.filter((s) => s.visible);
  const basics = visible.find((s): s is Extract<Section, { type: 'basics' }> => s.type === 'basics');
  const rest = visible.filter((s) => s.type !== 'basics');

  return (
    <div className="tpl tpl-executive">
      <header className="doc-header">
        <DocHeader basics={basics} theme={theme} />
      </header>
      <div className="tpl-body" data-cols={theme.columns}>
        {rest.map((s) => (
          <SectionView key={s.id} section={s} headerStyle={theme.headerStyle} />
        ))}
      </div>
    </div>
  );
}
