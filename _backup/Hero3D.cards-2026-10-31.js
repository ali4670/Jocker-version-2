import * as THREE from 'three';
import { clamp, lerp, smooth } from '../utils';

const N = 10;
const HERO = N - 1;
const FACES = ['star', 'diamond', 'moon', 'crown', 'key', 'eye', 'mask', 'star', 'diamond', 'hat'];
const FACE_COLORS = [
  '#FF2A54',
  '#FFC700',
  '#00E676',
  '#8A2BE2',
  '#00B8D9',
  '#FF7A00',
  '#E91E63',
  '#4D5BFF',
  '#FF2A54',
  '#1A1A1A',
];
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
  c.lineCap = 'round';
  c.lineWidth = 15 * s;
  [
    ['#FF2A54', [-38, 40, -24, -6, -38, -22]],
    ['#FFC700', [0, 40, 0, -10, 0, -32]],
    ['#00E676', [38, 40, 24, -6, 38, -22]],
  ].forEach((a) => {
    c.strokeStyle = a[0];
    c.beginPath();
    c.moveTo(cx + a[1][0] * s, cy + a[1][1] * s);
    c.quadraticCurveTo(cx + a[1][2] * s, cy + a[1][3] * s, cx + a[1][4] * s, cy + a[1][5] * s);
    c.stroke();
  });
  c.fillStyle = ink;
  [[-38, -26], [0, -36], [38, -26]].forEach((p) => {
    c.beginPath();
    c.arc(cx + p[0] * s, cy + p[1] * s, 8 * s, 0, 7);
    c.fill();
  });
  roundRect(c, cx - 28 * s, cy + 36 * s, 56 * s, 16 * s, 4 * s);
  c.fill();
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
  if (kind === 'hat') {
    drawHat(c, 0, -6, 1.55, '#1A1A1A');
    c.restore();
    return;
  }
  c.fillStyle = color;
  c.strokeStyle = '#1A1A1A';
  c.lineWidth = 5;
  c.lineJoin = 'round';
  c.beginPath();
  if (kind === 'key') {
    c.lineWidth = 12;
    c.strokeStyle = color;
    c.arc(34, 34, 22, 0, 7);
    c.stroke();
    c.beginPath();
    c.moveTo(50, 50);
    c.lineTo(86, 86);
    c.moveTo(70, 70);
    c.lineTo(80, 60);
    c.moveTo(78, 78);
    c.lineTo(88, 68);
    c.lineCap = 'round';
    c.stroke();
    c.restore();
    return;
  }
  c.fill(new Path2D(PATHS[kind]));
  c.stroke(new Path2D(PATHS[kind]));
  if (kind === 'crown') {
    c.fillStyle = '#1A1A1A';
    c.fillRect(10, 82, 80, 9);
  }
  if (kind === 'mask') {
    c.fillStyle = '#1A1A1A';
    c.beginPath();
    c.arc(34, 42, 9, 0, 7);
    c.fill();
    c.beginPath();
    c.arc(66, 42, 9, 0, 7);
    c.fill();
    c.strokeStyle = '#1A1A1A';
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(42, 62);
    c.quadraticCurveTo(50, 68, 58, 62);
    c.stroke();
  }
  if (kind === 'eye') {
    c.fillStyle = '#1A1A1A';
    c.beginPath();
    c.arc(50, 50, 17, 0, 7);
    c.fill();
    c.fillStyle = color;
    c.beginPath();
    c.arc(50, 50, 6, 0, 7);
    c.fill();
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

function disc(c, cx, cy, r, color, offset = 9) {
  c.fillStyle = '#1A1A1A';
  c.beginPath();
  c.arc(cx + offset, cy + offset, r, 0, 7);
  c.fill();
  c.fillStyle = color;
  c.beginPath();
  c.arc(cx, cy, r, 0, 7);
  c.fill();
  c.strokeStyle = '#1A1A1A';
  c.lineWidth = 5;
  c.beginPath();
  c.arc(cx, cy, r, 0, 7);
  c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.92)';
  c.lineWidth = 4;
  c.beginPath();
  c.arc(cx, cy, r - 10, 0, 7);
  c.stroke();
}

function diamond(c, x, y, size, color) {
  c.save();
  c.translate(x, y);
  c.rotate(Math.PI / 4);
  c.fillStyle = color;
  c.fillRect(-size / 2, -size / 2, size, size);
  c.restore();
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
      c.fillStyle = '#FFFFFF';
      roundRect(c, 0, 0, w, h, 10);
      c.fill();

      c.save();
      roundRect(c, 0, 0, w, h, 10);
      c.clip();
      c.strokeStyle = 'rgba(255,42,84,.10)';
      c.lineWidth = 2;
      for (let i = -h; i < w + h; i += 14) {
        c.beginPath();
        c.moveTo(i, 0);
        c.lineTo(i + h, h);
        c.stroke();
      }
      c.restore();

      c.strokeStyle = 'rgba(26,26,26,.20)';
      c.lineWidth = 2;
      roundRect(c, 7, 7, w - 14, h - 14, 8);
      c.stroke();
      c.strokeStyle = 'rgba(26,26,26,.12)';
      c.lineWidth = 1.5;
      roundRect(c, 18, 18, w - 36, h - 36, 5);
      c.stroke();

      c.fillStyle = '#1A1A1A';
      c.font = '500 11px "DM Mono",monospace';
      c.textAlign = 'left';
      spacedText(c, 'JUST A JOKER BOX', w / 2, 54, 3);

      drawHat(c, w / 2, 168, 2.2, '#1A1A1A');

      c.font = '60px "Bowlby One",Impact,sans-serif';
      c.textAlign = 'center';
      c.lineJoin = 'round';
      c.fillStyle = '#FF2A54';
      c.fillText('JOKER', w / 2 + 6, 360);
      c.lineWidth = 9;
      c.strokeStyle = '#1A1A1A';
      c.strokeText('JOKER', w / 2, 352);
      c.fillStyle = '#1A1A1A';
      c.fillText('JOKER', w / 2, 352);

      c.fillStyle = '#1A1A1A';
      c.font = '500 10px "DM Mono",monospace';
      c.textAlign = 'left';
      spacedText(c, 'COLLECTOR DECK', w / 2, 390, 4);
    });

  const faceTex = (i) =>
    mkTex(300, 420, (c, w, h) => {
      const suit = FACES[i];
      const color = FACE_COLORS[i];
      const accent = FACE_COLORS[(i + 3) % 9];
      c.fillStyle = '#FFFFFF';
      roundRect(c, 0, 0, w, h, 10);
      c.fill();
      c.strokeStyle = 'rgba(26,26,26,.18)';
      c.lineWidth = 2;
      roundRect(c, 7, 7, w - 14, h - 14, 8);
      c.stroke();
      c.strokeStyle = color;
      c.lineWidth = 2.5;
      roundRect(c, 18, 18, w - 36, h - 36, 5);
      c.stroke();

      c.fillStyle = '#1A1A1A';
      c.font = '38px "Bowlby One",Impact,sans-serif';
      c.textAlign = 'left';
      c.fillText(roman(i), 32, 68);
      drawSuit(c, suit, 46, 102, 30, color);
      diamond(c, w - 50, 54, 6, accent);
      c.save();
      c.translate(w - 32, h - 68);
      c.rotate(Math.PI);
      c.fillText(roman(i), 0, 0);
      c.restore();
      c.save();
      c.translate(w - 46, h - 102);
      c.rotate(Math.PI);
      drawSuit(c, suit, 0, 0, 30, color);
      c.restore();
      diamond(c, 50, h - 54, 6, accent);

      disc(c, w / 2, 204, 88, color, 9);
      const dark = color === '#FFC700' || color === '#00E676' || color === '#FF7A00';
      drawSuit(c, suit, w / 2, 204, 142, dark ? '#1A1A1A' : '#FFFFFF');

      c.fillStyle = 'rgba(26,26,26,.16)';
      roundRect(c, w / 2 - 56, 341, 112, 26, 13);
      c.fill();
      c.fillStyle = '#FFFFFF';
      roundRect(c, w / 2 - 60, 336, 120, 26, 13);
      c.fill();
      c.strokeStyle = '#1A1A1A';
      c.lineWidth = 2;
      roundRect(c, w / 2 - 60, 336, 120, 26, 13);
      c.stroke();
      c.fillStyle = '#1A1A1A';
      c.font = '500 13px "DM Mono",monospace';
      c.textAlign = 'left';
      spacedText(c, 'JOKER', w / 2, 354, 6);
    });

  const heroTex = () =>
    mkTex(300, 420, (c, w, h) => {
      c.fillStyle = '#FFFFFF';
      roundRect(c, 0, 0, w, h, 10);
      c.fill();
      c.strokeStyle = 'rgba(26,26,26,.18)';
      c.lineWidth = 2;
      roundRect(c, 7, 7, w - 14, h - 14, 8);
      c.stroke();
      c.strokeStyle = '#FFC700';
      c.lineWidth = 2.5;
      roundRect(c, 18, 18, w - 36, h - 36, 5);
      c.stroke();
      diamond(c, 40, 46, 6, '#FF2A54');
      diamond(c, w - 40, 46, 6, '#FF2A54');

      c.fillStyle = '#1A1A1A';
      c.font = '500 12px "DM Mono",monospace';
      c.textAlign = 'left';
      spacedText(c, 'A JOKER BOX GAME', w / 2, 64, 2);

      drawHat(c, w / 2, 160, 2, '#1A1A1A');

      c.font = '70px "Bowlby One",Impact,sans-serif';
      c.textAlign = 'center';
      c.lineJoin = 'round';
      c.fillStyle = '#FFC700';
      c.fillText('JOKER', w / 2 + 6, 338);
      c.lineWidth = 13;
      c.strokeStyle = '#1A1A1A';
      c.strokeText('JOKER', w / 2, 330);
      c.fillStyle = '#FF2A54';
      c.fillText('JOKER', w / 2, 330);

      c.fillStyle = '#1A1A1A';
      c.font = '500 10px "DM Mono",monospace';
      c.textAlign = 'left';
      spacedText(c, 'FANTASY · CARDS · PIECES', w / 2, 364, 2);
      spacedText(c, 'ONE BOX · TEN PIECES', w / 2, 386, 3);
    });

  const pipTex = (n, bg, fg) =>
    mkTex(128, 128, (c, w, h) => {
      c.fillStyle = bg;
      c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(26,26,26,.7)';
      c.lineWidth = 6;
      c.strokeRect(3, 3, w - 6, h - 6);
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
    const edge = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
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

    const d1 = dice('#FF2A54', '#FFF8E8');
    const d2 = dice('#FFC700', '#1A1A1A');
    const d3 = dice('#00E676', '#1A1A1A');
    const d4 = dice('#8A2BE2', '#FFF8E8');
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
