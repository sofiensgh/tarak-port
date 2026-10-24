import { education, languages, leadership } from '../data';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

export default function More() {
  return (
    <section id="more" className="section">
      <SectionTitle kicker="// CORE NETWORK" title="Background" />
      <div className="more-grid">
        <Reveal className="panel card">
          <div className="card__kicker">EDUCATION · {education.period}</div>
          <h3>{education.degree}</h3>
          <div className="muted">{education.school}</div>
          <p>{education.note}</p>
        </Reveal>

        <Reveal className="panel card" delay={100}>
          <div className="card__kicker">LANGUAGES · LINK QUALITY</div>
          <ul className="langs">
            {languages.map((l) => (
              <li key={l.name}>
                <div>
                  <strong>{l.name}</strong>
                  <span className="muted">{l.level}</span>
                </div>
                <span className="sigbars sigbars--lg" aria-label={`${l.bars} of 5 bars`}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i key={i} className={i <= l.bars ? 'is-on' : ''} style={{ height: `${i * 20}%` }} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="panel card" delay={200}>
          <div className="card__kicker">LEADERSHIP · {leadership.period}</div>
          <h3>{leadership.title}</h3>
          <div className="muted">{leadership.org}</div>
          <ul className="card__list">
            {leadership.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
