import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { useLang } from '../i18n.jsx';
import { prefersReducedMotion } from '../utils';
import { Icon } from './Icons.jsx';

const WORD_CLASSES = ['c', 'o', 'c', '', '', '', 'o', '', 'c', 'c'];

export default function Manifesto() {
  const { t } = useLang();
  const ref = useRef(null);
  const words = t('manifesto.words');
  const line1 = t('manifesto.marquee1').repeat(3);
  const line2 = t('manifesto.marquee2').repeat(3);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.statement .w',
        { y: 80, rotation: (i) => (i % 2 ? -1 : 1) * (5 + (i % 3) * 3), opacity: 0.15 },
        {
          y: 0,
          rotation: 0,
          opacity: 1,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: { trigger: '.statement', start: 'top 88%', end: 'bottom 55%', scrub: 0.8 },
        }
      );
      gsap.fromTo(
        '.trio .tcard',
        { y: 90, rotation: (i) => [-6, 4, -3][i], opacity: 0.35 },
        {
          y: 0,
          rotation: (i) => [-1.5, 1, -0.8][i],
          opacity: 1,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '.trio', start: 'top 90%', end: 'top 50%', scrub: 0.8 },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="manifesto" className="section sec-red manifesto" ref={ref}>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-row row1">
          <div className="marquee-track">
            <span>{line1}</span>
            <span>{line1}</span>
          </div>
        </div>
        <div className="marquee-row row2">
          <div className="marquee-track reverse">
            <span>{line2}</span>
            <span>{line2}</span>
          </div>
        </div>
      </div>

      <div className="wrap">
        <p className="eyebrow">{t('manifesto.eyebrow')}</p>
        <h2 className="statement" aria-label={words.join(' ')}>
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className={`w ${WORD_CLASSES[i] || ''}`}>
              {word}
            </span>
          ))}
        </h2>

        <div className="trio">
          <article className="tcard" data-cursor="PLAY">
            <Icon name="crown" className="tcard-icon" />
            <h3>{t('manifesto.games.t')}</h3>
            <p>{t('manifesto.games.d')}</p>
          </article>
          <article className="tcard" data-cursor="PLAY">
            <Icon name="diamond" className="tcard-icon purple" />
            <h3>{t('manifesto.cards.t')}</h3>
            <p>{t('manifesto.cards.d')}</p>
          </article>
          <article className="tcard" data-cursor="PLAY">
            <Icon name="star" className="tcard-icon green" />
            <h3>{t('manifesto.pieces.t')}</h3>
            <p>{t('manifesto.pieces.d')}</p>
          </article>
        </div>
      </div>

      <div className="float-icon fi-star" aria-hidden="true">
        <Icon name="star" />
      </div>
      <div className="float-icon fi-moon" aria-hidden="true">
        <Icon name="moon" />
      </div>
    </section>
  );
}
