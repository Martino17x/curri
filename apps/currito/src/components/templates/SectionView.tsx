import type { Section } from '../../types/resume';
import type { HeaderStyle } from '../../types/theme';
import { formatDateRef } from '../../lib/dates';
import { isSectionEmpty } from '../../data/defaults';
import { Bullets, DateRange, InlineList, SectionTitle, TextValue } from './shared';

function certDate(value: string): string {
  if (!value) return '';
  const [year, month] = value.split('-');
  if (!month) return year;
  const names = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const m = Number(month);
  return `${names[m] ?? month} ${year}`;
}

export function SectionView({
  section,
  headerStyle,
  forceRender,
}: {
  section: Section;
  headerStyle: HeaderStyle;
  /** Muestra la sección aunque esté vacía (solo modo edición del preview). */
  forceRender?: boolean;
}) {
  if (forceRender && isSectionEmpty(section)) {
    return (
      <section className="sec sec--empty">
        <SectionTitle style={headerStyle}>{section.title}</SectionTitle>
        <div className="sec-empty-hint">Sección vacía — agregá contenido</div>
      </section>
    );
  }

  switch (section.type) {
    case 'basics':
      return null;

    case 'summary': {
      if (!section.text.trim()) return null;
      return (
        <section className="sec">
          <SectionTitle style={headerStyle}>{section.title}</SectionTitle>
          <TextValue>{section.text}</TextValue>
        </section>
      );
    }

    case 'experience': {
      const items = section.items.filter((i) => i.position || i.company || i.summary || i.highlights.length);
      if (!items.length) return null;
      return (
        <section className="sec">
          <SectionTitle style={headerStyle}>{section.title}</SectionTitle>
          {items.map((item) => (
            <article className="entry" key={item.id}>
              <div className="entry-head">
                <div className="entry-main">
                  <h3 className="entry-title">{item.position}</h3>
                  <div className="entry-sub">
                    {item.company}
                    {item.location ? ` · ${item.location}` : ''}
                  </div>
                </div>
                <DateRange start={item.start} end={item.end} current={item.current} />
              </div>
              <TextValue>{item.summary}</TextValue>
              <Bullets items={item.highlights} />
            </article>
          ))}
        </section>
      );
    }

    case 'education': {
      const items = section.items.filter((i) => i.degree || i.institution || i.description);
      if (!items.length) return null;
      return (
        <section className="sec">
          <SectionTitle style={headerStyle}>{section.title}</SectionTitle>
          {items.map((item) => (
            <article className="entry" key={item.id}>
              <div className="entry-head">
                <div className="entry-main">
                  <h3 className="entry-title">{item.degree}</h3>
                  <div className="entry-sub">
                    {item.institution}
                    {item.location ? ` · ${item.location}` : ''}
                  </div>
                </div>
                <DateRange start={item.start} end={item.end} current={item.current} />
              </div>
              <TextValue>{item.description}</TextValue>
            </article>
          ))}
        </section>
      );
    }

    case 'skills': {
      const groups = section.groups.filter((g) => g.name.trim() || g.keywords.length);
      if (!groups.length) return null;
      return (
        <section className="sec">
          <SectionTitle style={headerStyle}>{section.title}</SectionTitle>
          {groups.map((g) => (
            <div className="skill-group" key={g.id}>
              {g.name.trim() && <span className="skill-name">{g.name}: </span>}
              <span className="skill-kws">
                {g.keywords.map((k) => k.trim()).filter(Boolean).join(', ')}
              </span>
            </div>
          ))}
        </section>
      );
    }

    case 'languages': {
      const items = section.items.filter((i) => i.language.trim() || i.level.trim());
      if (!items.length) return null;
      return (
        <section className="sec">
          <SectionTitle style={headerStyle}>{section.title}</SectionTitle>
          {items.map((item) => (
            <div className="lang-row" key={item.id}>
              <span>{item.language}</span>
              <span className="entry-sub">{item.level}</span>
            </div>
          ))}
        </section>
      );
    }

    case 'projects': {
      const items = section.items.filter((i) => i.name || i.summary || i.highlights.length);
      if (!items.length) return null;
      return (
        <section className="sec">
          <SectionTitle style={headerStyle}>{section.title}</SectionTitle>
          {items.map((item) => (
            <article className="entry" key={item.id}>
              <div className="entry-head">
                <div className="entry-main">
                  <h3 className="entry-title">
                    {item.url ? (
                      <a className="entry-link" href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )}
                  </h3>
                </div>
                <DateRange start={item.start} end={item.end} current={item.current} />
              </div>
              <TextValue>{item.summary}</TextValue>
              <Bullets items={item.highlights} />
            </article>
          ))}
        </section>
      );
    }

    case 'certificates': {
      const items = section.items.filter((i) => i.name.trim() || i.issuer.trim());
      if (!items.length) return null;
      return (
        <section className="sec">
          <SectionTitle style={headerStyle}>{section.title}</SectionTitle>
          {items.map((item) => (
            <div className="cert-row" key={item.id}>
              <span className="cert-name">{item.name}</span>
              <span className="entry-sub">
                {[item.issuer.trim(), certDate(item.date)].filter(Boolean).join(' · ')}
              </span>
            </div>
          ))}
        </section>
      );
    }

    case 'interests': {
      if (!section.items.length) return null;
      return (
        <section className="sec">
          <SectionTitle style={headerStyle}>{section.title}</SectionTitle>
          <InlineList items={section.items} sep=", " />
        </section>
      );
    }

    case 'custom': {
      const items = section.items.filter((i) => i.heading.trim() || i.value.trim());
      if (!items.length) return null;
      return (
        <section className="sec">
          <SectionTitle style={headerStyle}>{section.title}</SectionTitle>
          {items.map((item) => (
            <article className="entry" key={item.id}>
              <h3 className="entry-title">
                {item.url ? (
                  <a className="entry-link" href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.heading}
                  </a>
                ) : (
                  item.heading
                )}
              </h3>
              <TextValue>{item.value}</TextValue>
            </article>
          ))}
        </section>
      );
    }
  }
}

export { formatDateRef };
