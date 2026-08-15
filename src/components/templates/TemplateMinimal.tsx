import type { Resume, Section } from '../../types/resume';
import { ContactLine, docVars } from './shared';
import { SectionView } from './SectionView';

export function TemplateMinimal({ resume }: { resume: Resume }) {
  const { theme } = resume;
  const visible = resume.sections.filter((s) => s.visible);
  const basics = visible.find((s): s is Extract<Section, { type: 'basics' }> => s.type === 'basics');
  const rest = visible.filter((s) => s.type !== 'basics');

  return (
    <div className="tpl tpl-minimal" style={docVars(theme)}>
      <header className="doc-header">
        <h1 className={`doc-name ${theme.nameUppercase ? 'doc-name--upper' : ''}`}>
          {basics?.fields.name}
        </h1>
        {basics?.fields.label && <div className="doc-label">{basics.fields.label}</div>}
        <ContactLine basics={basics} theme={theme} />
      </header>
      {rest.map((s) => (
        <SectionView key={s.id} section={s} headerStyle={theme.headerStyle} />
      ))}
    </div>
  );
}
