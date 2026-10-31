import { useLang } from '../i18n.jsx';
import { useRoute } from '../ui.jsx';
import Logo from './Logo.jsx';

export default function Footer() {
  const { t, toggle } = useLang();
  const { goHome, goShop } = useRoute();

  return (
    <footer className="site-footer sec-char on-dark">
      <div className="wrap">
        <div className="footer-brand">
          <Logo className="footer-logo" wordClassName="footer-logo-word" />
          <p className="footer-tagline">{t('footer.tagline')}</p>
        </div>
        <div className="footer-big" aria-hidden="true">
          Just a Joker Box
        </div>
        <div className="footer-bottom">
          <span>{t('footer.rights')}</span>
          <nav className="footer-nav" aria-label="Footer">
            <button type="button" onClick={() => goHome('joker')}>
              {t('joker.title')}
            </button>
            <button type="button" onClick={goShop}>
              {t('nav.shop')}
            </button>
            <button type="button" onClick={() => goHome('puzzle')}>
              {t('nav.play')}
            </button>
            <button type="button" onClick={() => goHome('delivery')}>
              {t('nav.delivery')}
            </button>
            <button type="button" onClick={toggle}>
              {t('langName')}
            </button>
            <button type="button" onClick={() => goHome()}>
              {t('footer.top')}
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
