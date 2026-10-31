import { useEffect, useRef } from 'react';
import { clamp, isFinePointer, prefersReducedMotion, vibrate } from '../utils';
import { Icon } from './Icons.jsx';

export default function Cursor() {
  const cursorRef = useRef(null);
  const tiltRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return undefined;
    const el = cursorRef.current;
    const tilt = tiltRef.current;
    if (!el || !tilt) return undefined;

    document.documentElement.classList.add('has-cursor');

    let tx = -100;
    let ty = -100;
    let x = -100;
    let y = -100;
    let raf = 0;

    const onMove = (event) => {
      if (event.pointerType === 'touch') return;
      tx = event.clientX;
      ty = event.clientY;
      el.classList.add('on');
    };
    const onLeave = () => el.classList.remove('on');
    const onOver = (event) => {
      const target = event.target.closest?.(
        'a,button,[data-cursor],input,textarea,summary,label,[role="button"]'
      );
      if (target) {
        el.classList.add('hov');
        const label = target.getAttribute('data-cursor') || (target.matches('input,textarea') ? 'TYPE' : 'GO');
        if (labelRef.current) labelRef.current.textContent = label.slice(0, 6);
      } else {
        el.classList.remove('hov');
      }
    };
    const onDown = () => {
      el.classList.add('dn');
      vibrate(8);
    };
    const onUp = () => el.classList.remove('dn');

    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      const rotation = clamp((tx - x) * 0.7, -28, 28);
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      tilt.style.transform = `rotate(${rotation}deg)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerover', onOver);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div id="cursor" ref={cursorRef} aria-hidden="true">
      <div className="cursor-tilt" ref={tiltRef}>
        <div className="cursor-flip">
          <div className="cursor-face cursor-front">
            <Icon name="diamond" />
          </div>
          <div className="cursor-face cursor-back" ref={labelRef}>
            GO
          </div>
        </div>
      </div>
    </div>
  );
}
