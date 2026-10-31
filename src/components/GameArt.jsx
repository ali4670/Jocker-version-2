export default function GameArt({ game, className = '' }) {
  const symbolColor = game.art === 'hat' ? '#1A1A1A' : game.color;
  return (
    <svg className={`game-art ${className}`} viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="100" cy="178" rx="66" ry="8" fill="rgba(0,0,0,.2)" />
      <rect x="30" y="66" width="140" height="98" rx="12" fill={game.color} stroke="#1A1A1A" strokeWidth="6" />
      <rect x="22" y="40" width="156" height="36" rx="9" fill="#FFF8E8" stroke="#1A1A1A" strokeWidth="6" />
      <circle cx="100" cy="118" r="36" fill="#FFF8E8" stroke="#1A1A1A" strokeWidth="5" />
      <g transform="translate(66 88) scale(.68)" style={{ color: symbolColor }}>
        <use href={`#i-${game.art}`} width="100" height="100" />
      </g>
      <text
        x="100"
        y="157"
        textAnchor="middle"
        fontFamily="'DM Mono', monospace"
        fontSize="9"
        letterSpacing="2"
        fill="#1A1A1A"
      >
        JOKER BOX
      </text>
    </svg>
  );
}
