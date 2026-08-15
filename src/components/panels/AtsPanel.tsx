import { useMemo } from 'react';
import { checkAts, SEVERITY_LABEL, type AtsSeverity } from '../../lib/ats';
import { useUiStore } from '../../store/uiStore';
import type { Resume } from '../../types/resume';
import { CheckIcon, XIcon } from '../ui/icons';

export function AtsPanel({ resume, pageOverflow }: { resume: Resume; pageOverflow: boolean }) {
  const setShowAtsPanel = useUiStore((s) => s.setShowAtsPanel);

  const issues = useMemo(() => {
    const list = checkAts(resume);
    if (pageOverflow) {
      list.push({
        id: 'ats-single-page',
        rule: 'single-page',
        severity: 'warning',
        message: 'El contenido se desborda la página A4. Un CV de una página se parsea y se lee mejor.',
      });
    }
    return list;
  }, [resume, pageOverflow]);

  const counts = issues.reduce<Record<AtsSeverity, number>>(
    (acc, i) => {
      acc[i.severity] += 1;
      return acc;
    },
    { error: 0, warning: 0, info: 0 },
  );

  return (
    <aside className="drawer">
      <div className="drawer-head">
        <h2>ATS Checker</h2>
        <button type="button" className="btn-icon" onClick={() => setShowAtsPanel(false)}>
          <XIcon />
        </button>
      </div>

      <div className="ats-summary">
        <span className="ats-count ats-count--error">{counts.error} errores</span>
        <span className="ats-count ats-count--warning">{counts.warning} advertencias</span>
        <span className="ats-count ats-count--info">{counts.info} info</span>
      </div>

      {issues.length === 0 ? (
        <p className="ats-ok">
          <CheckIcon width={14} height={14} />
          Todo en orden. Tu CV se va a parsear limpio.
        </p>
      ) : (
        <ul className="ats-list">
          {issues.map((issue) => (
            <li key={issue.id} className={`ats-item ats-item--${issue.severity}`}>
              <span className="ats-badge">{SEVERITY_LABEL[issue.severity]}</span>
              <span>{issue.message}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
