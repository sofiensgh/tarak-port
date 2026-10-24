// Tiny pub/sub so the background drive-test UE can feed live readings to the UI.
const listeners = new Set();
let last = null;

export function publish(measurement) {
  last = measurement;
  listeners.forEach((fn) => fn(measurement));
}

export function subscribe(fn) {
  listeners.add(fn);
  if (last) fn(last);
  return () => listeners.delete(fn);
}

// Classic drive-test RSRP legend: good / fair / poor.
export function rsrpRgb(rsrp) {
  if (rsrp >= -85) return '52, 211, 153';
  if (rsrp >= -100) return '251, 191, 36';
  return '248, 113, 113';
}

export function rsrpColor(rsrp) {
  return `rgb(${rsrpRgb(rsrp)})`;
}

export function rsrpBars(rsrp) {
  if (rsrp >= -80) return 4;
  if (rsrp >= -90) return 3;
  if (rsrp >= -100) return 2;
  return 1;
}
