// variant-c.jsx — Ultra-minimal. Numerals fill most of canvas.
// Controls hide until hover. Mode switch is subtle text. Progress sits at very bottom.

function VariantC() {
  const t = useTimer();
  const neon = t.mode === 'focus' ? TOKENS.neonFocus : TOKENS.neonRest;
  const [hover, setHover] = React.useState(false);

  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{
        width: '100%', height: '100%',
        background: t.state === 'done'
          ? (t.mode === 'focus' ? '#0d120a' : '#08121a')
          : TOKENS.bg,
        color: TOKENS.fg,
        fontFamily: TOKENS.mono,
        display: 'flex',
        flexDirection: 'column',
        transition: 'background 1400ms ease',
        position: 'relative',
        padding: '40px 48px 36px',
        boxSizing: 'border-box',
      }}
    >
      {/* top: mode labels */}
      <div style={{
        display: 'flex', gap: 28,
        fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
      }}>
        <ModeWord active={t.mode === 'focus'} neon={TOKENS.neonFocus} disabled={t.state==='running'}
          onClick={()=>t.switchMode('focus')}>Focus</ModeWord>
        <ModeWord active={t.mode === 'rest'} neon={TOKENS.neonRest} disabled={t.state==='running'}
          onClick={()=>t.switchMode('rest')}>Rest</ModeWord>
        <div style={{ marginLeft: 'auto', color: TOKENS.dim, display: 'flex', gap: 18 }}>
          <span>{String(t.sessions).padStart(2,'0')} / day</span>
        </div>
      </div>

      {/* Huge numerals — bleed */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        <div style={{
          fontSize: 260,
          fontWeight: 200,
          letterSpacing: '-0.07em',
          lineHeight: 0.9,
          fontVariantNumeric: 'tabular-nums',
          color: t.state === 'idle' ? 'rgba(255,255,255,0.48)' : TOKENS.fg,
          transition: 'color 800ms ease',
          userSelect: 'none',
        }}>
          {t.formatted}
        </div>
      </div>

      {/* controls row — reveal on hover */}
      <div style={{
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 24,
        opacity: hover || t.state === 'idle' || t.state === 'paused' ? 1 : 0.18,
        transition: 'opacity 600ms ease',
      }}>
        <div style={{ display: 'flex', gap: 18 }}>
          <MinButton neon={neon} onClick={t.toggle} primary>
            {t.state === 'running' ? 'pause' : t.state === 'paused' ? 'resume' : 'start'}
          </MinButton>
          <MinButton onClick={t.reset}>reset</MinButton>
        </div>
        <div style={{
          fontSize: 9, color: TOKENS.dim,
          letterSpacing: '0.2em', textTransform: 'uppercase',
        }}>
          space · r
        </div>
      </div>

      {/* Bottom: tick bar — full width */}
      <div style={{ marginTop: 28 }}>
        <TickBar progress={t.progress} mode={t.mode} total={t.total} width="100%" />
      </div>
    </div>
  );
}

function ModeWord({ active, neon, onClick, disabled, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        background: 'transparent', border: 'none', padding: 0,
        color: active ? neon : TOKENS.dim,
        fontFamily: TOKENS.mono,
        fontSize: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled && !active ? 0.4 : 1,
        transition: 'color 400ms ease, opacity 400ms ease',
      }}>
      {active ? '●  ' : '○  '}{children}
    </button>
  );
}

function MinButton({ children, onClick, primary, neon }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        background: 'transparent',
        color: primary
          ? (hover ? neon : TOKENS.fg)
          : (hover ? TOKENS.fg : TOKENS.mid),
        border: 'none',
        borderBottom: `1px solid ${primary ? (hover ? neon : TOKENS.fg) : (hover ? TOKENS.mid : 'transparent')}`,
        padding: '4px 2px',
        fontFamily: TOKENS.mono,
        fontSize: 13,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        transition: 'color 300ms ease, border-color 300ms ease',
      }}>
      {children}
    </button>
  );
}

Object.assign(window, { VariantC, ModeWord, MinButton });
