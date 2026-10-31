import { useEffect, useRef, useState } from 'react';
import { formatEGP, WORD } from '../data';
import { useLang } from '../i18n.jsx';
import { useStore } from '../store.jsx';
import { useBodyLock, useUI } from '../ui.jsx';
import { confetti } from '../utils';
import { Icon } from './Icons.jsx';
import QR from './QR.jsx';

export default function CheckoutModal() {
  const { checkoutOpen, closeCheckout } = useUI();
  const { cartCount, subtotal, usedPoints, discount, total, placeOrder, scan } = useStore();
  const { lang, t } = useLang();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', addr: '' });
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const [scanCode, setScanCode] = useState(null);
  const firstFieldRef = useRef(null);
  const closeRef = useRef(null);
  const scanRef = useRef(null);

  useBodyLock(checkoutOpen);

  useEffect(() => {
    if (!checkoutOpen) return undefined;
    setStep(1);
    setOrder(null);
    setScanCode(null);
    setErrors({});
    setForm({ name: '', phone: '', addr: '' });
    const timer = window.setTimeout(() => firstFieldRef.current?.focus(), 120);
    const onKey = (event) => {
      if (event.key === 'Escape') closeCheckout();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [checkoutOpen, closeCheckout]);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = t('checkout.errName');
    if (form.phone.replace(/\D/g, '').length < 10) next.phone = t('checkout.errPhone');
    if (form.addr.trim().length < 6) next.addr = t('checkout.errAddr');
    setErrors(next);
    if (Object.keys(next).length) return;
    const created = placeOrder({
      name: form.name.trim(),
      phone: form.phone.trim(),
      addr: form.addr.trim(),
    });
    if (created) {
      setOrder(created);
      setStep(2);
      setScanCode(null);
    }
  };

  const simulate = () => {
    if (!order) return;
    const result = scan(order.id);
    setScanCode(result.code);
    if (result.ok && scanRef.current) confetti(scanRef.current);
  };

  const renderScan = (code) => {
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
  };

  return (
    <>
      <div className={`overlay${checkoutOpen ? ' open' : ''}`} onClick={closeCheckout} aria-hidden="true" />
      <div className={`modal${checkoutOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-hidden={!checkoutOpen}>
        <div className="modal-card">
          <button className="x-btn modal-close" type="button" ref={closeRef} onClick={closeCheckout} aria-label={t('misc.close')}>
            <Icon name="close" />
          </button>

          <div className="progress" aria-hidden="true">
            <i className="on" />
            <i className={step >= 2 ? 'on' : ''} />
            <i className={step >= 2 ? 'on' : ''} />
          </div>

          {step === 1 ? (
            <>
              <h2>{t('checkout.title')}</h2>
              <p className="modal-sub">{t('checkout.sub')}</p>
              <form onSubmit={submit} noValidate>
                <div className={`field${errors.name ? ' invalid' : ''}`}>
                  <label htmlFor="fName">{t('checkout.name')}</label>
                  <input
                    id="fName"
                    ref={firstFieldRef}
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className={`field${errors.phone ? ' invalid' : ''}`}>
                  <label htmlFor="fPhone">{t('checkout.phone')}</label>
                  <input
                    id="fPhone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="01x xxxx xxxx"
                    value={form.phone}
                    onChange={update('phone')}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
                <div className={`field${errors.addr ? ' invalid' : ''}`}>
                  <label htmlFor="fAddr">{t('checkout.address')}</label>
                  <textarea
                    id="fAddr"
                    autoComplete="street-address"
                    value={form.addr}
                    onChange={update('addr')}
                    aria-invalid={Boolean(errors.addr)}
                  />
                  {errors.addr && <span className="field-error">{errors.addr}</span>}
                </div>

                <div className="totals modal-totals">
                  <div>
                    <span>
                      {cartCount} × {t('nav.cart')}
                    </span>
                    <span>{formatEGP(subtotal, lang)}</span>
                  </div>
                  {discount > 0 && (
                    <div>
                      <span>
                        {t('cart.pointsUsed')} (−{usedPoints})
                      </span>
                      <span>−{formatEGP(discount, lang)}</span>
                    </div>
                  )}
                  <div className="grand">
                    <span>{t('cart.total')}</span>
                    <span>{formatEGP(total, lang)}</span>
                  </div>
                </div>

                <button className="btn red wide" type="submit">
                  {t('checkout.place')}
                </button>
              </form>
            </>
          ) : (
            order && (
              <>
                <h2>{t('checkout.success')}</h2>
                <p className="modal-sub">{t('checkout.successSub')}</p>
                <div className="qr-box">
                  <QR text={`${order.payload}|${order.sig}`} size={200} />
                </div>
                <p className="mono order-id">{order.id}</p>
                <div className="status-row">
                  <span className={`status ${order.redeemed || scanCode === 'ok' ? 'ok' : 'wait'}`}>
                    {order.redeemed || scanCode === 'ok' ? t('checkout.verified') : t('checkout.waiting')}
                  </span>
                </div>
                <p className="held">
                  {t('checkout.held', { pts: order.pt, pieces: order.pieces.length })}
                </p>
                <div className="pieces">
                  {order.pieces.map((index) => (
                    <span key={index}>{WORD[index]}</span>
                  ))}
                </div>
                <div className="modal-actions">
                  <button className="btn green" type="button" ref={scanRef} onClick={simulate}>
                    {t('checkout.simulate')}
                  </button>
                  <button className="btn" type="button" onClick={closeCheckout}>
                    {t('checkout.done')}
                  </button>
                </div>
                {scanCode && <div className="scan-wrap">{renderScan(scanCode)}</div>}
              </>
            )
          )}
        </div>
      </div>
    </>
  );
}
