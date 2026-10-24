import { useEffect, useRef } from 'react';
import { publish, rsrpRgb } from '../lib/signal';

const BANDS = ['n78', 'n78', 'B3', 'B7', 'B20'];
const HYSTERESIS_DB = 3;
const TRAIL_MAX = 320;

// Simple log-distance path loss + slow "shadow fading" so the map feels alive.
function rsrpAt(tower, x, y, spacing, t) {
  const d = Math.hypot(tower.x - x, tower.y - y);
  const pathLoss = 50 * Math.log10(1 + (4 * d) / spacing);
  const fading = 4 * Math.sin(t * 0.0011 + tower.seed * 7) + 2.5 * Math.sin(t * 0.0037 + tower.seed * 13);
  return Math.max(-125, -62 - pathLoss + fading);
}

function buildTowers(w, h) {
  const spacing = Math.max(190, Math.min(w, h) / 3);
  const towers = [];
  let id = 0;
  for (let row = 0, y = spacing * 0.35; y < h + spacing * 0.5; row++, y += spacing * 0.866) {
    for (let x = row % 2 ? spacing / 2 : 0; x < w + spacing * 0.5; x += spacing) {
      id++;
      // Leave a few holes in the grid so the drive test finds weak coverage.
      if ((id * 7919) % 100 < 14) continue;
      const seed = ((id * 9301 + 49297) % 233280) / 233280;
      towers.push({
        x: x + (seed - 0.5) * spacing * 0.35,
        y: y + (((seed * 7) % 1) - 0.5) * spacing * 0.35,
        pci: 100 + ((id * 37) % 400),
        band: BANDS[id % BANDS.length],
        seed,
        period: 2.6 + seed * 1.8,
        rsrp: -140,
      });
    }
  }
  return { towers, spacing };
}

export default function NetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeScale = reduceMotion ? 0.2 : 1;

    let w = 0;
    let h = 0;
    let towers = [];
    let spacing = 200;
    let raf = 0;
    let lastPublish = 0;
    let lastTrail = 0;
    let hoCount = 0;

    const ue = { x: 0, y: 0, serving: null, trail: [], ho: null };
    const pointer = { x: 0, y: 0, active: false };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const prevW = w;
      const prevH = h;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Mobile address bars nudge the height while scrolling; only re-plan the network on real changes.
      if (w !== prevW || Math.abs(h - prevH) > 140) {
        ({ towers, spacing } = buildTowers(w, h));
        ue.serving = null;
        ue.trail = [];
      }
    }

    function drawTower(tw, highlight) {
      const { x, y } = tw;
      ctx.strokeStyle = highlight ? 'rgba(34, 211, 238, 0.95)' : 'rgba(125, 211, 252, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y - 9);
      ctx.lineTo(x - 5, y + 7);
      ctx.moveTo(x, y - 9);
      ctx.lineTo(x + 5, y + 7);
      ctx.moveTo(x - 3, y + 1);
      ctx.lineTo(x + 3, y + 1);
      ctx.stroke();
      ctx.fillStyle = highlight ? '#34d399' : 'rgba(34, 211, 238, 0.8)';
      ctx.beginPath();
      ctx.arc(x, y - 10, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = highlight ? 'rgba(216, 230, 243, 0.85)' : 'rgba(127, 149, 171, 0.45)';
      ctx.fillText(`PCI ${tw.pci} · ${tw.band}`, x + 9, y + 4);
    }

    function frame(now) {
      const t = now * timeScale;
      ctx.clearRect(0, 0, w, h);

      // Drive-test route: a slow Lissajous sweep across the whole viewport.
      const ts = t / 1000;
      ue.x = w / 2 + w * 0.42 * Math.sin(ts * 0.09);
      ue.y = h / 2 + h * 0.38 * Math.sin(ts * 0.14 + 1.2);

      let best = null;
      for (const tw of towers) {
        tw.rsrp = rsrpAt(tw, ue.x, ue.y, spacing, t);
        if (!best || tw.rsrp > best.rsrp) best = tw;
      }
      if (!best) {
        raf = requestAnimationFrame(frame);
        return;
      }
      if (!ue.serving) ue.serving = best;
      else if (best !== ue.serving && best.rsrp > ue.serving.rsrp + HYSTERESIS_DB) {
        ue.ho = { from: ue.serving.pci, to: best.pci, at: now, x: ue.x, y: ue.y };
        ue.serving = best;
        hoCount++;
      }

      let interferer = -140;
      for (const tw of towers) if (tw !== ue.serving && tw.rsrp > interferer) interferer = tw.rsrp;
      const rsrp = ue.serving.rsrp;
      const sinr = Math.max(-5, Math.min(30, rsrp - interferer + 2 * Math.sin(t * 0.005)));
      const quality = (sinr + 5) / 35;
      const rsrq = -3 - 16 * (1 - quality);
      const dl = Math.max(2, 950 * quality ** 1.6 * (rsrp > -100 ? 1 : 0.5) + 25 * Math.sin(t * 0.007));

      // Coverage glow + propagating wavefronts.
      for (const tw of towers) {
        const glow = ctx.createRadialGradient(tw.x, tw.y, 0, tw.x, tw.y, spacing * 0.6);
        glow.addColorStop(0, 'rgba(34, 211, 238, 0.07)');
        glow.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(tw.x - spacing * 0.6, tw.y - spacing * 0.6, spacing * 1.2, spacing * 1.2);

        for (let k = 0; k < 2; k++) {
          const p = (t / 1000 / tw.period + tw.seed + k * 0.5) % 1;
          ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - p) * 0.28})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(tw.x, tw.y, 6 + p * spacing * 0.75, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Pointer acts as a second UE that attaches to its nearest cell.
      let pointerCell = null;
      if (pointer.active) {
        let bestD = Infinity;
        for (const tw of towers) {
          const d = Math.hypot(tw.x - pointer.x, tw.y - pointer.y);
          if (d < bestD) {
            bestD = d;
            pointerCell = tw;
          }
        }
        if (pointerCell) {
          ctx.setLineDash([2, 5]);
          ctx.lineDashOffset = -t / 40;
          ctx.strokeStyle = 'rgba(167, 139, 250, 0.55)';
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(pointerCell.x, pointerCell.y - 10);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.strokeStyle = 'rgba(167, 139, 250, 0.5)';
          ctx.beginPath();
          ctx.arc(pointer.x, pointer.y, 5 + 3 * Math.sin(t / 200), 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      for (const tw of towers) drawTower(tw, tw === ue.serving || tw === pointerCell);

      // RSRP-coloured drive-test trail.
      if (now - lastTrail > 70) {
        ue.trail.push({ x: ue.x, y: ue.y, rgb: rsrpRgb(rsrp) });
        if (ue.trail.length > TRAIL_MAX) ue.trail.shift();
        lastTrail = now;
      }
      ue.trail.forEach((pt, i) => {
        ctx.fillStyle = `rgba(${pt.rgb}, ${(i / ue.trail.length) * 0.75})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Serving-cell link.
      const srv = ue.serving;
      ctx.setLineDash([6, 6]);
      ctx.lineDashOffset = -t / 30;
      ctx.strokeStyle = `rgba(${rsrpRgb(rsrp)}, 0.6)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(ue.x, ue.y);
      ctx.lineTo(srv.x, srv.y - 10);
      ctx.stroke();
      ctx.setLineDash([]);

      // The test vehicle.
      const pulse = (t / 900) % 1;
      ctx.strokeStyle = `rgba(${rsrpRgb(rsrp)}, ${1 - pulse})`;
      ctx.beginPath();
      ctx.arc(ue.x, ue.y, 6 + pulse * 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#e6f6ff';
      ctx.beginPath();
      ctx.arc(ue.x, ue.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(216, 230, 243, 0.75)';
      ctx.fillText(`UE · ${rsrp.toFixed(0)} dBm`, ue.x + 10, ue.y - 10);

      // Handover event marker.
      if (ue.ho) {
        const age = (now - ue.ho.at) / 2200;
        if (age < 1) {
          ctx.fillStyle = `rgba(167, 139, 250, ${1 - age})`;
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillText(`HO ${ue.ho.from} → ${ue.ho.to}`, ue.ho.x + 10, ue.ho.y + 18 + age * 10);
          ctx.strokeStyle = `rgba(167, 139, 250, ${1 - age})`;
          ctx.beginPath();
          ctx.arc(ue.ho.x, ue.ho.y, 8 + age * 30, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      if (now - lastPublish > 250) {
        lastPublish = now;
        publish({ rsrp, rsrq, sinr, dl, pci: srv.pci, band: srv.band, hoCount });
      }

      raf = requestAnimationFrame(frame);
    }

    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = e.pointerType === 'mouse';
    };
    const onLeave = () => {
      pointer.active = false;
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="network-bg" aria-hidden="true" />;
}
