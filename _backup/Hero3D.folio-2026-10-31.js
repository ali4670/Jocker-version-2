import * as THREE from 'three';
import { clamp, lerp, smooth } from '../utils';

const N = 10;
const HERO = N - 1;
const INK = '#1A1A1A';
const PAPER = '#FDFBF7';
const PAPER_DEEP = '#F4EFE4';
const GOLD = '#FFC700';
const GOLD_DEEP = '#D6A100';
const RED = '#FF2A54';
const GREEN = '#00E676';
const CYAN = '#00B8D9';
const PURPLE = '#8A2BE2';

const FACES = ['star', 'diamond', 'moon', 'crown', 'key', 'eye', 'mask', 'star', 'diamond', 'hat'];
const FACE_NAMES = ['STAR', 'DIAMOND', 'MOON', 'CROWN', 'KEY', 'EYE', 'MASK', 'STAR', 'DIAMOND', 'THE JOKER'];
const FACE_COLORS = [RED, GOLD, CYAN, PURPLE, GREEN, PURPLE, RED, RED, GOLD, GOLD];
const PIPS = [[], [4], [0, 8], [0, 4, 8], [0, 2, 6, 8], [0, 2, 4, 6, 8], [0, 2, 3, 5, 6, 8]];

const roman = (i) => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'][i % 9];

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function drawHat(c, cx, cy, s, ink) {
  c.save();
  c.lineCap = 'round';
  c.lineJoin = 'round';
  const bells = [
    [RED, [-38, 40, -24, -6, -38, -22]],
    [GOLD, [0, 40, 0, -10, 0, -32]],
    [GREEN, [38, 40, 24, -6, 38, -22]],
  ];
  c.strokeStyle = ink;
  c.lineWidth = 16 * s;
  bells.forEach((b) => {
    c.beginPath();
    c.moveTo(cx + b[1][0] * s, cy + b[1][1] * s);
    c.quadraticCurveTo(cx + b[1][2] * s, cy + b[1][3] * s, cx + b[1][4] * s, cy + b[1][5] * s);
    c.stroke();
  });
  c.lineWidth = 11 * s;
  bells.forEach((b) => {
    c.strokeStyle = b[0];
    c.beginPath();
    c.moveTo(cx + b[1][0] * s, cy + b[1][1] * s);
    c.quadraticCurveTo(cx + b[1][2] * s, cy + b[1][3] * s, cx + b[1][4] * s, cy + b[1][5] * s);
    c.stroke();
  });
  c.fillStyle = ink;
  [[-38, -26], [0, -36], [38, -26]].forEach((p) => {
    c.beginPath();
    c.arc(cx + p[0] * s, cy + p[1] * s, 7.5 * s, 0, 7);
    c.fill();
  });
  c.strokeStyle = GOLD;
  c.lineWidth = Math.max(1, 1.4 * s);
  [[-38, -26], [0, -36], [38, -26]].forEach((p) => {
    c.beginPath();
    c.arc(cx + p[0] * s, cy + p[1] * s, 3.2 * s, 0, 7);
    c.stroke();
  });
  roundRect(c, cx - 28 * s, cy + 36 * s, 56 * s, 15 * s, 4 * s);
  c.fillStyle = ink;
  c.fill();
  c.strokeStyle = GOLD;
  c.lineWidth = Math.max(1, 1.1 * s);
  roundRect(c, cx - 24 * s, cy + 39.5 * s, 48 * s, 8 * s, 2.5 * s);
  c.stroke();
  c.restore();
}

function starPath(c, cx, cy, outer, inner) {
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? inner : outer;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i) c.lineTo(x, y);
    else c.moveTo(x, y);
  }
  c.closePath();
}

const PATHS = {
  star: 'M50,8 L61,38 L93,38 L67,57 L77,89 L50,70 L23,89 L33,57 L7,38 L39,38 Z',
  diamond: 'M50,6 L90,50 L50,94 L10,50 Z',
  moon: 'M62,10 A42,42 0 1 0 90,62 A34,34 0 1 1 62,10 Z',
  crown: 'M10,82 L10,30 L32,54 L50,16 L68,54 L90,30 L90,82 Z',
  mask: 'M8,32 Q50,8 92,32 Q92,66 66,76 Q50,81 34,76 Q8,66 8,32 Z',
  eye: 'M6,50 Q50,6 94,50 Q50,94 6,50 Z',
};

function drawSuit(c, kind, cx, cy, size, color) {
  c.save();
  c.translate(cx, cy);
  c.scale(size / 100, size / 100);
  c.lineJoin = 'round';
  c.lineCap = 'round';
  if (kind === 'hat') {
    drawHat(c, 0, -6, 1.55, INK);
    c.restore();
    return;
  }
  c.strokeStyle = INK;
  c.lineWidth = 3.4;
  if (kind === 'star') {
    starPath(c, 50, 50, 45, 19);
    c.fillStyle = color;
    c.fill();
    c.stroke();
    starPath(c, 50, 50, 21, 9);
    c.strokeStyle = 'rgba(253,251,247,.85)';
    c.lineWidth = 2;
    c.stroke();
    c.fillStyle = GOLD;
    c.strokeStyle = INK;
    c.lineWidth = 1.5;
    c.beginPath();
    c.arc(50, 50, 5.5, 0, 7);
    c.fill();
    c.stroke();
    c.restore();
    return;
  }
  if (kind === 'diamond') {
    c.fillStyle = color;
    c.fill(new Path2D(PATHS.diamond));
    c.stroke(new Path2D(PATHS.diamond));
    c.strokeStyle = 'rgba(26,26,26,.28)';
    c.lineWidth = 1.3;
    c.beginPath();
    c.moveTo(50, 14);
    c.lineTo(40, 50);
    c.lineTo(50, 86);
    c.lineTo(60, 50);
    c.closePath();
    c.moveTo(18, 50);
    c.lineTo(82, 50);
    c.stroke();
    c.restore();
    return;
  }
  if (kind === 'moon') {
    c.fillStyle = color;
    c.strokeStyle = INK;
    c.lineWidth = 3.4;
    c.fill(new Path2D(PATHS.moon));
    c.stroke(new Path2D(PATHS.moon));
    starPath(c, 76, 23, 11, 4.5);
    c.fillStyle = GOLD;
    c.fill();
    c.lineWidth = 1.4;
    c.stroke();
    c.restore();
    return;
  }
  if (kind === 'crown') {
    c.fillStyle = color;
    c.strokeStyle = INK;
    c.lineWidth = 3.4;
    c.fill(new Path2D(PATHS.crown));
    c.stroke(new Path2D(PATHS.crown));
    c.fillStyle = GOLD;
    c.strokeStyle = INK;
    c.lineWidth = 1.8;
    roundRect(c, 10, 79, 80, 12, 2);
    c.fill();
    c.stroke();
    [[10, 30], [50, 16], [90, 30]].forEach((p) => {
      c.beginPath();
      c.arc(p[0], p[1], 5, 0, 7);
      c.fillStyle = GOLD;
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.5;
      c.stroke();
    });
    c.fillStyle = INK;
    [30, 50, 70].forEach((x) => {
      c.beginPath();
      c.arc(x, 85, 2.4, 0, 7);
      c.fill();
    });
    c.restore();
    return;
  }
  if (kind === 'key') {
    c.strokeStyle = INK;
    c.lineWidth = 15;
    c.beginPath();
    c.arc(32, 32, 20, 0, 7);
    c.stroke();
    c.strokeStyle = color;
    c.lineWidth = 9.5;
    c.beginPath();
    c.arc(32, 32, 20, 0, 7);
    c.stroke();
    const shaft = () => {
      c.beginPath();
      c.moveTo(46, 46);
      c.lineTo(84, 84);
      c.moveTo(68, 68);
      c.lineTo(78, 58);
      c.moveTo(77, 77);
      c.lineTo(87, 67);
    };
    c.strokeStyle = INK;
    c.lineWidth = 14;
    shaft();
    c.stroke();
    c.strokeStyle = color;
    c.lineWidth = 8.5;
    shaft();
    c.stroke();
    c.fillStyle = PAPER;
    c.strokeStyle = INK;
    c.lineWidth = 1.6;
    c.beginPath();
    c.arc(32, 32, 9, 0, 7);
    c.fill();
    c.stroke();
    c.restore();
    return;
  }
  if (kind === 'mask') {
    c.fillStyle = color;
    c.strokeStyle = INK;
    c.lineWidth = 3.4;
    c.fill(new Path2D(PATHS.mask));
    c.stroke(new Path2D(PATHS.mask));
    c.fillStyle = INK;
    [-16, 16].forEach((dx) => {
      c.beginPath();
      c.ellipse(50 + dx, 43, 8.5, 6.5, 0, 0, 7);
      c.fill();
    });
    c.fillStyle = 'rgba(253,251,247,.75)';
    [-18, 14].forEach((dx, idx) => {
      c.beginPath();
      c.arc(50 + dx, 41 + idx, 1.7, 0, 7);
      c.fill();
    });
    c.strokeStyle = INK;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(41, 63);
    c.quadraticCurveTo(50, 70, 59, 63);
    c.stroke();
    c.strokeStyle = GOLD;
    c.lineWidth = 1.4;
    c.beginPath();
    c.moveTo(22, 30);
    c.quadraticCurveTo(34, 22, 46, 30);
    c.moveTo(54, 30);
    c.quadraticCurveTo(66, 22, 78, 30);
    c.stroke();
    c.restore();
    return;
  }
  if (kind === 'eye') {
    c.fillStyle = color;
    c.strokeStyle = INK;
    c.lineWidth = 3.4;
    c.fill(new Path2D(PATHS.eye));
    c.stroke(new Path2D(PATHS.eye));
    c.fillStyle = INK;
    c.beginPath();
    c.arc(50, 50, 17, 0, 7);
    c.fill();
    c.fillStyle = GOLD;
    c.beginPath();
    c.arc(50, 50, 9, 0, 7);
    c.fill();
    c.fillStyle = PAPER;
    c.beginPath();
    c.arc(45, 45, 3.4, 0, 7);
    c.fill();
    c.restore();
    return;
  }
  c.restore();
}

function spacedText(c, text, cx, y, gap) {
  const chars = Array.from(text);
  const widths = chars.map((ch) => c.measureText(ch).width);
  const total = widths.reduce((sum, w) => sum + w, 0) + gap * (chars.length - 1);
  let x = cx - total / 2;
  chars.forEach((ch, i) => {
    c.fillText(ch, x, y);
    x += widths[i] + gap;
  });
}

function micro(c, text, cx, y, gap, size = 7, color = INK) {
  c.fillStyle = color;
  c.font = `500 ${size}px "DM Mono",monospace`;
  c.textAlign = 'left';
  spacedText(c, text, cx, y, gap);
}

function diamond(c, x, y, size, color) {
  c.save();
  c.translate(x, y);
  c.rotate(Math.PI / 4);
  c.fillStyle = color;
  c.fillRect(-size / 2, -size / 2, size, size);
  c.restore();
}

function paperBase(c, w, h) {
  const g = c.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, PAPER);
  g.addColorStop(0.55, PAPER);
  g.addColorStop(1, PAPER_DEEP);
  c.fillStyle = g;
  roundRect(c, 0, 0, w, h, 10);
  c.fill();
}

function cardFrame(c, w, h, accent) {
  c.strokeStyle = 'rgba(26,26,26,.32)';
  c.lineWidth = 1;
  roundRect(c, 8, 8, w - 16, h - 16, 8);
  c.stroke();
  c.strokeStyle = accent;
  c.lineWidth = 1.5;
  roundRect(c, 15, 15, w - 30, h - 30, 6);
  c.stroke();
  c.strokeStyle = 'rgba(26,26,26,.18)';
  c.lineWidth = 0.8;
  roundRect(c, 20, 20, w - 40, h - 40, 4);
  c.stroke();
}

function dottedRing(c, cx, cy, r, color, count = 44, size = 1.1) {
  c.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    c.beginPath();
    c.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, size, 0, 7);
    c.fill();
  }
}

function sunburst(c, cx, cy, r, rays, color, lw = 0.8) {
  c.strokeStyle = color;
  c.lineWidth = lw;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    const inner = i % 2 ? r * 0.5 : r * 0.28;
    c.beginPath();
    c.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
    c.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    c.stroke();
  }
}

function archPath(c, left, right, top, bottom, shoulder) {
  c.beginPath();
  c.moveTo(left, bottom);
  c.lineTo(left, shoulder);
  c.bezierCurveTo(left, shoulder - 34, left + (right - left) * 0.26, top, 150, top);
  c.bezierCurveTo(right - (right - left) * 0.26, top, right, shoulder - 34, right, shoulder);
  c.lineTo(right, bottom);
  c.closePath();
}

function cornerFans(c, w, h, color) {
  const spots = [
    [16, 16, 1, 1],
    [w - 16, 16, -1, 1],
    [16, h - 16, 1, -1],
    [w - 16, h - 16, -1, -1],
  ];
  c.strokeStyle = color;
  c.lineWidth = 0.8;
  spots.forEach((s) => {
    c.save();
    c.translate(s[0], s[1]);
    c.scale(s[2], s[3]);
    [26, 34, 42].forEach((r) => {
      c.beginPath();
      c.arc(0, 0, r, 0, Math.PI / 2);
      c.stroke();
    });
    c.restore();
  });
}

function flourish(c, cx, cy, s, color) {
  c.strokeStyle = color;
  c.lineWidth = 0.9;
  c.beginPath();
  c.moveTo(cx - 26 * s, cy);
  c.lineTo(cx - 7 * s, cy);
  c.moveTo(cx + 7 * s, cy);
  c.lineTo(cx + 26 * s, cy);
  c.stroke();
  diamond(c, cx, cy, 5 * s, color);
  c.fillStyle = color;
  [-31, 31].forEach((x) => {
    c.beginPath();
    c.arc(cx + x * s, cy, 1.3 * s, 0, 7);
    c.fill();
  });
}



export function createHero3D(canvas, hero) {
  if (!canvas || !hero) return null;

  const st = { p: 0, sp: 0, mx: 0, my: 0, smx: 0, smy: 0, vis: true };
  let renderer = null;
  let scene = null;
  let camera = null;
  const deck = [];
  const props = [];
  let group = null;
  let pgroup = null;
  let shadow = null;
  let ready = false;
  let baseSc = 1;
  let baseX = 0;
  let isWide = true;
  let width = 1;
  let height = 1;
  let raf = 0;
  let lastT = 0;
  let observer = null;
  let disposed = false;
  const textures = [];

  const mkTex = (w, h, draw) => {
    const ss = 2;
    const c = document.createElement('canvas');
    c.width = w * ss;
    c.height = h * ss;
    const ctx = c.getContext('2d');
    ctx.scale(ss, ss);
    draw(ctx, w, h);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 4;
    t.colorSpace = THREE.SRGBColorSpace;
    textures.push(t);
    return t;
  };

  const backTex = () =>
    mkTex(300, 420, (c, w, h) => {
      paperBase(c, w, h);

      c.save();
      roundRect(c, 0, 0, w, h, 10);
      c.clip();
      c.strokeStyle = 'rgba(255,199,0,.20)';
      c.lineWidth = 0.7;
      for (let i = -h; i < w + h; i += 18) {
        c.beginPath();
        c.moveTo(i, 0);
        c.lineTo(i + h, h);
        c.stroke();
        c.beginPath();
        c.moveTo(i, 0);
        c.lineTo(i - h, h);
        c.stroke();
      }
      c.restore();

      cardFrame(c, w, h, GOLD_DEEP);
      cornerFans(c, w, h, 'rgba(214,161,0,.55)');
      micro(c, "THE JOKER'S FOLIO", w / 2, 38, 4, 7, INK);

      archPath(c, 62, 238, 76, 344, 150);
      c.fillStyle = PAPER;
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.2;
      c.stroke();
      archPath(c, 69, 231, 83, 337, 155);
      c.strokeStyle = 'rgba(214,161,0,.9)';
      c.lineWidth = 1;
      c.stroke();

      c.save();
      archPath(c, 62, 238, 76, 344, 150);
      c.clip();
      sunburst(c, w / 2, 150, 88, 36, 'rgba(255,199,0,.35)', 0.7);
      c.restore();

      drawHat(c, w / 2, 158, 1.45, INK);

      c.textAlign = 'center';
      c.font = '40px "Bowlby One",Impact,sans-serif';
      c.fillStyle = INK;
      c.fillText('JOKER', w / 2, 288);
      flourish(c, w / 2, 305, 1.05, RED);
      micro(c, 'JUST A JOKER BOX', w / 2, 322, 3, 7, INK);
      micro(c, 'FANTASY, NOT LOGIC', w / 2, 336, 2.5, 6, INK);
      micro(c, 'EST. MMXXV', w / 2, 366, 4, 6.5, INK);
    });

  const faceTex = (i) =>
    mkTex(300, 420, (c, w, h) => {
      const suit = FACES[i];
      const color = FACE_COLORS[i];
      paperBase(c, w, h);
      cardFrame(c, w, h, color === GOLD ? GOLD_DEEP : color);
      micro(c, 'JUST A JOKER BOX', w / 2, 38, 3, 7, INK);

      c.fillStyle = INK;
      c.font = '24px "Bowlby One",Impact,sans-serif';
      c.textAlign = 'left';
      c.fillText(roman(i), 28, 70);
      drawSuit(c, suit, 38, 90, 18, color);
      diamond(c, w - 34, 50, 5, color);
      diamond(c, 34, h - 50, 5, color);
      c.save();
      c.translate(w - 28, h - 70);
      c.rotate(Math.PI);
      c.fillText(roman(i), 0, 0);
      c.restore();
      c.save();
      c.translate(w - 38, h - 90);
      c.rotate(Math.PI);
      drawSuit(c, suit, 0, 0, 18, color);
      c.restore();

      c.strokeStyle = 'rgba(26,26,26,.30)';
      c.lineWidth = 1;
      c.beginPath();
      c.arc(w / 2, 202, 86, 0, 7);
      c.stroke();
      dottedRing(c, w / 2, 202, 80, 'rgba(26,26,26,.28)', 48, 1);
      c.strokeStyle = color === GOLD ? GOLD_DEEP : color;
      c.lineWidth = 1.2;
      c.beginPath();
      c.arc(w / 2, 202, 74, 0, 7);
      c.stroke();
      sunburst(c, w / 2, 202, 70, 32, 'rgba(26,26,26,.05)', 0.6);
      drawSuit(c, suit, w / 2, 202, 112, color);

      micro(c, FACE_NAMES[i], w / 2, 318, 4, 8, color === GOLD ? GOLD_DEEP : color);
      flourish(c, w / 2, 336, 0.9, 'rgba(214,161,0,.9)');
      c.fillStyle = INK;
      c.font = '20px "Bowlby One",Impact,sans-serif';
      c.textAlign = 'center';
      c.fillText('JOKER', w / 2, 364);
      micro(c, 'A JOKER BOX GAME', w / 2, 382, 2.5, 6, INK);
    });

  const heroTex = () =>
    mkTex(300, 420, (c, w, h) => {
      paperBase(c, w, h);
      cardFrame(c, w, h, GOLD_DEEP);
      cornerFans(c, w, h, 'rgba(255,42,84,.45)');
      micro(c, 'A JOKER BOX GAME', w / 2, 38, 3, 7, INK);
      micro(c, 'THE JOKER', w / 2, 84, 5, 8, RED);

      sunburst(c, w / 2, 180, 108, 48, 'rgba(255,199,0,.25)', 0.8);
      c.strokeStyle = 'rgba(214,161,0,.55)';
      c.lineWidth = 0.9;
      [86, 92].forEach((r) => {
        c.beginPath();
        c.arc(w / 2, 178, r, 0, 7);
        c.stroke();
      });
      dottedRing(c, w / 2, 178, 96, 'rgba(255,199,0,.45)', 56, 1.1);

      c.fillStyle = GOLD_DEEP;
      c.font = '24px "Bowlby One",Impact,sans-serif';
      c.textAlign = 'left';
      c.fillText('0', 28, 70);
      c.save();
      c.translate(w - 28, h - 70);
      c.rotate(Math.PI);
      c.fillText('0', 0, 0);
      c.restore();

      drawHat(c, w / 2, 172, 1.8, INK);

      c.font = '62px "Bowlby One",Impact,sans-serif';
      c.textAlign = 'center';
      c.lineJoin = 'round';
      c.fillStyle = GOLD;
      c.fillText('JOKER', w / 2 + 6, 340);
      c.lineWidth = 3.5;
      c.strokeStyle = INK;
      c.strokeText('JOKER', w / 2, 334);
      c.fillStyle = RED;
      c.fillText('JOKER', w / 2, 334);

      micro(c, 'FANTASY Â· CARDS Â· PIECES', w / 2, 364, 2, 7, INK);
      micro(c, 'ONE BOX Â· TEN PIECES', w / 2, 384, 3, 6, INK);
    });

  const pipTex = (n, bg, fg) =>
    mkTex(128, 128, (c, w, h) => {
      c.fillStyle = bg;
      c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(26,26,26,.55)';
      c.lineWidth = 3;
      c.strokeRect(4, 4, w - 8, h - 8);
      c.fillStyle = fg;
      PIPS[n].forEach((k) => {
        c.beginPath();
        c.arc(30 + (k % 3) * 34, 30 + Math.floor(k / 3) * 34, 10, 0, 7);
        c.fill();
      });
    });

  const dice = (bg, fg) => {
    const m = [1, 6, 2, 5, 3, 4].map(
      (n) => new THREE.MeshStandardMaterial({ map: pipTex(n, bg, fg), roughness: 0.45 })
    );
    return new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.78, 0.78), m);
  };

  const shadowTex = () =>
    mkTex(128, 128, (c, w, h) => {
      const g = c.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
      g.addColorStop(0, 'rgba(26,26,26,.6)');
      g.addColorStop(1, 'rgba(26,26,26,0)');
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    });

  function build() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
    camera.position.set(0, 0, 9.5);
    scene.add(new THREE.AmbientLight(0xfff3dc, 0.64));
    const key = new THREE.DirectionalLight(0xffe2a8, 0.42);
    key.position.set(-4, 5, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0xff2a54, 0.7, 22);
    rim.position.set(5, 2, 4);
    scene.add(rim);
    const rim2 = new THREE.PointLight(0x8a2be2, 0.7, 22);
    rim2.position.set(-5, -3, 3);
    scene.add(rim2);
    group = new THREE.Group();
    pgroup = new THREE.Group();
    scene.add(pgroup);
    scene.add(group);

    const geo = new THREE.BoxGeometry(1.5, 2.1, 0.014);
    const edge = new THREE.MeshStandardMaterial({ color: 0xfdfbf7, roughness: 0.8 });
    const back = backTex();
    for (let i = 0; i < N; i++) {
      const front = i === HERO ? heroTex() : faceTex(i);
      const m = [
        edge,
        edge,
        edge,
        edge,
        new THREE.MeshStandardMaterial({ map: front, roughness: 0.55, alphaTest: 0.5 }),
        new THREE.MeshStandardMaterial({ map: back, roughness: 0.55, alphaTest: 0.5 }),
      ];
      const c = new THREE.Mesh(geo, m);
      c.rotation.y = Math.PI;
      group.add(c);
      deck.push(c);
    }

    shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 1.1),
      new THREE.MeshBasicMaterial({ map: shadowTex(), transparent: true, depthWrite: false })
    );
    shadow.position.set(0, -1.5, -0.6);
    group.add(shadow);

    const d1 = dice(PAPER, RED);
    const d2 = dice(RED, PAPER);
    const d3 = dice(GOLD, INK);
    const d4 = dice(INK, GOLD);
    const placements = [
      [d1, -1.6, 1.9, 1.3, 0.9],
      [d2, 2.6, 2.0, 0.6, 0.6],
      [d3, -1.3, -1.8, 0.6, 1.1],
      [d4, 2.9, -1.9, 1.4, 0.8],
    ];
    placements.forEach((p, i) => {
      const m = p[0];
      m.position.set(p[1], p[2], p[3]);
      m.userData = {
        bx: p[1],
        by: p[2],
        d: p[4],
        r: [0.3 + i * 0.07, 0.4 - i * 0.05, 0.2 + i * 0.04],
      };
      m.rotation.set(i * 0.9, i * 0.6, i * 0.3);
      pgroup.add(m);
      props.push(m);
    });
  }

  function resize() {
    if (!renderer || !camera) return;
    width = hero.clientWidth;
    height = hero.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const wide = width / height > 1.05;
    const sc =
      (wide ? clamp(height / 820, 0.62, 1.15) * 1.32 : clamp(width / 420, 0.62, 1) * 0.84) * 0.82;
    const vh = 2 * Math.tan(THREE.MathUtils.degToRad(17.5)) * 9.5;
    const vw = vh * camera.aspect;
    const cx = wide ? vw * 0.235 : 0;
    const cy = wide ? -0.05 : vh * 0.235;
    baseSc = sc;
    baseX = cx;
    isWide = wide;
    group.scale.setScalar(sc);
    group.position.set(cx, cy, 0);
    pgroup.scale.setScalar(wide ? sc * 0.85 : sc * 0.8);
    pgroup.position.set(cx, cy, -0.4);
  }

  function layout(p, t) {
    const A = smooth(clamp(p / 0.3));
    const B = smooth(clamp((p - 0.3) / 0.4));
    const C = smooth(clamp((p - 0.72) / 0.28));
    const s = Math.sin(Math.PI * A);
    const R = 2.5;
    for (let i = 0; i < N; i++) {
      const c = deck[i];
      const half = i % 2;
      const spread = (i - (N - 1) / 2) / (N - 1);
      const ang = spread * 1.5 * B;
      let x = (half ? 1 : -1) * s * 1.05 * (1 - B) + Math.sin(ang) * R;
      let y =
        Math.sin(A * Math.PI * 2 + i * 1.1) * 0.16 * s * (1 - B) +
        (Math.cos(ang) - 1) * R +
        B * 0.62 +
        Math.sin(t * 0.0012 + i) * 0.012;
      let z = i * 0.04 + (half && s > 0 ? s * 0.15 : 0);
      let rz = (half ? -1 : 1) * s * 0.24 * (1 - B) - ang + Math.sin(i * 12.9) * 0.5 * 0.05 * (1 - B);
      let ry = Math.PI;
      let sc = 1;
      if (i === HERO) {
        x = lerp(x, 0, C);
        y = lerp(y, 0.45, C);
        z = lerp(z, 0.7, C);
        rz = lerp(rz, 0, C);
        ry = Math.PI * (1 - C);
        sc = 1 + 0.22 * C;
      } else {
        y -= 0.3 * C;
        sc = 1 - 0.06 * C;
      }
      c.position.set(x, y, z);
      c.rotation.set(0, ry, rz);
      c.scale.setScalar(sc);
    }
    shadow.material.opacity = 0.9 - 0.35 * C;
    shadow.scale.set(1 + B * 0.5, 1, 1);
    shadow.position.y = -1.5 + B * -0.25;
    return B;
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (!st.vis || !ready || disposed) return;
    const dt = Math.min(0.1, (t - lastT) / 1000 || 0.016);
    lastT = t;
    const k1 = 1 - Math.exp(-dt * 6);
    const k2 = 1 - Math.exp(-dt * 3.6);
    st.sp += (st.p - st.sp) * k1;
    st.smx += (st.mx - st.smx) * k2;
    st.smy += (st.my - st.smy) * k2;
    const Bv = layout(st.sp, t);
    group.scale.setScalar(baseSc * (1 - 0.17 * Bv));
    group.position.x = baseX - (isWide ? Bv * 0.55 : 0);
    group.rotation.y = st.smx * 0.3;
    group.rotation.x = -st.smy * 0.2 + Math.sin(t * 0.0009) * 0.03;
    pgroup.rotation.y = st.smx * 0.18;
    props.forEach((m) => {
      const u = m.userData;
      m.rotation.x += u.r[0] * 0.7 * dt;
      m.rotation.y += u.r[1] * 0.7 * dt;
      m.rotation.z += u.r[2] * 0.5 * dt;
      m.position.x = u.bx + st.smx * u.d * 0.9;
      m.position.y = u.by + Math.sin(t * 0.0011 * u.d + u.bx) * 0.18 + st.smy * -u.d * 0.7 + st.sp * u.d * 0.6;
    });
    renderer.render(scene, camera);
  }

  function init() {
    if (disposed) return;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      build();
      resize();
      ready = true;
      window.addEventListener('resize', resize);
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      observer = new IntersectionObserver(
        (entries) => {
          st.vis = entries[0].isIntersecting;
        },
        { rootMargin: '80px' }
      );
      observer.observe(hero);
      raf = requestAnimationFrame(frame);
    } catch (err) {
      hero.classList.add('no-gl');
      console.warn('WebGL unavailable', err);
    }
  }

  function onPointerMove(e) {
    st.mx = (e.clientX / window.innerWidth) * 2 - 1;
    st.my = (e.clientY / window.innerHeight) * 2 - 1;
  }

  function start() {
    const go = () => init();
    if (document.fonts?.load) {
      Promise.all([document.fonts.load('40px "Bowlby One"'), document.fonts.load('15px "DM Mono"')])
        .then(go, go);
    } else {
      go();
    }
  }

  function jump(p) {
    st.p = p;
    st.sp = p;
    if (!ready || !renderer || !scene || !camera) return;
    layout(p, 0);
    renderer.render(scene, camera);
  }

  function dispose() {
    disposed = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
    if (observer) observer.disconnect();
    textures.forEach((t) => t.dispose());
    if (scene) {
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
    }
    if (renderer) {
      renderer.dispose();
      renderer = null;
    }
    ready = false;
  }

  return {
    start,
    setProgress: (p) => {
      st.p = p;
    },
    jump,
    dispose,
  };
}
