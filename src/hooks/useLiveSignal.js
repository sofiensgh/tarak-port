import { useEffect, useState } from 'react';
import { subscribe } from '../lib/signal';

export function useLiveSignal(historySize = 0) {
  const [state, setState] = useState({ m: null, history: [] });

  useEffect(
    () =>
      subscribe((m) =>
        setState((prev) => ({
          m,
          history: historySize ? [...prev.history, m.rsrp].slice(-historySize) : prev.history,
        })),
      ),
    [historySize],
  );

  return state;
}
