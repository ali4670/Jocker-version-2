export function Symbols() {
  return (
    <svg className="symbol-defs" aria-hidden="true" focusable="false">
      <defs>
        <symbol id="i-hat" viewBox="0 0 100 80">
          <path d="M30 62 Q14 44 12 20" fill="none" style={{ stroke: '#FF2A54' }} strokeWidth="14" strokeLinecap="round" />
          <path d="M50 62 Q50 36 50 12" fill="none" style={{ stroke: '#FFC700' }} strokeWidth="14" strokeLinecap="round" />
          <path d="M70 62 Q86 44 88 20" fill="none" style={{ stroke: '#00E676' }} strokeWidth="14" strokeLinecap="round" />
          <circle cx="12" cy="17" r="8" fill="currentColor" />
          <circle cx="50" cy="9" r="8" fill="currentColor" />
          <circle cx="88" cy="17" r="8" fill="currentColor" />
          <rect x="22" y="58" width="56" height="16" rx="4" fill="currentColor" />
        </symbol>

        <symbol id="i-star" viewBox="0 0 100 100">
          <polygon
            points="50,8 61,38 93,38 67,57 77,89 50,70 23,89 33,57 7,38 39,38"
            fill="currentColor"
            stroke="#1A1A1A"
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </symbol>

        <symbol id="i-diamond" viewBox="0 0 100 100">
          <polygon
            points="50,6 90,50 50,94 10,50"
            fill="currentColor"
            stroke="#1A1A1A"
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </symbol>

        <symbol id="i-moon" viewBox="0 0 100 100">
          <path
            d="M62 10 A42 42 0 1 0 90 62 A34 34 0 1 1 62 10Z"
            fill="currentColor"
            stroke="#1A1A1A"
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </symbol>

        <symbol id="i-crown" viewBox="0 0 100 100">
          <polygon
            points="10,82 10,30 32,54 50,16 68,54 90,30 90,82"
            fill="currentColor"
            stroke="#1A1A1A"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <rect x="10" y="82" width="80" height="9" fill="#1A1A1A" />
        </symbol>

        <symbol id="i-mask" viewBox="0 0 100 100">
          <path
            d="M8 32 Q50 8 92 32 Q92 66 66 76 Q50 81 34 76 Q8 66 8 32Z"
            fill="currentColor"
            stroke="#1A1A1A"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <circle cx="34" cy="42" r="9" fill="#1A1A1A" />
          <circle cx="66" cy="42" r="9" fill="#1A1A1A" />
          <path d="M42 62 Q50 68 58 62" fill="none" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" />
        </symbol>

        <symbol id="i-eye" viewBox="0 0 100 100">
          <path d="M6 50 Q50 6 94 50 Q50 94 6 50Z" fill="currentColor" stroke="#1A1A1A" strokeWidth="5" strokeLinejoin="round" />
          <circle cx="50" cy="50" r="17" fill="#1A1A1A" />
          <circle cx="50" cy="50" r="6" fill="currentColor" />
        </symbol>

        <symbol id="i-key" viewBox="0 0 100 100">
          <circle cx="34" cy="34" r="22" fill="none" stroke="currentColor" strokeWidth="12" />
          <path d="M50 50 L86 86 M70 70 L80 60 M78 78 L88 68" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
        </symbol>

        <symbol id="i-box" viewBox="0 0 200 160">
          <ellipse cx="100" cy="146" rx="74" ry="9" fill="rgba(0,0,0,.24)" />
          <rect x="24" y="64" width="152" height="78" rx="6" fill="var(--b1,#FF2A54)" stroke="#1A1A1A" strokeWidth="5" />
          <rect x="16" y="40" width="168" height="34" rx="6" fill="var(--b2,#00E676)" stroke="#1A1A1A" strokeWidth="5" />
          <ellipse cx="100" cy="106" rx="42" ry="26" fill="#FFF8E8" stroke="#1A1A1A" strokeWidth="4" />
          <g transform="translate(78 88) scale(.44)" style={{ color: '#1A1A1A' }}>
            <use href="#i-hat" width="100" height="80" />
          </g>
        </symbol>

        <symbol id="i-lock" viewBox="0 0 24 24">
          <rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </symbol>

        <symbol id="i-check" viewBox="0 0 24 24">
          <path d="M4 13l5 5L20 6" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>

        <symbol id="i-clock" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.6" />
          <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        </symbol>

        <symbol id="i-arrow" viewBox="0 0 24 24">
          <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>

        <symbol id="i-shuffle" viewBox="0 0 24 24">
          <path d="M3 6h4l10 12h4M17 3l4 3-4 3M3 18h4l3-3.6M17 18l4-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>

        <symbol id="i-close" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </symbol>

        <symbol id="i-globe" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" strokeWidth="2.2" />
        </symbol>

        <symbol id="i-sparkle" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4Z" fill="currentColor" />
        </symbol>
      </defs>
    </svg>
  );
}

const SMALL_ICONS = new Set(['lock', 'check', 'clock', 'arrow', 'shuffle', 'close', 'globe', 'sparkle']);

export function Icon({ name, className = '', style }) {
  const viewBox = name === 'hat' ? '0 0 100 80' : SMALL_ICONS.has(name) ? '0 0 24 24' : '0 0 100 100';
  return (
    <svg className={`icon ${className}`} viewBox={viewBox} aria-hidden="true" style={style}>
      <use href={`#i-${name}`} />
    </svg>
  );
}
