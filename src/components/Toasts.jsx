import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(() => {});

export function ToastsProvider({ children }) {
  const [items, setItems] = useState([]);
  const counter = useRef(0);

  const toast = useCallback((message) => {
    const id = ++counter.current;
    setItems((current) => [...current, { id, message, out: false }]);
    window.setTimeout(() => {
      setItems((current) => current.map((item) => (item.id === id ? { ...item, out: true } : item)));
    }, 2600);
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div id="toasts" role="status" aria-live="polite">
        {items.map((item) => (
          <div key={item.id} className={`toast${item.out ? ' out' : ''}`}>
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToasts() {
  return useContext(ToastContext);
}
