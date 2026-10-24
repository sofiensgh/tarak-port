import { useEffect, useState } from 'react';
import { stats } from '../data';
import { useInView } from '../hooks/useInView';

function Counter({ value, run }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!run) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 1600);
      setN(Math.round(value * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, run]);

  return n;
}

export default function Stats() {
  const [ref, inView] = useInView(0.3);

  return (
    <section id="stats" className="stats" ref={ref}>
      {stats.map((s, i) => (
        <div key={s.label} className={`stat panel reveal ${inView ? 'is-visible' : ''}`} style={{ transitionDelay: `${i * 90}ms` }}>
          <div className="stat__value">
            <Counter value={s.value} run={inView} />
            <span>{s.suffix}</span>
          </div>
          <div className="stat__label">{s.label}</div>
          <div className="stat__sub">{s.sub}</div>
        </div>
      ))}
    </section>
  );
}
