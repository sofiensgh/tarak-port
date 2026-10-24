import { useState } from 'react';
import { experience } from '../data';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

function Site({ item, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <Reveal as="article" className={`site ${open ? 'is-open' : ''}`} delay={60}>
      <div className="site__node" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 5 7 21M12 5l5 16M9 15h6M10 11h4" />
          <circle cx="12" cy="4" r="1.6" />
        </svg>
        <span className="site__ripple" />
      </div>

      <div className="site__card panel">
        <button className="site__head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <div>
            <div className="site__meta">
              <span className="chip chip--ch">{item.channel}</span>
              {item.live && (
                <span className="chip chip--live">
                  <span className="dot dot--live" /> ON AIR
                </span>
              )}
              <span className="muted mono">{item.period}</span>
            </div>
            <h3>{item.title}</h3>
            <div className="site__role">
              {item.role} <span className="muted">· {item.org}</span>
            </div>
          </div>
          <span className="site__toggle" aria-hidden="true">
            {open ? '−' : '+'}
          </span>
        </button>

        <div className="site__body">
          <div className="site__inner">
            {item.metrics && (
              <div className="site__metrics">
                {item.metrics.map((mt) => (
                  <div key={mt.l} className="metric">
                    <strong>{mt.v}</strong>
                    <span>{mt.l}</span>
                  </div>
                ))}
              </div>
            )}
            <ul>
              {item.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="site__tags">
          {item.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="section">
      <SectionTitle kicker="// FIELD LOG" title="Sites on the route">
        Each stop is a project along the drive route. Click a site to expand its log.
      </SectionTitle>
      <div className="route">
        <div className="route__line" aria-hidden="true">
          <span className="route__packet" />
        </div>
        {experience.map((item, i) => (
          <Site key={item.channel} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
