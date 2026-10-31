import { CONFIG, formatEGP } from '../data';
import { useLang } from '../i18n.jsx';
import { useStore } from '../store.jsx';
import GameArt from './GameArt.jsx';
import { Icon } from './Icons.jsx';
import { useToasts } from './Toasts.jsx';

export default function GameCard({ game, onAdded }) {
  const { lang, t } = useLang();
  const { addItem } = useStore();
  const toast = useToasts();

  const handleAdd = (event) => {
    addItem(game.id, 1, event.currentTarget);
    toast(`${t('toast.added')} · ${game.name[lang]}`);
    if (onAdded) onAdded(game);
  };

  const badge = game.badge ? game.badge[lang] : game.tag[lang];

  return (
    <article className="game-card" data-cursor="VIEW">
      <div className="game-art-wrap" style={{ '--accent': game.color }}>
        <span className="game-badge">{badge}</span>
        <GameArt game={game} />
      </div>
      <div className="game-body">
        <p className="game-tag">{game.tag[lang]}</p>
        <h3>{game.name[lang]}</h3>
        <p className="game-desc">{game.desc[lang]}</p>
        <div className="game-foot">
          <div className="game-price">{formatEGP(game.price, lang)}</div>
          <button className="btn red sm" type="button" onClick={handleAdd}>
            <Icon name="sparkle" className="btn-icon" />
            {t('shop.add')}
          </button>
        </div>
        <p className="game-meta">
          +{CONFIG.ptsPerBox} {t('shop.pts')} · {t('shop.piecesIncluded')}
        </p>
      </div>
    </article>
  );
}
