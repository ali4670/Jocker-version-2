import { useLayoutEffect, useRef, useState } from 'react';
import { CONFIG, formatEGP, SHOWCASE_CARDS } from '../data';
import { gsap } from '../gsap.js';
import { useLang } from '../i18n.jsx';
import { useStore } from '../store.jsx';
import { useRoute } from '../ui.jsx';
import { prefersReducedMotion, vibrate } from '../utils';
import { Icon } from './Icons.jsx';
import { useToasts } from './Toasts.jsx';

function slotFor(position, spread) {
  if (spread) {
    return {
      x: (position - 2) * 74,
      y: Math.abs(position - 2) * 14,
      rotation: (position - 2) * 9,
      scale: 1 - Math.abs(position - 2) * 0.02,
    };
  }
  return {
    x: position * 10,
    y: position * -9,
    rotation: (position % 2 ? 1 : -1) * position * 1.6,
    scale: 1 - position * 0.035,
  };
}

export default function JokerShowcase() {
  const { lang, t } = useLang();
  const { addItem } = useStore();
  const { goShop } = useRoute();
  const toast = useToasts();
  const ref = useRef(null);
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const [order, setOrder] = useState([0, 1, 2, 3, 4]);
  const [spread, setSpread] = useState(false);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(null);

  const names = t('joker.cardNames');
  const topIndex = order[0];

  const cycle = (direction) => {
    if (busy) return;
    setBusy(true);
    setDrag(null);
    setOrder((current) =>
      direction > 0
        ? [...current.slice(1), current[0]]
        : [current[current.length - 1], ...current.slice(0, -1)]
    );
    vibrate(10);
    window.setTimeout(() => setBusy(false), 430);
  };

  const shuffle = () => {
    if (busy) return;
    setBusy(true);
    setDrag(null);
    setOrder((current) => {
      const next = [...current];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
    setSpread(false);
    vibrate([8, 30, 8]);
    window.setTimeout(() => setBusy(false), 430);
  };

  const addJoker = (event) => {
    addItem('joker', 1, event.currentTarget);
    toast(t('toast.added'));
  };

  const onPointerDown = (event) => {
    if (busy) return;
    const top = stageRef.current?.querySelector('.pcard[data-top="true"]');
    if (!top || !top.contains(event.target)) return;
    dragRef.current = { x: event.clientX, y: event.clientY };
    setDrag({ dx: 0, dy: 0 });
    try {
      stageRef.current.setPointerCapture(event.pointerId);
    } catch (e) {
      /* ignore */
    }
  };

  const onPointerMove = (event) => {
    if (!dragRef.current) return;
    setDrag({ dx: event.clientX - dragRef.current.x, dy: event.clientY - dragRef.current.y });
  };

  const onPointerUp = (event) => {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.x;
    dragRef.current = null;
    setDrag(null);
    if (Math.abs(dx) > 80) {
      cycle(dx > 0 ? 1 : -1);
    } else {
      vibrate(6);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      cycle(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      cycle(-1);
    }
  };

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.rinfo > *', {
        y: 44,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.rinfo', start: 'top 80%', toggleActions: 'play none none none' },
      });
      gsap.from('.deck-stage', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.deck-stage', start: 'top 84%', toggleActions: 'play none none none' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="joker" className="section sec-purple joker-section on-dark" ref={ref}>
      <div className="halftone" aria-hidden="true" />
      <div className="wrap">
        <div className="joker-grid">
          <div className="deck-col">
            <div
              className="deck-stage"
              ref={stageRef}
              tabIndex={0}
              role="group"
              aria-roledescription="card deck"
              aria-label={t('joker.deckLabel')}
              data-cursor="DRAG"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={onKeyDown}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse' && !busy) setSpread(true);
              }}
              onPointerLeave={() => setSpread(false)}
            >
              {SHOWCASE_CARDS.map((card, i) => {
                const position = order.indexOf(i);
                const isTop = position === 0;
                const s = slotFor(position, spread);
                const dx = isTop && drag ? drag.dx : 0;
                const dy = isTop && drag ? drag.dy * 0.35 : 0;
                const extraRotation = isTop && drag ? drag.dx * 0.05 : 0;
                return (
                  <div
                    className={`pcard${isTop && drag ? ' dragging' : ''}`}
                    key={i}
                    data-top={isTop ? 'true' : 'false'}
                    style={{
                      zIndex: 10 - position,
                      transform: `translate(${s.x + dx}px, ${s.y + dy}px) rotate(${s.rotation + extraRotation}deg) scale(${s.scale})`,
                    }}
                  >
                    <span className="pcard-num">{card.roman}</span>
                    <span className="pcard-num bottom">{card.roman}</span>
                    <Icon
                      name={card.icon}
                      className="pcard-art"
                      style={{ color: card.icon === 'hat' ? 'var(--char)' : card.color }}
                    />
                    <span className="pcard-name">{names[i]}</span>
                  </div>
                );
              })}
            </div>
            <p className="deck-name" aria-live="polite">
              {names[topIndex]} ({topIndex + 1} {t('joker.cardOf')} 5)
            </p>
            <div className="deck-controls">
              <button
                className="btn sm gold"
                type="button"
                onClick={() => cycle(-1)}
                aria-label={t('joker.prev')}
                data-cursor="BACK"
              >
                <Icon name="arrow" className="flip-icon" />
              </button>
              <button className="btn sm" type="button" onClick={shuffle} data-cursor="MIX">
                <Icon name="shuffle" className="btn-icon" />
                {t('joker.shuffle')}
              </button>
              <button
                className="btn sm gold"
                type="button"
                onClick={() => cycle(1)}
                aria-label={t('joker.next')}
                data-cursor="NEXT"
              >
                <Icon name="arrow" />
              </button>
            </div>
          </div>

          <div className="rinfo">
            <p className="eyebrow">{t('joker.eyebrow')}</p>
            <h2 className="h2">{t('joker.title')}</h2>
            <p className="lead">{t('joker.lead')}</p>
            <div className="tags">
              {t('joker.tags').map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="buyrow">
              <div className="price">
                <small>{t('joker.oneBox')}</small>
                <span>{formatEGP(CONFIG.boxPrice, lang)}</span>
              </div>
              <button className="btn gold" type="button" onClick={addJoker} data-cursor="ADD">
                {t('joker.add')}
              </button>
              <button className="btn ghost on-purple" type="button" onClick={goShop} data-cursor="SHOP">
                {t('hero.browse')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="float-icon fi-joker" aria-hidden="true">
        <Icon name="diamond" />
      </div>
    </section>
  );
}
