import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { CONFIG, priceOf } from './data';
import { cyrb53, flyToCart, vibrate } from './utils';

const STORAGE_KEY = 'jb-store-v3';

const seed = () => ({
  points: 45,
  pending: 0,
  pieces: { 0: { s: 'digital' }, 3: { s: 'digital' }, 6: { s: 'digital' } },
  cart: [],
  orders: [],
  lastScan: null,
  usePoints: false,
});

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const saved = JSON.parse(raw);
    if (!saved || typeof saved.points !== 'number') return seed();
    return {
      ...seed(),
      ...saved,
      cart: Array.isArray(saved.cart) ? saved.cart : [],
      orders: Array.isArray(saved.orders) ? saved.orders : [],
      pieces: saved.pieces && typeof saved.pieces === 'object' ? saved.pieces : seed().pieces,
    };
  } catch (e) {
    return seed();
  }
}

export const sign = (payload) => cyrb53(payload + CONFIG.secret).toString(36);

function lockedIndices(state) {
  const list = [];
  for (let i = 0; i < 10; i++) {
    if (!state.pieces[i]) list.push(i);
  }
  return list;
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const qty = Math.min(9, Math.max(1, action.qty || 1));
      const existing = state.cart.find((line) => line.id === action.id);
      const cart = existing
        ? state.cart.map((line) => (line.id === action.id ? { ...line, qty: Math.min(9, line.qty + qty) } : line))
        : [...state.cart, { id: action.id, qty }];
      return { ...state, cart };
    }
    case 'SET_QTY': {
      const qty = Math.max(0, Math.min(9, action.qty));
      const cart =
        qty <= 0
          ? state.cart.filter((line) => line.id !== action.id)
          : state.cart.map((line) => (line.id === action.id ? { ...line, qty } : line));
      return { ...state, cart };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [], usePoints: false };
    case 'SET_USE_POINTS':
      return { ...state, usePoints: Boolean(action.value) };
    case 'REDEEM': {
      const free = lockedIndices(state);
      if (state.points < CONFIG.pieceCost || !free.length) return state;
      const index =
        action.index != null && free.includes(action.index)
          ? action.index
          : free[Math.floor(Math.random() * free.length)];
      return {
        ...state,
        points: state.points - CONFIG.pieceCost,
        pieces: { ...state.pieces, [index]: { s: 'digital' } },
        lastRedeemed: index,
      };
    }
    case 'ADD_POINTS':
      return { ...state, points: state.points + action.amount };
    case 'PLACE_ORDER': {
      const { order, used } = action;
      const pieces = { ...state.pieces };
      order.pieces.forEach((index) => {
        pieces[index] = { s: 'pending' };
      });
      return {
        ...state,
        points: state.points - used,
        pending: state.pending + order.pt,
        pieces,
        orders: [order, ...state.orders],
        cart: [],
        usePoints: false,
        lastScan: null,
      };
    }
    case 'SCAN_RESULT':
      return { ...state, lastScan: action.scan };
    case 'SCAN_OK': {
      const order = state.orders.find((item) => item.id === action.id);
      if (!order || order.redeemed) return state;
      const pieces = { ...state.pieces };
      order.pieces.forEach((index) => {
        if (pieces[index]) pieces[index] = { s: 'verified' };
      });
      return {
        ...state,
        points: state.points + order.pt,
        pending: Math.max(0, state.pending - order.pt),
        pieces,
        orders: state.orders.map((item) =>
          item.id === order.id ? { ...item, redeemed: true, status: 'verified' } : item
        ),
        lastScan: { id: order.id, code: 'ok' },
      };
    }
    case 'RESET':
      return seed();
    default:
      return state;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* ignore */
    }
  }, [state]);

  const cartCount = state.cart.reduce((total, line) => total + line.qty, 0);
  const subtotal = state.cart.reduce((total, line) => total + priceOf(line.id) * line.qty, 0);
  const maxUse = Math.max(
    0,
    Math.min(state.points - (state.points % CONFIG.ptsPerEgp), subtotal * CONFIG.ptsPerEgp)
  );
  const usedPoints = state.usePoints ? maxUse : 0;
  const discount = usedPoints / CONFIG.ptsPerEgp;
  const total = Math.max(0, subtotal - discount);
  const pendingPieces = Object.values(state.pieces).filter((piece) => piece.s === 'pending').length;
  const verifiedCount = Object.values(state.pieces).filter((piece) => piece.s !== 'pending').length;
  const locked = useMemo(() => lockedIndices(state), [state]);

  const addItem = useCallback((id, qty = 1, fromEl) => {
    dispatch({ type: 'ADD_ITEM', id, qty });
    vibrate(12);
    if (fromEl) flyToCart(fromEl);
  }, []);

  const setQty = useCallback((id, qty) => dispatch({ type: 'SET_QTY', id, qty }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'SET_QTY', id, qty: 0 }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const setUsePoints = useCallback((value) => dispatch({ type: 'SET_USE_POINTS', value }), []);
  const redeem = useCallback(() => {
    const free = lockedIndices(state);
    if (state.points < CONFIG.pieceCost || !free.length) return null;
    const index = free[Math.floor(Math.random() * free.length)];
    dispatch({ type: 'REDEEM', index });
    return index;
  }, [state]);
  const addPoints = useCallback((amount) => dispatch({ type: 'ADD_POINTS', amount }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const placeOrder = useCallback(
    (customer) => {
      if (!cartCount) return null;
      const free = [...lockedIndices(state)];
      const pieces = [];
      for (let i = 0; i < cartCount && free.length; i++) {
        pieces.push(free.splice(Math.floor(Math.random() * free.length), 1)[0]);
      }
      const id =
        'JB-' +
        Date.now().toString(36).toUpperCase().slice(-6) +
        Math.random().toString(36).slice(2, 5).toUpperCase();
      const pt = cartCount * CONFIG.ptsPerBox;
      const items = state.cart.map((line) => ({ id: line.id, qty: line.qty }));
      const payload = JSON.stringify({
        v: 3,
        o: id,
        n: customer.name,
        p: customer.phone,
        a: customer.addr.slice(0, 60),
        i: items.map((item) => [item.id, item.qty]),
        pc: pieces,
        pt,
        t: Date.now(),
      });
      const order = {
        id,
        customer,
        items,
        qty: cartCount,
        pieces,
        pt,
        total,
        used: usedPoints,
        payload,
        sig: sign(payload),
        status: 'waiting',
        redeemed: false,
        at: Date.now(),
      };
      dispatch({ type: 'PLACE_ORDER', order, used: usedPoints });
      vibrate([10, 40, 10]);
      return order;
    },
    [cartCount, locked, state, total, usedPoints]
  );

  const scan = useCallback(
    (id, tamper = false) => {
      const order = state.orders.find((item) => item.id === id);
      if (!order) {
        dispatch({ type: 'SCAN_RESULT', scan: { id, code: 'unknown' } });
        return { ok: false, code: 'unknown' };
      }
      let payload = order.payload;
      if (tamper) {
        try {
          const parsed = JSON.parse(payload);
          parsed.pc = parsed.pc.concat([99]);
          payload = JSON.stringify(parsed);
        } catch (e) {
          /* ignore */
        }
      }
      if (sign(payload) !== order.sig) {
        dispatch({ type: 'SCAN_RESULT', scan: { id, code: 'invalid' } });
        return { ok: false, code: 'invalid' };
      }
      if (order.redeemed) {
        dispatch({ type: 'SCAN_RESULT', scan: { id, code: 'used' } });
        return { ok: false, code: 'used' };
      }
      dispatch({ type: 'SCAN_OK', id });
      return { ok: true, code: 'ok' };
    },
    [state.orders]
  );

  const value = useMemo(
    () => ({
      ...state,
      cartCount,
      subtotal,
      maxUse,
      usedPoints,
      discount,
      total,
      pendingPieces,
      verifiedCount,
      locked,
      addItem,
      setQty,
      removeItem,
      clearCart,
      setUsePoints,
      redeem,
      addPoints,
      reset,
      placeOrder,
      scan,
      orderById: (id) => state.orders.find((item) => item.id === id),
    }),
    [
      state,
      cartCount,
      subtotal,
      maxUse,
      usedPoints,
      discount,
      total,
      pendingPieces,
      verifiedCount,
      locked,
      addItem,
      setQty,
      removeItem,
      clearCart,
      setUsePoints,
      redeem,
      addPoints,
      reset,
      placeOrder,
      scan,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
