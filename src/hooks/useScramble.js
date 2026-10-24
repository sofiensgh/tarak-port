import { useEffect, useState } from 'react';

const GLYPHS = '01<>/|=+*#%@ΔΣΩλμ';
const FRAME_MS = 33;

// Resolves text left-to-right out of random glyphs, like a receiver locking on.
export function useScramble(text, start = true, duration = 1200) {
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!start) return;
    const t0 = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - t0) / duration);
      const locked = Math.floor(p * text.length);
      setOut(
        text
          .split('')
          .map((ch, i) => (i < locked || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join(''),
      );
      if (p >= 1) clearInterval(id);
    }, FRAME_MS);
    return () => clearInterval(id);
  }, [text, start, duration]);

  return out;
}
