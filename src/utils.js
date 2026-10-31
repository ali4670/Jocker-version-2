import gsap from 'gsap';

export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

export function cyrb53(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export function vibrate(pattern) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (e) {
    /* ignore */
  }
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isFinePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function confetti(fromEl) {
  if (!fromEl || prefersReducedMotion()) return;
  const rect = fromEl.getBoundingClientRect();
  const colors = ['#FF2A54', '#FFC700', '#00E676', '#8A2BE2', '#00B8D9'];
  for (let i = 0; i < 30; i++) {
    const dot = document.createElement('div');
    dot.className = 'cf';
    dot.style.background = colors[i % colors.length];
    dot.style.borderRadius = i % 3 ? '2px' : '50%';
    document.body.appendChild(dot);
    const angle = Math.random() * Math.PI * 2;
    const velocity = 120 + Math.random() * 220;
    gsap.fromTo(
      dot,
      { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, rotation: 0, opacity: 1 },
      {
        x: rect.left + rect.width / 2 + Math.cos(angle) * velocity,
        y: rect.top + rect.height / 2 + Math.sin(angle) * velocity - 70,
        rotation: Math.random() * 720,
        duration: 1.05,
        ease: 'power2.out',
      }
    );
    gsap.to(dot, {
      y: '+=240',
      opacity: 0,
      duration: 0.8,
      delay: 0.85,
      ease: 'power1.in',
      onComplete: () => dot.remove(),
    });
  }
}

export function flyToCart(fromEl) {
  if (!fromEl || prefersReducedMotion()) return;
  const target = document.getElementById('cart-btn');
  if (!target) return;
  const from = fromEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const fly = document.createElement('div');
  fly.className = 'fly';
  document.body.appendChild(fly);
  gsap
    .timeline({
      onComplete: () => {
        fly.remove();
        gsap.fromTo('#cart-btn', { scale: 1.22 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1.2,.4)' });
      },
    })
    .fromTo(
      fly,
      {
        x: from.left + from.width / 2 - 17,
        y: from.top + from.height / 2 - 24,
        rotation: -10,
        scale: 1,
      },
      {
        x: to.left + to.width / 2 - 17,
        y: to.top + to.height / 2 - 24,
        rotation: 200,
        scale: 0.4,
        duration: 0.7,
        ease: 'power3.inOut',
      }
    );
}
