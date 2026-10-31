import { useLayoutEffect, useRef } from 'react';
import { gameById, WORD } from '../data';
import { gsap } from '../gsap.js';
import { useLang } from '../i18n.jsx';
import { useStore } from '../store.jsx';
import { useRoute } from '../ui.jsx';
import { confetti, prefersReducedMotion } from '../utils';
import { Icon } from './Icons.jsx';
import QR from './QR.jsx';
import { useToasts } from './Toasts.jsx';

function ScanResult({ code, order, t }) {
  if (!order) return null;
  if (code === 'ok') {
    return (
      <div className="scan ok">
        <b>{t('delivery.scanOk')}</b>
        <span>
          {t('delivery.scanOkNote', {
            name: order.customer.name,
            qty: order.qty,
            pieces: order.pieces.length,
            pts: order.pt,
          })}
        </span>
      </div>
    );
  }
  if (code === 'used') {
    return (
      <div className="scan bad">
        <b>{t('delivery.scanUsed')}</b>
        <span>{t('delivery.scanUsedNote')}</span>
      </div>
    );
  }
  if (code === 'invalid') {
    return (
      <div className="scan bad">
        <b>{t('delivery.scanInvalid')}</b>
        <span>{t('delivery.scanInvalidNote')}</span>
      </div>
    );
  }
  return (
    <div className="scan bad">
      <b>{t('delivery.unknown')}</b>
    </div>
  );
}

export default function Delivery() {
  const { lang, t } = useLang();
  const { orders, lastScan, scan } = useStore();
  const { goShop } = useRoute();
  const toast = useToasts();
  const ref = useRef(null);
  const order = orders[0];
  const scanCode = order && lastScan && lastScan.id === order.id ? lastScan.code : null;

  const handleScan = (event) => {
    if (!order) return;
    const result = scan(order.id);
    if (result.ok) {
      toast(t('delivery.verifiedToast', { pts: order.pt }));
      confetti(event.currentTarget);
    } else {
      toast(result.code === 'used' ? t('delivery.already') : t('delivery.refused'));
    }
  };

  const handleTamper = () => {
    if (!order) return;
    scan(order.id, true);
    toast(t('delivery.changed'));
  };

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.steps li', {
        x: -50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.steps', start: 'top 84%', toggleActions: 'play none none none' },
      });
      gsap.from('.passport', {
        y: 60,
        rotation: 2.5,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.dgrid', start: 'top 80%', toggleActions: 'play none none none' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const steps = t('delivery.steps');

  return (
    <section id="delivery" className="section sec-green delivery-section" ref={ref}>
      <div className="wrap">
        <p className="eyebrow">{t('delivery.eyebrow')}</p>
        <h2 className="h2">
          {t('delivery.title1')}
          <br />
          {t('delivery.title2')}
        </h2>

        <div className="dgrid">
          <ol className="steps">
            {steps.map((step, index) => (
              <li key={step.t}>
                <div>
                  <h3>{step.t}</h3>
                  <p>{step.d}</p>
                </div>
                <span className="step-index" aria-hidden="true">
                  {index + 1}
                </span>
              </li>
            ))}
          </ol>

          <div className="passport" aria-live="polite">
            <h3>{t('delivery.passport')}</h3>
            {!order ? (
              <div className="passport-empty">
                <svg viewBox="0 0 200 160" aria-hidden="true" style={{ '--b1': '#bdb8ab', '--b2': '#a8a395' }}>
                  <use href="#i-box" />
                </svg>
                <p>{t('delivery.noOrder')}</p>
                <button className="btn red sm" type="button" onClick={goShop}>
                  {t('delivery.shop')}
                </button>
              </div>
            ) : (
              <>
                <div className="qr-box">
                  <QR text={`${order.payload}|${order.sig}`} size={190} />
                </div>
                <p className="mono order-id">{order.id}</p>
                <div className="status-row">
                  <span className={`status ${order.redeemed ? 'ok' : 'wait'}`}>
                    {order.redeemed ? t('delivery.verified') : t('delivery.waiting')}
                  </span>
                </div>
                <p className="passport-line">
                  {order.customer.name} ·{' '}
                  {order.items
                    .map((item) => `${item.qty}× ${gameById(item.id)?.name[lang] || item.id}`)
                    .join(' · ')}
                </p>
                <p className="passport-line">
                  {t('delivery.pieces')}: {order.pieces.map((index) => WORD[index]).join(' · ') || '—'}
                </p>
                <div className="passport-actions">
                  <button className="btn green sm" type="button" onClick={handleScan} data-cursor="SCAN">
                    <Icon name="check" className="btn-icon" />
                    {t('delivery.repScan')}
                  </button>
                  <button className="btn sm gold" type="button" onClick={handleTamper} data-cursor="TEST">
                    {t('delivery.edit')}
                  </button>
                </div>
                {scanCode && <ScanResult code={scanCode} order={order} t={t} />}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="float-icon fi-star-green" aria-hidden="true">
        <Icon name="star" />
      </div>
    </section>
  );
}
