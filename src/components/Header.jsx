import { useEffect, useState } from 'react';
import { useLang } from '../i18n.jsx';
import { useStore } from '../store.jsx';
import { useBodyLock, useRoute, useUI } from '../ui.jsx';
import { Icon } from './Icons.jsx';
import Logo from './Logo.jsx';

export default function Header() {
  const { t, toggle, lang } = useLang();
  const { points, cartCount } = useStore();
  const { page, goHome, goShop } = useRoute();
  const { openCart } = useUI();
  const [menuOpen, setMenuOpen] = useState(false);

  useBodyLock(menuOpen);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const go = (section) => {
    setMenuOpen(false);
    goHome(section);
  };

  const shop = () => {
    setMenuOpen(false);
    goShop();
  };

  const cart = () => {
    setMenuOpen(false);
    openCart();
  };

  const switchLang = () => {
    setMenuOpen(false);
    toggle();
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <button className="logo-btn" type="button" onClick={() => go()} aria-label={t('brand')}>
            <Logo />
          </button>

          <nav className="main-nav" aria-label={t('nav.home')}>
            <button className={`nav-link${page === 'home' ? ' active' : ''}`} type="button" onClick={() => go()}>
              {t('nav.home')}
            </button>
            <button className={`nav-link${page === 'shop' ? ' active' : ''}`} type="button" onClick={shop}>
              {t('nav.shop')}
            </button>
            <button className="nav-link" type="button" onClick={() => go('puzzle')}>
              {t('nav.play')}
            </button>
            <button className="nav-link" type="button" onClick={() => go('delivery')}>
              {t('nav.delivery')}
            </button>
          </nav>

          <div className="header-actions">
            <button className="chip pts" type="button" onClick={() => go('puzzle')} aria-label={`${points} ${t('nav.pts')}`}>
              <Icon name="star" className="chip-icon" />
              <b>{points}</b>
              <span className="chip-label">{t('nav.pts')}</span>
            </button>
            <button className="chip cart" id="cart-btn" type="button" onClick={cart} aria-label={`${t('nav.cart')} (${cartCount})`}>
              <span className="chip-label">{t('nav.cart')}</span>
              <span className="chip-count">{cartCount}</span>
            </button>
            <button className="chip lang" type="button" onClick={switchLang} aria-label={t('misc.language')}>
              <Icon name="globe" className="chip-icon" />
              <span className="chip-label lang-label">{t('langName')}</span>
            </button>
            <button
              className="burger"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={t('misc.menu')}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <i />
              <i />
              <i />
            </button>
          </div>
        </div>
      </header>

      <nav id="mobile-menu" className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-label={t('misc.menu')} aria-hidden={!menuOpen}>
        <div className="mobile-menu-head">
          <Logo />
          <button className="mobile-close" type="button" onClick={() => setMenuOpen(false)} aria-label={t('misc.close')}>
            <Icon name="close" />
          </button>
        </div>
        <div className="mobile-links">
          <button type="button" onClick={() => go()}>
            {t('nav.home')}
          </button>
          <button type="button" onClick={shop}>
            {t('nav.shop')}
          </button>
          <button type="button" onClick={() => go('puzzle')}>
            {t('nav.play')}
          </button>
          <button type="button" onClick={() => go('delivery')}>
            {t('nav.delivery')}
          </button>
        </div>
        <div className="mobile-menu-foot">
          <button className="chip pts" type="button" onClick={() => go('puzzle')}>
            <Icon name="star" className="chip-icon" />
            <b>{points}</b>
            <span className="chip-label">{t('nav.pts')}</span>
          </button>
          <button className="chip cart" type="button" onClick={cart}>
            <span className="chip-label">{t('nav.cart')}</span>
            <span className="chip-count">{cartCount}</span>
          </button>
          <button className="chip lang" type="button" onClick={switchLang}>
            <Icon name="globe" className="chip-icon" />
            <span className="chip-label">{t('langName')}</span>
          </button>
        </div>
        <p className="mobile-lang-note">{lang === 'en' ? 'مرحبًا بك في صندوق الجوكر' : 'Welcome to the Joker Box'}</p>
      </nav>
    </>
  );
}
