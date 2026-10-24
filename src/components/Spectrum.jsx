import { useEffect, useMemo, useState } from 'react';
import { skillBands } from '../data';

const BAR_COUNT = 64;

// Deterministic pseudo-random so each band keeps the same "noise floor" between renders.
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildBars(band, bandIndex) {
  const rand = rng(bandIndex * 9973 + 17);
  const peaks = band.items.map((label, i) => ({ label, pos: (i + 0.5) / band.items.length }));
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
    const x = (i + 0.5) / BAR_COUNT;
    let h = 6 + rand() * 12;
    for (const p of peaks) {
      const d = (x - p.pos) * band.items.length * 4.2;
      h += (62 + rand() * 18) * Math.exp(-d * d);
    }
    return {
      h: Math.min(96, h),
      dur: 0.5 + rand() * 0.9,
      delay: -rand() * 2,
    };
  });
  return { bars, peaks };
}

export default function Spectrum() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(null);
  const band = skillBands[active];
  const { bars, peaks } = useMemo(() => buildBars(band, active), [band, active]);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setActive((a) => (a + 1) % skillBands.length), 5500);
    return () => clearInterval(id);
  }, [auto]);

  const select = (i) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <div className="spectrum panel">
      <div className="panel__head">
        <span>
          <span className="dot dot--live" /> SPECTRUM ANALYZER
        </span>
        <span className="muted">
          {band.freq} · {auto ? 'auto-scan' : 'locked'}
        </span>
      </div>

      <div className="spectrum__tabs" role="tablist">
        {skillBands.map((b, i) => (
          <button key={b.id} role="tab" aria-selected={i === active} className={i === active ? 'is-active' : ''} onClick={() => select(i)}>
            {b.label}
          </button>
        ))}
      </div>

      <div className="spectrum__screen" key={band.id}>
        <div className="spectrum__grid" aria-hidden="true" />
        <div className="spectrum__bars" aria-hidden="true">
          {bars.map((b, i) => (
            <i
              key={i}
              style={{ '--h': `${b.h}%`, animationDuration: `${b.dur}s, 0.7s`, animationDelay: `${b.delay}s, ${i * 8}ms` }}
            />
          ))}
        </div>
        {peaks.map((p, i) => (
          <div
            key={p.label}
            className={`spectrum__peak ${i % 2 ? 'spectrum__peak--alt' : ''} ${hover === i ? 'is-hover' : ''}`}
            style={{ left: `${p.pos * 100}%`, animationDelay: `${i * 70}ms` }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="spectrum__marker">▼</span>
            <span className="spectrum__label">{p.label}</span>
          </div>
        ))}
      </div>

      <ul className="sr-only">
        {band.items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
