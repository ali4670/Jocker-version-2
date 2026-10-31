import { useEffect } from 'react';
import { LangProvider, useLang } from './i18n.jsx';
import { StoreProvider } from './store.jsx';
import { ToastsProvider } from './components/Toasts.jsx';
import { RouteProvider, UIProvider, useRoute } from './ui.jsx';
import { ScrollTrigger } from './gsap.js';
import { Symbols } from './components/Icons.jsx';
import Cursor from './components/Cursor.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import Home from './pages/Home.jsx';
import ShopPage from './pages/ShopPage.jsx';

function Shell() {
  const { page } = useRoute();
  const { lang, t } = useLang();

  useEffect(() => {
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    const onFonts = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(onFonts).catch(() => {});
    window.addEventListener('resize', onFonts);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onFonts);
    };
  }, [page, lang]);

  return (
    <>
      <a className="skip-link" href="#main">
        {t('misc.skip')}
      </a>
      <Symbols />
      <Cursor />
      <Header />
      <main id="main">{page === 'shop' ? <ShopPage key={lang} /> : <Home key={lang} />}</main>
      <Footer />
      <CartDrawer />
      <CheckoutModal />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <StoreProvider>
        <ToastsProvider>
          <UIProvider>
            <RouteProvider>
              <Shell />
            </RouteProvider>
          </UIProvider>
        </ToastsProvider>
      </StoreProvider>
    </LangProvider>
  );
}
