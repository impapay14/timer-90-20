// timer-core.jsx — shared timer state machine + visual tokens
// Exposes: useTimer(), TOKENS, formatTime

const TOKENS = {
  bg: '#0a0a0a',
  bgRest: '#0b1013',
  surface: '#111111',
  surfaceHi: '#161616',
  line: 'rgba(255,255,255,0.06)',
  lineHi: 'rgba(255,255,255,0.12)',
  dim: 'rgba(255,255,255,0.32)',
  mid: 'rgba(255,255,255,0.56)',
  fg: 'rgba(255,255,255,0.92)',
  // neon accents — same chroma tier, different hue
  neonFocus: 'oklch(0.88 0.17 130)',       // soft lime
  neonFocusDim: 'oklch(0.88 0.17 130 / 0.18)',
  neonRest: 'oklch(0.86 0.10 205)',        // soft cyan
  neonRestDim: 'oklch(0.86 0.10 205 / 0.18)',
  mono: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, Menlo, monospace',
  sans: '"Inter", -apple-system, "Segoe UI", system-ui, sans-serif',
};

const DURATIONS = {
  focus: 90 * 60,
  rest:  20 * 60,
};

function formatTime(sec) {
  sec = Math.max(0, Math.round(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// useTimer — single source of truth per timer instance.
// mode: 'focus' | 'rest'
// state: 'idle' | 'running' | 'paused' | 'done'
function useTimer() {
  const [mode, setMode] = React.useState('focus');
  const [state, setState] = React.useState('idle');
  const [remaining, setRemaining] = React.useState(DURATIONS.focus);
  const [sessions, setSessions] = React.useState(0);

  const total = DURATIONS[mode];
  const progress = 1 - remaining / total; // 0..1

  // tick
  React.useEffect(() => {
    if (state !== 'running') return;
    const start = performance.now();
    const from = remaining;
    let raf;
    const loop = () => {
      const elapsed = (performance.now() - start) / 1000;
      const next = from - elapsed;
      if (next <= 0) {
        setRemaining(0);
        setState('done');
        setSessions(s => mode === 'focus' ? s + 1 : s);
        return;
      }
      setRemaining(next);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [state, mode]);

  const start = () => {
    if (state === 'done') {
      setRemaining(DURATIONS[mode]);
    }
    setState('running');
  };
  const pause = () => setState('paused');
  const resume = () => setState('running');
  const reset = () => {
    setState('idle');
    setRemaining(DURATIONS[mode]);
  };
  const switchMode = (next) => {
    setMode(next);
    setState('idle');
    setRemaining(DURATIONS[next]);
  };
  const toggle = () => {
    if (state === 'running') pause();
    else if (state === 'paused') resume();
    else start();
  };

  // hotkeys
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space') { e.preventDefault(); toggle(); }
      if (e.key?.toLowerCase() === 'r') { e.preventDefault(); reset(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state, mode]);

  return {
    mode, state, remaining, total, progress, sessions,
    start, pause, resume, reset, switchMode, toggle,
    formatted: formatTime(remaining),
  };
}

Object.assign(window, { TOKENS, DURATIONS, formatTime, useTimer });
