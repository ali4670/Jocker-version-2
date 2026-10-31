import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'jb-lang-v3';

const en = {
  brand: 'Just a Joker Box',
  nav: { home: 'Home', shop: 'Shop', play: 'Puzzle', delivery: 'Delivery', cart: 'Box', pts: 'pts' },
  langName: 'العربية',
  misc: {
    menu: 'Menu',
    close: 'Close',
    language: 'Switch language',
    skip: 'Skip to content',
    points: 'pts',
  },
  hero: {
    eyebrow: 'Game design studio & board game store',
    just: 'Just a',
    lead: 'Boxes of games and cards for people who would rather believe than calculate. Our first act is called Roll.',
    meet: 'Meet Roll',
    collect: 'Collect Joker Pieces',
    act: 'Act I · Now on the table',
    draw: 'Draw your card.',
    drawLead: 'Roll is a fantasy for the theatre of your table. Every box carries cards, a game and a Joker Piece.',
    add: 'Add Roll to your box',
    browse: 'Browse the shop',
    scroll: 'Scroll to shuffle',
    steps: ['Shuffle', 'Fan', 'Draw'],
    deckLabel: 'Joker card deck',
  },
  manifesto: {
    eyebrow: 'What we make',
    words: ['Fantasy,', 'not', 'logic.', 'We', 'turn', 'your', 'table', 'into', 'a', 'stage.'],
    marquee1: 'JOKER ◆ JOKER PIECES ◆ DRAW A CARD ◆ OPEN THE BOX ◆ ',
    marquee2: 'FANTASY NOT LOGIC ◆ ONE BOX ◆ TEN PIECES ◆ STEP INTO THE SHOW ◆ ',
    games: { t: 'Games', d: 'Playable the moment the lid comes off. No manual marathons.' },
    cards: { t: 'Cards', d: 'Decks to shuffle, deal and slam on the table.' },
    pieces: { t: 'Joker Pieces', d: 'Ten collectible pieces. Gather them all to spell a secret word.' },
  },
  joker: {
    eyebrow: 'Act I',
    title: 'Joker',
    lead: 'A fantasy made for the theatre of your table. Lift the lid, draw a card and let the show start. We are not asking you to think. We are asking you to believe.',
    tags: ['Fantasy', 'Cards inside', 'Joker Piece in every box', '+15 pts'],
    oneBox: 'One box',
    add: 'Add to your box',
    shuffle: 'Shuffle',
    prev: 'Previous card',
    next: 'Next card',
    deckLabel: 'Joker card deck. Swipe, drag or use the arrow keys to move through the cards.',
    cardNames: ['The Joker', 'The Star', 'The Diamond', 'The Moon', 'The Crown'],
    cardOf: 'of',
  },
  shop: {
    eyebrow: 'The shop',
    title: 'Pick a box.',
    note: 'Every box adds 15 points and one Joker Piece, confirmed when the delivery rep scans your code.',
    all: 'All',
    fantasy: 'Fantasy',
    party: 'Party',
    strategy: 'Strategy',
    add: 'Add to box',
    added: 'Added to your box',
    coming: 'Coming soon',
    locked: 'Locked',
    pageEyebrow: 'The whole shelf',
    pageTitle: 'Games for the table.',
    pageLead: 'Eight boxes, one rule: fantasy before logic. Every game ships with a Joker Piece and points that spend like money.',
    featured: 'Featured',
    piecesIncluded: 'Joker Piece inside',
    pts: 'pts',
    viewAll: 'View all games',
    filterLabel: 'Filter games',
    gamesCount: 'games on the shelf',
    homeTitle: 'Fresh off the shelf',
  },
  puzzle: {
    eyebrow: 'The collectible',
    title1: 'Ten pieces.',
    title2: 'One secret word.',
    points: 'Your Joker points',
    pts: 'pts',
    reward: 'reward value',
    meterLabel: 'Progress to next Joker Piece',
    rule1a: '+15 pts',
    rule1b: 'for every game box you buy',
    rule2a: '3 pts = 1 EGP',
    rule2b: 'spend them at checkout',
    unlock: 'Unlock a piece · 15 pts',
    buy: 'Buy Joker',
    demoTools: 'Demo tools',
    demoTip: 'This page starts with a sample balance so you can try everything.',
    top: '+15 pts',
    reset: 'Reset demo',
    count: 'pieces',
    tap: 'Tap a piece',
    legend: ['Unlocked', 'Waiting for delivery scan', 'Locked'],
    secret: 'Secret word',
    everyPiece: 'Every piece is yours.',
    canUnlock: 'You can unlock a Joker Piece now.',
    untilNext: 'pts until your next Joker Piece.',
    pending: 'pts and {n} piece(s) are waiting for the delivery scan.',
    lockedToast: 'Locked. Buy a box or collect 15 points.',
    useUnlock: 'Use “Unlock a piece” to open one.',
    waitingToast: 'Waiting for the delivery scan.',
    unlocked: 'Piece {n} unlocked: {l}',
    demoReset: 'Demo reset',
    piecesLabel: 'Joker Pieces',
  },
  delivery: {
    eyebrow: 'Fair play',
    title1: 'One code.',
    title2: 'One player.',
    steps: [
      { t: 'You order', d: 'Your name, phone and address are saved with the order, along with the pieces it carries.' },
      { t: 'You get a code', d: 'A QR code is created for that order alone. It holds your details, the items and the exact piece count.' },
      { t: 'The rep scans it', d: 'The rep checks the code on delivery and photographs the puzzle piece as it is handed over.' },
      { t: 'The code burns', d: 'After one scan it is spent. A shared copy, an edited piece count or a second scan is refused.' },
    ],
    passport: 'Order passport',
    noOrder: 'No order yet. Place a box order and your one-time delivery code shows up here.',
    shop: 'Shop Joker',
    verified: 'Verified',
    waiting: 'Waiting for rep scan',
    repScan: 'Rep scan',
    edit: 'Edit the code & scan',
    scanOk: 'Verified. Hand it over.',
    scanUsed: 'Refused: code already used.',
    scanInvalid: 'Refused: code was changed.',
    unknown: 'Unknown order.',
    scanOkNote: '{name} · {qty} boxes · {pieces} piece(s) recorded. +{pts} pts added.',
    scanUsedNote: 'This order was scanned before. A shared or copied code cannot be redeemed twice.',
    scanInvalidNote: 'The signature does not match the order. Nothing was handed over.',
    refused: 'Refused',
    verifiedToast: 'Verified. {pts} points added.',
    already: 'Refused: already used',
    changed: 'Refused: the code was changed',
    pieces: 'pieces',
  },
  cart: {
    title: 'Your box',
    empty: 'Your box is empty.',
    emptyDesc: 'The shelf is waiting.',
    goShop: 'Go to the shop',
    each: 'each',
    usePoints: 'Use {n} points to take off {egp}',
    earn: 'Earn points with every box. 3 points are worth 1 EGP.',
    adds: 'This order adds {pts} pts and {pieces} Joker Piece(s) once the rep scans your code.',
    boxes: 'Boxes',
    pointsUsed: 'Points used',
    total: 'Total',
    checkout: 'Checkout',
    remove: 'Remove',
    items: 'items',
  },
  checkout: {
    title: 'Almost on stage',
    sub: 'Tell the rep who is receiving the box. We keep these details with the order so your code works for you only.',
    name: 'Full name',
    phone: 'Phone',
    address: 'Delivery address',
    place: 'Place order & get my code',
    errName: 'Enter your full name.',
    errPhone: 'Enter a phone number with at least 10 digits.',
    errAddr: 'Enter the full delivery address.',
    success: 'You are on the list',
    successSub: 'Show this code to the delivery rep. It works once, for this order only.',
    waiting: 'Waiting for rep scan',
    held: '{pts} pts and {pieces} Joker Piece(s) are held for you:',
    simulate: 'Simulate rep scan',
    done: 'Done',
    verified: 'Verified',
    alreadyUsed: 'Already used',
    rejected: 'Rejected',
    order: 'Order',
  },
  footer: {
    rights: '© 2026 Just a Joker Box. All rights reserved.',
    top: 'Back to top',
    tagline: 'Fantasy, not logic.',
  },
  toast: {
    added: 'Added to your box',
    reset: 'Demo reset',
    lang: 'Language switched',
  },
};

const ar = {
  brand: 'مجرد صندوق جوكر',
  nav: { home: 'الرئيسية', shop: 'المتجر', play: 'الأحجية', delivery: 'التوصيل', cart: 'الصندوق', pts: 'نقطة' },
  langName: 'English',
  misc: {
    menu: 'القائمة',
    close: 'إغلاق',
    language: 'تغيير اللغة',
    skip: 'تخطَّ إلى المحتوى',
    points: 'نقطة',
  },
  hero: {
    eyebrow: 'استوديو تصميم ألعاب ومتجر ألعاب لوحية',
    just: 'مجرد',
    lead: 'صناديق ألعاب وبطاقات لمن يفضّلون أن يؤمنوا بدل أن يحسبوا. أول أعمالنا اسمه رول.',
    meet: 'تعرّف على رول',
    collect: 'اجمع قطع الجوكر',
    act: 'الفصل الأول · الآن على الطاولة',
    draw: 'اسحب بطاقتك.',
    drawLead: 'رول خيال مخصص لمسرح طاولتك. كل صندوق يحمل بطاقات ولعبة وقطعة جوكر.',
    add: 'أضف رول إلى صندوقك',
    browse: 'تصفّح المتجر',
    scroll: 'مرّر لتخلط',
    steps: ['خلط', 'نشر', 'سحب'],
    deckLabel: 'مجموعة بطاقات جوكر',
  },
  manifesto: {
    eyebrow: 'ماذا نصنع',
    words: ['الخيال،', 'لا', 'المنطق.', 'نحوّل', 'طاولتك', 'إلى', 'مسرح.'],
    marquee1: 'جوكر ◆ قطع جوكر ◆ اسحب بطاقة ◆ افتح الصندوق ◆ ',
    marquee2: 'خيال لا منطق ◆ صندوق واحد ◆ عشر قطع ◆ اصعد إلى المسرح ◆ ',
    games: { t: 'ألعاب', d: 'جاهزة للعب فور فتح الغطاء. بلا كتيبات تعليمات طويلة.' },
    cards: { t: 'بطاقات', d: 'أكوام تخلطها وتوزّعها وتصفعها على الطاولة.' },
    pieces: { t: 'قطع الجوكر', d: 'عشر قطع قابلة للجمع. اجمعها كلها لتكشف كلمة سرية.' },
  },
  joker: {
    eyebrow: 'الفصل الأول',
    title: 'جوكر',
    lead: 'خيال صُنع لمسرح طاولتك. ارفع الغطاء، اسحب بطاقة، ودع العرض يبدأ. نحن لا نطلب منك أن تفكر، بل أن تؤمن.',
    tags: ['خيال', 'بطاقات بالداخل', 'قطعة جوكر في كل صندوق', '+15 نقطة'],
    oneBox: 'صندوق واحد',
    add: 'أضف إلى صندوقك',
    shuffle: 'اخلط',
    prev: 'البطاقة السابقة',
    next: 'البطاقة التالية',
    deckLabel: 'مجموعة بطاقات جوكر. اسحب أو استخدم مفاتيح الأسهم للتنقل بين البطاقات.',
    cardNames: ['الجوكر', 'النجمة', 'الألماسة', 'القمر', 'التاج'],
    cardOf: 'من',
  },
  shop: {
    eyebrow: 'المتجر',
    title: 'اختر صندوقًا.',
    note: 'كل صندوق يضيف 15 نقطة وقطعة جوكر واحدة، تُؤكَّد عندما يمسح مندوب التوصيل رمزك.',
    all: 'الكل',
    fantasy: 'خيال',
    party: 'حفلات',
    strategy: 'استراتيجية',
    add: 'أضف إلى الصندوق',
    added: 'أُضيف إلى صندوقك',
    coming: 'قريبًا',
    locked: 'مقفل',
    pageEyebrow: 'الرف كاملًا',
    pageTitle: 'ألعاب للطاولة.',
    pageLead: 'ثمانية صناديق وقاعدة واحدة: الخيال قبل المنطق. كل لعبة تأتي مع قطعة جوكر ونقاط تُصرف كالمال.',
    featured: 'مميّز',
    piecesIncluded: 'قطعة جوكر بالداخل',
    pts: 'نقطة',
    viewAll: 'شاهد كل الألعاب',
    filterLabel: 'تصفية الألعاب',
    gamesCount: 'لعبة على الرف',
    homeTitle: 'طازج من الرف',
  },
  puzzle: {
    eyebrow: 'المجموعة',
    title1: 'عشر قطع.',
    title2: 'كلمة سرية واحدة.',
    points: 'نقاط الجوكر',
    pts: 'نقطة',
    reward: 'قيمة المكافأة',
    meterLabel: 'التقدم نحو قطعة الجوكر التالية',
    rule1a: '+15 نقطة',
    rule1b: 'لكل صندوق لعبة تشتريه',
    rule2a: '3 نقاط = 1 جنيه',
    rule2b: 'استخدمها عند الدفع',
    unlock: 'افتح قطعة · 15 نقطة',
    buy: 'اشترِ جوكر',
    demoTools: 'أدوات التجربة',
    demoTip: 'تبدأ الصفحة برصيد تجريبي لتجربة كل شيء.',
    top: '+15 نقطة',
    reset: 'إعادة ضبط',
    count: 'قطعة',
    tap: 'اضغط على قطعة',
    legend: ['مفتوحة', 'بانتظار مسح التوصيل', 'مقفلة'],
    secret: 'الكلمة السرية',
    everyPiece: 'كل القطع لك.',
    canUnlock: 'يمكنك فتح قطعة جوكر الآن.',
    untilNext: 'نقطة حتى قطعة الجوكر التالية.',
    pending: 'نقطة و{n} قطعة بانتظار مسح التوصيل.',
    lockedToast: 'مقفلة. اشترِ صندوقًا أو اجمع 15 نقطة.',
    useUnlock: 'استخدم «افتح قطعة» لفتح واحدة.',
    waitingToast: 'بانتظار مسح التوصيل.',
    unlocked: 'القطعة {n} مفتوحة: {l}',
    demoReset: 'تمت إعادة الضبط',
    piecesLabel: 'قطع الجوكر',
  },
  delivery: {
    eyebrow: 'لعب عادل',
    title1: 'رمز واحد.',
    title2: 'لاعب واحد.',
    steps: [
      { t: 'أنت تطلب', d: 'يُحفظ اسمك وهاتفك وعنوانك مع الطلب، مع القطع التي يحملها.' },
      { t: 'تحصل على رمز', d: 'يُنشأ رمز QR لهذا الطلب وحده. يحمل بياناتك والأصناف وعدد القطع بالضبط.' },
      { t: 'المندوب يمسحه', d: 'يتحقق المندوب من الرمز عند التوصيل ويصوّر قطعة الأحجية أثناء تسليمها.' },
      { t: 'يحترق الرمز', d: 'بعد مسح واحد ينتهي. النسخة المشتركة أو عدد القطع المعدّل أو المسح الثاني مرفوض.' },
    ],
    passport: 'جواز الطلب',
    noOrder: 'لا يوجد طلب بعد. اطلب صندوقًا وسيظهر رمز التوصيل لمرة واحدة هنا.',
    shop: 'تسوّق جوكر',
    verified: 'مؤكد',
    waiting: 'بانتظار مسح المندوب',
    repScan: 'مسح المندوب',
    edit: 'عدّل الرمز وامسح',
    scanOk: 'مؤكد. سلّمها.',
    scanUsed: 'مرفوض: الرمز مستخدم.',
    scanInvalid: 'مرفوض: تم تغيير الرمز.',
    unknown: 'طلب غير معروف.',
    scanOkNote: '{name} · {qty} صناديق · {pieces} قطعة مسجلة. +{pts} نقطة.',
    scanUsedNote: 'تم مسح هذا الطلب سابقًا. لا يمكن استخدام رمز مشترك أو منسوخ مرتين.',
    scanInvalidNote: 'التوقيع لا يطابق الطلب. لم يُسلَّم شيء.',
    refused: 'مرفوض',
    verifiedToast: 'تم التأكيد. أُضيفت {pts} نقطة.',
    already: 'مرفوض: مستخدم بالفعل',
    changed: 'مرفوض: تم تغيير الرمز',
    pieces: 'قطع',
  },
  cart: {
    title: 'صندوقك',
    empty: 'صندوقك فارغ.',
    emptyDesc: 'الرف في انتظارك.',
    goShop: 'اذهب إلى المتجر',
    each: 'للقطعة',
    usePoints: 'استخدم {n} نقطة لخصم {egp}',
    earn: 'اكسب نقاطًا مع كل صندوق. 3 نقاط تساوي 1 جنيه.',
    adds: 'يضيف هذا الطلب {pts} نقطة و{pieces} قطعة جوكر بعد مسح المندوب لرمزك.',
    boxes: 'الصناديق',
    pointsUsed: 'النقاط المستخدمة',
    total: 'الإجمالي',
    checkout: 'إتمام الطلب',
    remove: 'إزالة',
    items: 'عناصر',
  },
  checkout: {
    title: 'على وشك الصعود للمسرح',
    sub: 'أخبر المندوب بمن سيستلم الصندوق. نحفظ هذه البيانات مع الطلب ليعمل رمزك لك وحدك.',
    name: 'الاسم الكامل',
    phone: 'الهاتف',
    address: 'عنوان التوصيل',
    place: 'اطلب واحصل على رمزي',
    errName: 'أدخل اسمك الكامل.',
    errPhone: 'أدخل رقم هاتف من 10 أرقام على الأقل.',
    errAddr: 'أدخل عنوان التوصيل الكامل.',
    success: 'أنت على القائمة',
    successSub: 'اعرض هذا الرمز على مندوب التوصيل. يعمل مرة واحدة، لهذا الطلب فقط.',
    waiting: 'بانتظار مسح المندوب',
    held: '{pts} نقطة و{pieces} قطعة جوكر محجوزة لك:',
    simulate: 'محاكاة مسح المندوب',
    done: 'تم',
    verified: 'مؤكد',
    alreadyUsed: 'مستخدم بالفعل',
    rejected: 'مرفوض',
    order: 'الطلب',
  },
  footer: {
    rights: '© 2026 مجرد صندوق جوكر. جميع الحقوق محفوظة.',
    top: 'إلى الأعلى',
    tagline: 'الخيال، لا المنطق.',
  },
  toast: {
    added: 'أُضيف إلى صندوقك',
    reset: 'تمت إعادة الضبط',
    lang: 'تم تغيير اللغة',
  },
};

const dict = { en, ar };

function readPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ar' || saved === 'en') return saved;
    } catch (e) {
      /* ignore */
    }
    return 'en';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore */
    }
  }, [lang, dir]);

  const t = useCallback(
    (key, vars) => {
      let value = readPath(dict[lang], key);
      if (value == null) value = readPath(dict.en, key);
      if (typeof value === 'string' && vars) {
        value = value.replace(/\{(\w+)\}/g, (_, name) => (vars[name] == null ? '' : vars[name]));
      }
      return value;
    },
    [lang]
  );

  const toggle = useCallback(() => {
    setLang((current) => (current === 'en' ? 'ar' : 'en'));
  }, []);

  const value = useMemo(() => ({ lang, dir, isRTL: dir === 'rtl', setLang, toggle, t }), [lang, dir, t, toggle]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}
