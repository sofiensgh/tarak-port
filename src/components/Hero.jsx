import { useEffect, useState } from 'react';
import { profile } from '../data';
import { useScramble } from '../hooks/useScramble';
import SignalMeter from './SignalMeter';

function Rotator({ words }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[i];
    let delay = deleting ? 28 : 55;
    if (!deleting && text === word) delay = 1800;
    const id = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === '') {
        setDeleting(false);
        setI((n) => (n + 1) % words.length);
      } else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(id);
  }, [text, deleting, i, words]);

  return (
    <span className="rotator">
      {text}
      <span className="caret" />
    </span>
  );
}

export default function Hero({ ready }) {
  const name = useScramble(profile.name.toUpperCase(), ready, 1300);

  return (
    <section id="profile" className="hero section">
      <div className="hero__copy">
        <div className="eyebrow">
          <span className="dot dot--live" /> Signal acquired · {profile.location}
        </div>
        <h1 className="hero__name" aria-label={profile.name}>
          {name}
        </h1>
        <div className="hero__role">
          {profile.role} <span className="sep">|</span> <span className="accent">{profile.focus}</span>
        </div>
        <div className="hero__rotate">
          <span className="mono muted">&gt; now transmitting: </span>
          <Rotator words={profile.rotating} />
        </div>
        <p className="hero__summary">{profile.summary}</p>
        <div className="hero__cta">
          <a href="#contact" className="btn btn--primary">
            Establish connection
          </a>
          <a href="#experience" className="btn">
            View field log
          </a>
          <a href={profile.cv} className="btn btn--ghost" download>
            ↓ CV
          </a>
        </div>
      </div>
      <SignalMeter />
      <a href="#stats" className="scroll-cue" aria-label="Scroll down">
        <span />
      </a>
    </section>
  );
}
