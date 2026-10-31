import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const UIContext = createContext(null);
const RouteContext = createContext(null);

export function UIProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const openCart = useCallback(() => {
    setCheckoutOpen(false);
    setCartOpen(true);
  }, []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openCheckout = useCallback(() => {
    setCartOpen(false);
    setCheckoutOpen(true);
  }, []);
  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);
  const closeAll = useCallback(() => {
    setCartOpen(false);
    setCheckoutOpen(false);
  }, []);

  const value = useMemo(
    () => ({ cartOpen, checkoutOpen, openCart, closeCart, openCheckout, closeCheckout, closeAll }),
    [cartOpen, checkoutOpen, openCart, closeCart, openCheckout, closeCheckout, closeAll]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside UIProvider');
  return ctx;
}

export function RouteProvider({ children }) {
  const [hash, setHash] = useState(() => window.location.hash || '#/');

  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const page = hash.startsWith('#/shop') ? 'shop' : 'home';

  const goShop = useCallback(() => {
    if (window.location.hash !== '#/shop') window.location.hash = '#/shop';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goHome = useCallback(
    (section) => {
      if (window.location.hash && window.location.hash !== '#/') {
        window.location.hash = '#/';
      }
      const scroll = () => {
        if (section) {
          const el = document.getElementById(section);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };
      window.setTimeout(scroll, page === 'home' ? 0 : 90);
    },
    [page]
  );

  const value = useMemo(() => ({ page, goShop, goHome }), [page, goShop, goHome]);

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}

export function useRoute() {
  const ctx = useContext(RouteContext);
  if (!ctx) throw new Error('useRoute must be used inside RouteProvider');
  return ctx;
}

export function useBodyLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}
