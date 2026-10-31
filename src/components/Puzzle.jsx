import { useLayoutEffect, useRef } from 'react';
import { CONFIG, pointsToEGP, WORD } from '../data';
import { gsap } from '../gsap.js';
import { useLang } from '../i18n.jsx';
import { useStore } from '../store.jsx';
import { useRoute } from '../ui.jsx';
import { confetti, prefersReducedMotion, vibrate } from '../utils';
import { Icon } from './Icons.jsx';
import { useToasts } from './Toasts.jsx';

export default function Puzzle() {
  const { lang, t } = useLang();
  const { points, pieces, pending, pendingPieces, locked, verifiedCount, redeem, addPoints, reset } = useStore();
  const { goShop } = useRoute();
  const toast = useToasts();
  const ref = useRef(null);
  const tilesRef = useRef(null);

  const remainder = points % CONFIG.pieceCost;
  const canRedeem = points >= CONFIG.pieceCost && locked.length > 0;
  const done = verifiedCount === 10;
  const legend = t('puzzle.legend');

  const meterLabel = locked.length
    ? canRedeem
      ? t('puzzle.canUnlock')
      : `${CONFIG.pieceCost - remainder} ${t('puzzle.untilNext')}`
    : t('puzzle.everyPiece');

  const handleRedeem = () => {
    if (!canRedeem) return;
    const index = redeem();
    if (index == null) return;
    toast(t('puzzle.unlocked', { n: index + 1, l: WORD[index] }));
    vibrate([10, 30, 10]);
    window.setTimeout(() => {
      const el = tilesRef.current?.querySelector(`[data-i="${index}"]`);
      if (el) confetti(el);
    }, 90);
  };

  const onTile = (event, index) => {
    const piece = pieces[index];
    if (!piece) {
      const el = event.currentTarget;
      el.classList.remove('shake');
      void el.offsetWidth;
      el.classList.add('shake');
      toast(points >= CONFIG.pieceCost ? t('puzzle.useUnlock') : t('puzzle.lockedToast'));
      vibrate(20);
    } else if (piece.s === 'pending') {
      toast(t('puzzle.waitingToast'));
    }
  };

  const demoReset = () => {
    reset();
    toast(t('toast.reset'));
  };

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.wallet, .pz', {
        y: 60,
        opacity: 0,
        stagger: 0.14,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.pgrid', start: 'top 84%', toggleActions: 'play none none none' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="puzzle" className="section sec-char puzzle-section on-dark" ref={ref}>
      <div className="wrap">
        <p className="eyebrow">{t('puzzle.eyebrow')}</p>
        <h2 className="h2">
          {t('puzzle.title1')}
          <br />
          {t('puzzle.title2')}
        </h2>

        <div className="pgrid">
          <div className="wallet">
            <p className="eyebrow">{t('puzzle.points')}</p>
            <div className="bal">
              <b>{points}</b>
              <span>{t('puzzle.pts')}</span>
            </div>
            <p className="egp">
              {pointsToEGP(points, lang)} <small>{t('puzzle.reward')}</small>
            </p>
            <div
              className="meter"
              role="progressbar"
              aria-label={t('puzzle.meterLabel')}
              aria-valuemin="0"
              aria-valuemax={CONFIG.pieceCost}
              aria-valuenow={remainder}
            >
              <i style={{ width: `${(remainder / CONFIG.pieceCost) * 100}%` }} />
            </div>
            <p className="meter-label">{meterLabel}</p>

            <div className="rules">
              <div className="rule">
                <b>{t('puzzle.rule1a')}</b>
                {t('puzzle.rule1b')}
              </div>
              <div className="rule">
                <b>{t('puzzle.rule2a')}</b>
                {t('puzzle.rule2b')}
              </div>
            </div>

            {pending > 0 && (
              <p className="pending">
                +{pending} {t('puzzle.pending', { n: pendingPieces })}
              </p>
            )}

            <div className="wallet-actions">
              <button className="btn purple" type="button" onClick={handleRedeem} disabled={!canRedeem} data-cursor="UNLOCK">
                {t('puzzle.unlock')}
              </button>
              <button className="btn gold" type="button" onClick={goShop} data-cursor="SHOP">
                {t('puzzle.buy')}
              </button>
            </div>

            <details className="demo">
              <summary>{t('puzzle.demoTools')}</summary>
              <p>{t('puzzle.demoTip')}</p>
              <div className="demo-actions">
                <button className="btn sm" type="button" onClick={() => addPoints(CONFIG.ptsPerBox)}>
                  {t('puzzle.top')}
                </button>
                <button className="btn sm ghost" type="button" onClick={demoReset}>
                  {t('puzzle.reset')}
                </button>
              </div>
            </details>
          </div>

          <div className="pz">
            <div className="pz-head">
              <div className="pz-count">
                <span>{Object.keys(pieces).length}</span> / 10 {t('puzzle.count')}
              </div>
              <span className="eyebrow">{t('puzzle.tap')}</span>
            </div>

            <div className="tiles" ref={tilesRef}>
              {Array.from({ length: 10 }, (_, index) => {
                const piece = pieces[index];
                const state = piece ? piece.s : 'lock';
                const classes = piece
                  ? `tile ${state === 'pending' ? 'pending' : ''} c${index % 4}`
                  : 'tile lock';
                return (
                  <button
                    key={index}
                    type="button"
                    data-i={index}
                    className={classes}
                    onClick={(event) => onTile(event, index)}
                    aria-label={`${t('puzzle.piecesLabel')} ${index + 1}, ${
                      piece ? WORD[index] : legend[2]
                    }`}
                    data-cursor={piece ? '' : 'LOCKED'}
                  >
                    <span className="tile-no">{String(index + 1).padStart(2, '0')}</span>
                    <span className="tile-letter">{piece ? WORD[index] : '?'}</span>
                    <Icon name={piece ? (state === 'pending' ? 'clock' : 'check') : 'lock'} className="tile-st" />
                  </button>
                );
              })}
            </div>

            <div className="legend">
              <span>
                <i className="swatch red" /> {legend[0]}
              </span>
              <span>
                <i className="swatch pending" /> {legend[1]}
              </span>
              <span>
                <i className="swatch lock" /> {legend[2]}
              </span>
            </div>

            <div className={`wordbar${done ? ' done' : ''}`}>
              {done
                ? WORD
                : `${t('puzzle.secret')}: ${Array.from({ length: 10 }, (_, i) =>
                    pieces[i] && pieces[i].s !== 'pending' ? WORD[i] : '_'
                  ).join(' ')}`}
            </div>
          </div>
        </div>
      </div>
      <div className="float-icon fi-moon-purple" aria-hidden="true">
        <Icon name="moon" />
      </div>
    </section>
  );
}
