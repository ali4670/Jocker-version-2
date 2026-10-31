export default function Logo({ className = '', showWord = true, wordClassName = '' }) {
  return (
    <span className={`logo ${className}`}>
      <svg className="logo-mark" viewBox="0 0 100 80" aria-hidden="true">
        <use href="#i-hat" />
      </svg>
      {showWord && <span className={`logo-word ${wordClassName}`}>Joker Box</span>}
    </span>
  );
}
