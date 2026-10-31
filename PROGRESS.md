# Just a Joker Box — build progress

Last update: 2026-10-30
Status: production build passes (`npm run build`, 138 modules, no errors; three.js adds a large-chunk warning).

## Done

### Setup
- [x] Full backup of the original at `E:\jocker\ui-ux\version 3 - BACKUP (original)`
- [x] Removed old `Just a Joker Box.html` and `jocker.txt` from the working folder
- [x] Vite 5 + React 18 project (`package.json`, `vite.config.js`, `index.html`, `.gitignore`)
- [x] Fonts: Bowlby One, Bricolage Grotesque, Cairo, DM Mono
- [x] Hat favicon and base `./` for static hosting

### App shell
- [x] `src/main.jsx`, `src/App.jsx` with providers: Lang → Store → Toasts → UI → Route
- [x] Hash routing: `#/` home, `#/shop` shop
- [x] Home and Shop remount on language change so GSAP re-runs
- [x] ScrollTrigger refresh on route change, resize, and font load
- [x] Skip link, focus styles, reduced-motion support

### Bilingual (EN / AR)
- [x] Full English + Arabic dictionary in `src/i18n.jsx`
- [x] Language toggle in header, mobile menu, footer
- [x] `dir="rtl"` + `lang` applied to `<html>` and saved in localStorage
- [x] Cairo font for Arabic, RTL overrides for hero, drawer, badges, tiles, modal

### Store / logic
- [x] Cart with multiple game lines, qty 0–9, subtotal
- [x] Points redemption (3 pts = 1 EGP) and points earning (15 per box)
- [x] Orders, Joker Pieces, secret word `JOKERPIECE` (10 letters)
- [x] QR payload + `cyrb53` signature, one-time scan verification
- [x] Persistence in localStorage (`jb-store-v3`, `jb-lang-v3`)
- [x] Demo tools: add points, reset

### Sections
- [x] Header with the same logo everywhere + mobile menu
- [x] Hero: Three.js 3D card deck (10 cards) matching the original backup — shuffle → fan → draw, floating dice/dominoes, pointer parallax, shadow, pinned GSAP timeline, copy → "Draw your card" swap
- [x] Hero: exact backup copy ("Meet Roll", "Add Roll to your box"), split-letter hover title, CSS fallback deck for no-WebGL / reduced motion
- [x] Manifesto with marquee + animated statement + 3 cards
- [x] Joker showcase: draggable/swipeable card deck, 5 cards, names "Joker / Star / Diamond / Moon / Crown"
- [x] Shop teaser (4 games) + full shop page (8 games, category filters)
- [x] Puzzle: wallet, progress meter, 10 tiles, unlock pieces, secret word bar
- [x] Delivery: 4 steps + QR passport, rep scan simulation, tamper test
- [x] Cart drawer with explicit high-contrast colors
- [x] Checkout modal: validation, QR success screen, scan simulation
- [x] Toasts, confetti, fly-to-cart, custom cursor
- [x] Footer with same logo and fixed navigation labels

### Styling
- [x] `src/styles.css`: full design system, section colors, RTL, mobile breakpoints
- [x] Fixed cart contrast (dark text on cream, light text on dark)

### Verified
- [x] `npm install` done (node_modules present)
- [x] `npm run build` passes with no errors
- [x] Missing `styles.css` / `App.jsx` errors were from the old dev-server state and are resolved

## Not done

### Needs manual QA
- [ ] Open the app in the browser and check the hero pin/scroll animation
- [ ] Check card drag/swipe in Joker showcase on touch devices
- [ ] Check every section at desktop, tablet, and mobile widths
- [ ] Check Arabic RTL layout end-to-end (hero, shop, puzzle, cart, checkout)
- [ ] Check cart/checkout contrast on a real screen
- [ ] Check keyboard navigation and screen-reader labels
- [ ] Check reduced-motion mode

### Not implemented (by design / out of scope)
- [ ] Real backend, database, and order storage (currently localStorage demo)
- [ ] Real payment gateway
- [ ] Real camera QR scanning (currently a "simulate scan" button)
- [ ] Real delivery-rep integration
- [ ] Real inventory / stock limits
- [ ] Email or SMS order notifications
- [ ] Analytics and SEO metadata beyond the base description
- [ ] Deployment to a host
- [ ] Unit / E2E tests

## Key files

- `src/App.jsx` — providers + shell
- `src/pages/Home.jsx`, `src/pages/ShopPage.jsx`
- `src/components/` — Header, Footer, Hero, Hero3D, Manifesto, JokerShowcase, ShopTeaser, Puzzle, Delivery, GameCard, CartDrawer, CheckoutModal, Toasts, Cursor, QR, Logo, Icons, GameArt
- `src/data.js` — config, 8 games, `WORD`
- `src/i18n.jsx` — EN/AR
- `src/store.jsx` — cart, points, pieces, orders
- `src/styles.css` — all styling
