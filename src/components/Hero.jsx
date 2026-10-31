import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../gsap.js';
import { useLang } from '../i18n.jsx';
import { useStore } from '../store.jsx';
import { useRoute } from '../ui.jsx';
import { clamp, prefersReducedMotion } from '../utils';
import { useToasts } from './Toasts.jsx';
import { createHero3D } from './Hero3D.js';

const letters = (word) =>
  Array.from(word).map((ch, i) => (
    <span className="ch" key={`${ch}-${i}`}>
      {ch}
    </span>
  ));

export default function Hero() {
  const { t } = useLang();
  const { addItem } = useStore();
  const { goHome, goShop } = useRoute();
  const toast = useToasts();
  const reduced = prefersReducedMotion();
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const copyRef = useRef(null);
  const rollRef = useRef(null);
  const cueRef = useRef(null);
  const stepRefs = useRef([]);

  const addRoll = (event) => {
    addItem('joker', 1, event.currentTarget);
    toast(t('toast.added'));
  };

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero || reduced) return undefined;

    const copy = copyRef.current;
    const roll = rollRef.current;
    const cue = cueRef.current;
    const steps = stepRefs.current.filter(Boolean);
    const three = createHero3D(canvasRef.current, hero);
    three?.start();

    const heroUI = (p) => {
      const a = clamp((p - 0.42) / 0.18);
      const b = clamp((p - 0.72) / 0.2);

      if (copy) {
        copy.style.opacity = String(1 - a);
        copy.style.transform = `translateY(${-a * 50}px)`;
        copy.style.visibility = a > 0.98 ? 'hidden' : 'visible';
      }
      if (roll) {
        roll.style.opacity = String(b);
        roll.style.transform = `translateY(${(1 - b) * 30}px)`;
        roll.style.visibility = b < 0.01 ? 'hidden' : 'visible';
      }
      if (cue) cue.style.opacity = String(1 - clamp(p / 0.1));

      const active = p < 0.3 ? 0 : p < 0.72 ? 1 : 2;
      steps.forEach((step, i) => step.classList.toggle('on', i === active));
    };

    const ctx = gsap.context(() => {
      heroUI(0);
      ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: '+=230%',
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          three?.setProgress(self.progress);
          heroUI(self.progress);
        },
      });
    }, hero);

    return () => {
      ctx.revert();
      three?.dispose();
    };
  }, [reduced]);

  return (
    <section
      id="hero"
      className={`hero${reduced ? ' is-static' : ''}`}
      ref={heroRef}
      aria-label={t('brand')}
    >
      <canvas id="heroCanvas" className="hero-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="hero-fallback" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="hero-halftone" aria-hidden="true" />

      <div className="hero-copy" ref={copyRef}>
        <p className="eyebrow">{t('hero.eyebrow')}</p>
        <h1 className="hero-title" aria-label={t('brand')}>
          <span className="small" aria-hidden="true">
            {t('hero.just')}
          </span>
          <span className="big red" aria-hidden="true">
            {letters('JOKER')}
          </span>
          <span className="big gold" aria-hidden="true">
            {letters('BOX')}
          </span>
        </h1>
        <p className="lead">{t('hero.lead')}</p>
        <div className="hero-actions">
          <button className="btn red" type="button" onClick={() => goHome('joker')} data-cursor="ROLL">
            {t('hero.meet')}
          </button>
          <button className="btn" type="button" onClick={() => goHome('puzzle')} data-cursor="PLAY">
            {t('hero.collect')}
          </button>
        </div>
      </div>

      <div className="hero-roll" ref={rollRef}>
        <p className="eyebrow">{t('hero.act')}</p>
        <h2 className="hero-roll-title">{t('hero.draw')}</h2>
        <p className="lead">{t('hero.drawLead')}</p>
        <div className="hero-actions">
          <button className="btn gold" type="button" onClick={addRoll} data-cursor="ADD">
            {t('hero.add')}
          </button>
          <button className="btn" type="button" onClick={goShop} data-cursor="SHOP">
            {t('hero.browse')}
          </button>
        </div>
      </div>

      <div className="hero-cue" ref={cueRef} aria-hidden="true">
        <i />
        {t('hero.scroll')}
      </div>

      <div className="hero-steps" aria-hidden="true">
        {t('hero.steps').map((label, i) => (
          <span
            key={label}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            className={i === 0 ? 'on' : ''}
          >
            {i + 1} {label}
          </span>
        ))}
      </div>
    </section>
  );
}
