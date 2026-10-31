import { useEffect, useRef } from 'react';
import { CONFIG, formatEGP, gameById } from '../data';
import { useLang } from '../i18n.jsx';
import { useStore } from '../store.jsx';
import { useBodyLock, useRoute, useUI } from '../ui.jsx';
import GameArt from './GameArt.jsx';
import { Icon } from './Icons.jsx';

export default function CartDrawer() {
  const { cart, cartCount, subtotal, maxUse, usedPoints, discount, total, usePoints, setUsePoints, setQty, removeItem } =
    useStore();
  const { cartOpen, closeCart, openCheckout } = useUI();
  const { goShop } = useRoute();
  const { lang, t } = useLang();
  const closeRef = useRef(null);

  useBodyLock(cartOpen);

  useEffect(() => {
    if (!cartOpen) return undefined;
    const timer = window.setTimeout(() => closeRef.current?.focus(), 90);
    const onKey = (event) => {
      if (event.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [cartOpen, closeCart]);

  const lines = cart
    .map((line) => ({ ...line, game: gameById(line.id) }))
    .filter((line) => Boolean(line.game));

  const goToShop = () => {
    closeCart();
    goShop();
  };

  return (
    <>
      <div className={`overlay${cartOpen ? ' open' : ''}`} onClick={closeCart} aria-hidden="true" />
      <aside
        className={`drawer${cartOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title')}
        aria-hidden={!cartOpen}
      >
        <div className="drawer-head">
          <h2>{t('cart.title')}</h2>
          <button className="x-btn" type="button" ref={closeRef} onClick={closeCart} aria-label={t('misc.close')}>
            <Icon name="close" />
          </button>
        </div>

        <div className="drawer-body">
          {!cartCount ? (
            <div className="cart-empty">
              <svg viewBox="0 0 200 160" aria-hidden="true" style={{ '--b1': '#bdb8ab', '--b2': '#a8a395' }}>
                <use href="#i-box" />
              </svg>
              <p>
                <b>{t('cart.empty')}</b>
                <br />
                {t('cart.emptyDesc')}
              </p>
              <button className="btn red sm" type="button" onClick={goToShop}>
                {t('cart.goShop')}
              </button>
            </div>
          ) : (
            <>
              <div className="cart-lines">
                {lines.map(({ game, qty }) => (
                  <div className="cart-line" key={game.id}>
                    <div className="cart-thumb" style={{ '--accent': game.color }}>
                      <GameArt game={game} />
                    </div>
                    <div className="cart-info">
                      <h3>{game.name[lang]}</h3>
                      <p className="cart-unit">
                        {formatEGP(game.price, lang)} {t('cart.each')}
                      </p>
                      <div className="qty">
                        <button type="button" onClick={() => setQty(game.id, qty - 1)} aria-label="-">
                          −
                        </button>
                        <span aria-live="polite">{qty}</span>
                        <button type="button" onClick={() => setQty(game.id, qty + 1)} aria-label="+">
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cart-line-end">
                      <span className="cart-line-total">{formatEGP(game.price * qty, lang)}</span>
                      <button
                        className="cart-remove"
                        type="button"
                        onClick={() => removeItem(game.id)}
                        aria-label={`${t('cart.remove')} ${game.name[lang]}`}
                      >
                        <Icon name="close" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {maxUse > 0 ? (
                <label className="use-points">
                  <input type="checkbox" checked={usePoints} onChange={(event) => setUsePoints(event.target.checked)} />
                  <span>
                    <b>
                      {t('cart.usePoints', {
                        n: maxUse,
                        egp: formatEGP(maxUse / CONFIG.ptsPerEgp, lang),
                      })}
                    </b>
                  </span>
                </label>
              ) : (
                <p className="use-points disabled">{t('cart.earn')}</p>
              )}

              <p className="cart-note">
                {t('cart.adds', { pts: cartCount * CONFIG.ptsPerBox, pieces: cartCount })}
              </p>
            </>
          )}
        </div>

        {cartCount > 0 && (
          <div className="drawer-foot">
            <div className="totals">
              <div>
                <span>{t('cart.boxes')}</span>
                <span>{formatEGP(subtotal, lang)}</span>
              </div>
              {discount > 0 && (
                <div>
                  <span>
                    {t('cart.pointsUsed')} (−{usedPoints} {t('nav.pts')})
                  </span>
                  <span>−{formatEGP(discount, lang)}</span>
                </div>
              )}
              <div className="grand">
                <span>{t('cart.total')}</span>
                <span>{formatEGP(total, lang)}</span>
              </div>
            </div>
            <button className="btn red wide" type="button" onClick={openCheckout}>
              {t('cart.checkout')}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
