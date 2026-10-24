import { useEffect, useState } from 'react';
import { useLiveSignal } from '../hooks/useLiveSignal';
import { rsrpBars, rsrpColor } from '../lib/signal';

const LINKS = [
  ['profile', 'Profile'],
  ['experience', 'Experience'],
  ['skills', 'Spectrum'],
  ['more', 'Background'],
  ['contact', 'Contact'],
];

export default function StatusBar() {
  const { m } = useLiveSignal();
  const [time, setTime] = useState(() => new Date());
  const [active, setActive] = useState('profile');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    LINKS.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const bars = m ? rsrpBars(m.rsrp) : 0;

  return (
    <header className="statusbar">
      <a href="#profile" className="statusbar__brand" aria-label="Back to top">
        <span className="brand-mark">TM</span>
        <span className="statusbar__op">TELCOTEC · NR</span>
      </a>

      <nav className={`statusbar__nav ${open ? 'is-open' : ''}`}>
        {LINKS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>

      <div className="statusbar__right">
        <span className="tech-badge">5G</span>
        <span className="sigbars" title={m ? `RSRP ${m.rsrp.toFixed(0)} dBm` : 'Searching…'}>
          {[1, 2, 3, 4].map((i) => (
            <i key={i} style={{ height: `${i * 25}%`, background: i <= bars ? rsrpColor(m.rsrp) : undefined }} />
          ))}
        </span>
        <span className="statusbar__clock">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <button className="statusbar__menu" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
