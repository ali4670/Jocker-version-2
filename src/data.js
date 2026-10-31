export const CONFIG = {
  boxPrice: 450,
  ptsPerBox: 15,
  ptsPerEgp: 3,
  pieceCost: 15,
  secret: 'jb-demo-secret',
};

export const WORD = 'JOKERPIECE';

export const GAMES = [
  {
    id: 'joker',
    name: { en: 'Joker', ar: 'جوكر' },
    tag: { en: 'Fantasy card game', ar: 'لعبة بطاقات خيالية' },
    desc: {
      en: 'The fantasy card game. Cards, rules and a Joker Piece in the box.',
      ar: 'لعبة البطاقات الخيالية. بطاقات وقواعد وقطعة جوكر في الصندوق.',
    },
    price: 450,
    color: '#8A2BE2',
    art: 'hat',
    cat: 'fantasy',
    badge: { en: 'Flagship', ar: 'مميّز' },
    featured: true,
  },
  {
    id: 'royal-riddle',
    name: { en: "The Royal Jester's Riddle", ar: 'أحجية المهرّج الملكي' },
    tag: { en: 'Strategy · 3–6 players', ar: 'استراتيجية · 3–6 لاعبين' },
    desc: {
      en: 'A royal riddle for sharp minds. Solve the court before the clock runs out.',
      ar: 'أحجية ملكية للعقول الحادة. حلّ البلاط قبل نفاد الوقت.',
    },
    price: 520,
    color: '#FF2A54',
    art: 'crown',
    cat: 'strategy',
    badge: { en: 'New', ar: 'جديد' },
  },
  {
    id: 'midnight-circus',
    name: { en: 'Midnight Circus', ar: 'سيرك منتصف الليل' },
    tag: { en: 'Party · 4–10 players', ar: 'حفلات · 4–10 لاعبين' },
    desc: {
      en: 'Step right up. A party game of daring acts and impossible bets.',
      ar: 'تفضّل بالدخول. لعبة حفلات من الأعمال الجريئة والرهانات المستحيلة.',
    },
    price: 390,
    color: '#00B8D9',
    art: 'mask',
    cat: 'party',
  },
  {
    id: 'wild-cards',
    name: { en: 'Wild Cards', ar: 'بطاقات جامحة' },
    tag: { en: 'Party · 2–8 players', ar: 'حفلات · 2–8 لاعبين' },
    desc: {
      en: 'Fast, loud and a little chaotic. Perfect for a table that likes to shout.',
      ar: 'سريعة وصاخبة وفوضوية قليلًا. مثالية لطاولة تحب الصراخ.',
    },
    price: 320,
    color: '#FF7A00',
    art: 'star',
    cat: 'party',
  },
  {
    id: 'trickster',
    name: { en: 'Trickster', ar: 'المخادع' },
    tag: { en: 'Strategy · 3–5 players', ar: 'استراتيجية · 3–5 لاعبين' },
    desc: {
      en: 'Bluff, steal and vanish. A strategy game where the last liar wins.',
      ar: 'خادع واسرق واختفِ. لعبة استراتيجية يفوز فيها آخر كاذب.',
    },
    price: 480,
    color: '#4D5BFF',
    art: 'key',
    cat: 'strategy',
  },
  {
    id: 'fortune-wheel',
    name: { en: 'Fortune Wheel', ar: 'عجلة الحظ' },
    tag: { en: 'Party · 2–6 players', ar: 'حفلات · 2–6 لاعبين' },
    desc: {
      en: 'Spin the wheel and tempt fate. Luck is a strategy too.',
      ar: 'أدر العجلة وجرّب حظك. الحظ استراتيجية أيضًا.',
    },
    price: 360,
    color: '#00E676',
    art: 'moon',
    cat: 'party',
  },
  {
    id: 'card-castle',
    name: { en: 'Card Castle', ar: 'قلعة البطاقات' },
    tag: { en: 'Strategy · 2–4 players', ar: 'استراتيجية · 2–4 لاعبين' },
    desc: {
      en: 'Build high, play careful. One wrong card and the whole castle falls.',
      ar: 'ابنِ عاليًا والعب بحذر. بطاقة خاطئة واحدة تسقط القلعة كلها.',
    },
    price: 550,
    color: '#E91E63',
    art: 'diamond',
    cat: 'strategy',
  },
  {
    id: 'illusion',
    name: { en: 'Illusion', ar: 'وهم' },
    tag: { en: 'Fantasy · 2–5 players', ar: 'خيال · 2–5 لاعبين' },
    desc: {
      en: 'A fantasy of mirrors and misdirection. Trust nothing you see.',
      ar: 'خيال من المرايا والتضليل. لا تثق بشيء تراه.',
    },
    price: 420,
    color: '#FFC700',
    art: 'eye',
    cat: 'fantasy',
  },
];

export const SHOWCASE_CARDS = [
  { roman: 'I', icon: 'hat', color: '#FF2A54' },
  { roman: 'II', icon: 'star', color: '#FFC700' },
  { roman: 'III', icon: 'diamond', color: '#FF2A54' },
  { roman: 'IV', icon: 'moon', color: '#00E676' },
  { roman: 'V', icon: 'crown', color: '#FFC700' },
];

export const HERO_SUITS = ['hat', 'star', 'diamond', 'moon', 'crown', 'key', 'eye', 'mask'];
export const HERO_SUIT_COLORS = ['#FF2A54', '#FFC700', '#00E676', '#8A2BE2', '#00B8D9', '#FF7A00'];

export const gameById = (id) => GAMES.find((g) => g.id === id);
export const priceOf = (id) => gameById(id)?.price ?? CONFIG.boxPrice;

export function formatEGP(value, lang = 'en') {
  const n = Number(value);
  const rounded = Number.isInteger(n) ? n : Number(n.toFixed(2));
  const formatted = rounded.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');
  return lang === 'ar' ? `${formatted} جنيه` : `EGP ${formatted}`;
}

export function pointsToEGP(points, lang = 'en') {
  const v = points / CONFIG.ptsPerEgp;
  return formatEGP(v, lang);
}
