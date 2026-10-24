import { useEffect, useState } from 'react';

const LINES = [
  '> Powering on UE ............................ OK',
  '> Cell search · PSS/SSS detected · PCI 214',
  '> MIB / SIB1 decoded · n78 · 3500 MHz',
  '> RRC Setup Request → RRC Setup Complete',
  '> Registration Accept · 5G SA',
  '> PDU session established ✓  Welcome.',
];

export default function BootSequence({ onDone }) {
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (shown < LINES.length) {
      const id = setTimeout(() => setShown((n) => n + 1), 260);
      return () => clearTimeout(id);
    }
    const out = setTimeout(() => setLeaving(true), 450);
    const done = setTimeout(onDone, 1050);
    return () => {
      clearTimeout(out);
      clearTimeout(done);
    };
  }, [shown, onDone]);

  return (
    <div className={`boot ${leaving ? 'boot--leaving' : ''}`} onClick={onDone} role="status" aria-live="polite">
      <div className="boot__panel">
        <div className="boot__head">
          <span className="dot dot--live" /> UE ATTACH PROCEDURE
        </div>
        {LINES.slice(0, shown).map((l) => (
          <div key={l} className="boot__line">
            {l}
          </div>
        ))}
        <div className="boot__bar">
          <span style={{ width: `${(shown / LINES.length) * 100}%` }} />
        </div>
        <div className="boot__skip">click to skip</div>
      </div>
    </div>
  );
}
