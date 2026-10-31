import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function QR({ text, size = 200 }) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      color: { dark: '#1A1A1A', light: '#FFFFFF' },
      errorCorrectionLevel: 'L',
    })
      .then((url) => {
        if (alive) setSrc(url);
      })
      .catch(() => {
        if (alive) setSrc('');
      });
    return () => {
      alive = false;
    };
  }, [text, size]);

  if (!src) {
    return (
      <div className="qr-loading" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    );
  }

  return <img className="qr-img" src={src} width={size} height={size} alt="Order QR code" />;
}
