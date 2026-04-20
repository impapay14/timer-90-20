// progress-bar.jsx — 90 (or 20) tiny vertical ticks.
// Each tick is one minute. Elapsed ticks glow with the active neon.
// Fractional tick fades in smoothly.

function TickBar({ progress, mode, total, width = 520, variant = 'default' }) {
  // one tick per minute
  const count = Math.round(total / 60);
  const neon = mode === 'focus' ? TOKENS.neonFocus : TOKENS.neonRest;
  const filled = progress * count;

  const tickHeight = variant === 'tall' ? 24 : 14;
  const tickW = variant === 'tall' ? 2 : 1.5;

  return (
    <div
      aria-label="progress"
      style={{
        width,
        display: 'grid',
        gridTemplateColumns: `repeat(${count}, 1fr)`,
        gap: 0,
        height: tickHeight,
        alignItems: 'center',
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        let alpha;
        if (i + 1 <= filled) alpha = 1;
        else if (i < filled) alpha = filled - i; // fractional active tick
        else alpha = 0;
        const isActive = i < filled && i + 1 > filled;
        return (
          <div key={i} style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <div style={{
              width: tickW,
              height: tickHeight,
              background: alpha > 0
                ? neon
                : 'rgba(255,255,255,0.10)',
              opacity: alpha > 0 ? (0.25 + 0.75 * alpha) : 1,
              boxShadow: isActive ? `0 0 8px ${neon}` : 'none',
              transition: 'background 600ms ease, opacity 600ms ease, box-shadow 600ms ease',
            }}/>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { TickBar });
