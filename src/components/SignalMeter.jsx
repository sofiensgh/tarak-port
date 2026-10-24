import { useLiveSignal } from '../hooks/useLiveSignal';
import { rsrpColor } from '../lib/signal';

const HISTORY = 60;

function Sparkline({ values }) {
  if (values.length < 2) return <svg className="spark" viewBox="0 0 300 70" />;
  const norm = (v) => 66 - ((Math.min(-60, Math.max(-120, v)) + 120) / 60) * 62;
  const pts = values.map((v, i) => `${(i / (HISTORY - 1)) * 300},${norm(v).toFixed(1)}`).join(' ');
  const last = values[values.length - 1];
  return (
    <svg className="spark" viewBox="0 0 300 70" preserveAspectRatio="none">
      <line x1="0" x2="300" y1={norm(-85)} y2={norm(-85)} className="spark__thr" />
      <line x1="0" x2="300" y1={norm(-100)} y2={norm(-100)} className="spark__thr" />
      <polyline points={`0,70 ${pts} ${((values.length - 1) / (HISTORY - 1)) * 300},70`} className="spark__area" />
      <polyline points={pts} className="spark__line" style={{ stroke: rsrpColor(last) }} />
    </svg>
  );
}

function Kpi({ label, value, unit, pct, color }) {
  return (
    <div className="kpi">
      <div className="kpi__label">{label}</div>
      <div className="kpi__value" style={{ color }}>
        {value}
        <small>{unit}</small>
      </div>
      <div className="kpi__track">
        <span style={{ width: `${Math.max(4, Math.min(100, pct))}%`, background: color }} />
      </div>
    </div>
  );
}

export default function SignalMeter() {
  const { m, history } = useLiveSignal(HISTORY);

  return (
    <div className="meter panel">
      <div className="panel__head">
        <span>
          <span className="dot dot--live" /> LIVE DRIVE-TEST UE
        </span>
        <span className="muted">{m ? `PCI ${m.pci} · ${m.band}` : 'searching…'}</span>
      </div>

      {m && (
        <>
          <div className="meter__grid">
            <Kpi label="RSRP" value={m.rsrp.toFixed(1)} unit="dBm" pct={((m.rsrp + 125) / 65) * 100} color={rsrpColor(m.rsrp)} />
            <Kpi label="RSRQ" value={m.rsrq.toFixed(1)} unit="dB" pct={((m.rsrq + 20) / 17) * 100} color="var(--cyan)" />
            <Kpi label="SINR" value={m.sinr.toFixed(1)} unit="dB" pct={((m.sinr + 5) / 35) * 100} color="var(--violet)" />
            <Kpi label="DL Thp" value={m.dl.toFixed(0)} unit="Mbps" pct={(m.dl / 1000) * 100} color="var(--green)" />
          </div>
          <Sparkline values={history} />
          <div className="meter__foot">
            <span>RSRP trace · last 15 s</span>
            <span>Handovers: {m.hoCount}</span>
          </div>
        </>
      )}
      <p className="meter__hint">These values come from the test vehicle driving through the background network. Move your cursor to attach your own UE.</p>
    </div>
  );
}
