import { radarTargets } from '../data';

const SWEEP_SECONDS = 4.5;

export default function Radar() {
  return (
    <div className="radar-wrap panel">
      <div className="panel__head">
        <span>
          <span className="dot dot--live" /> ENVIRONMENT SCAN
        </span>
        <span className="muted">vendors · operators · tools</span>
      </div>

      <div className="radar" style={{ '--sweep': `${SWEEP_SECONDS}s` }}>
        <div className="radar__rings" aria-hidden="true" />
        <div className="radar__sweep" aria-hidden="true" />
        {radarTargets.map((t) => {
          const rad = (t.angle * Math.PI) / 180;
          const x = 50 + Math.sin(rad) * t.r * 50;
          const y = 50 - Math.cos(rad) * t.r * 50;
          return (
            <div
              key={t.label}
              className={`blip blip--${t.kind}`}
              style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(t.angle / 360) * SWEEP_SECONDS}s` }}
            >
              <span className="blip__dot" />
              <span className="blip__label">{t.label}</span>
            </div>
          );
        })}
      </div>

      <div className="radar__legend">
        <span>
          <i className="blip--vendor" /> Vendor
        </span>
        <span>
          <i className="blip--operator" /> Operator
        </span>
        <span>
          <i className="blip--tool" /> Tool
        </span>
      </div>
    </div>
  );
}
