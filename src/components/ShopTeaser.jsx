import { useLayoutEffect, useRef } from 'react';
import { GAMES } from '../data';
import { gsap } from '../gsap.js';
import { useLang } from '../i18n.jsx';
import { useRoute } from '../ui.jsx';
import { prefersReducedMotion } from '../utils';
import GameCard from './GameCard.jsx';
import { Icon } from './Icons.jsx';

export default function ShopTeaser() {
  const { t } = useLang();
  const { goShop } = useRoute();
  const ref = useRef(null);
  const games = GAMES.slice(0, 4);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.game-card', {
        y: 90,
        rotation: (i) => (i % 2 ? 4 : -4),
        opacity: 0,
        stagger: 0.09,
        duration: 0.8,
        ease: 'back.out(1.2)',
        scrollTrigger: { trigger: '.shop-grid', start: 'top 86%', toggleActions: 'play none none none' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="shop" className="section sec-gold shop-teaser" ref={ref}>
      <div className="wrap">
        <div className="shop-head">
          <div>
            <p className="eyebrow">{t('shop.eyebrow')}</p>
            <h2 className="h2">{t('shop.title')}</h2>
          </div>
          <p className="note">{t('shop.note')}</p>
        </div>
        <div className="shop-grid">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
        <div className="shop-more">
          <button className="btn" type="button" onClick={goShop} data-cursor="SHOP">
            {t('shop.viewAll')}
            <Icon name="arrow" className="btn-icon" />
          </button>
        </div>
      </div>
    </section>
  );
}
