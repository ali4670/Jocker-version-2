import { useState } from 'react';
import { CONFIG, GAMES } from '../data';
import { useLang } from '../i18n.jsx';
import GameCard from '../components/GameCard.jsx';

const CATEGORIES = ['all', 'fantasy', 'party', 'strategy'];

export default function ShopPage() {
  const { t } = useLang();
  const [filter, setFilter] = useState('all');
  const games = filter === 'all' ? GAMES : GAMES.filter((game) => game.cat === filter);

  return (
    <>
      <section className="shop-hero on-dark">
        <div className="wrap">
          <p className="eyebrow">{t('shop.pageEyebrow')}</p>
          <h1 className="h2 shop-title">{t('shop.pageTitle')}</h1>
          <p className="lead">{t('shop.pageLead')}</p>
          <div className="shop-stats">
            <span>
              <b>{GAMES.length}</b> {t('shop.gamesCount')}
            </span>
            <span>
              <b>+{CONFIG.ptsPerBox}</b> {t('shop.pts')} / box
            </span>
            <span>
              <b>10</b> {t('puzzle.piecesLabel')}
            </span>
          </div>
        </div>
      </section>

      <section className="section sec-cream shop-page">
        <div className="wrap">
          <div className="filters" role="group" aria-label={t('shop.filterLabel')}>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={`filter${filter === category ? ' on' : ''}`}
                onClick={() => setFilter(category)}
                aria-pressed={filter === category}
              >
                {t(`shop.${category}`)}
              </button>
            ))}
          </div>
          <div className="shop-grid" key={filter}>
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
