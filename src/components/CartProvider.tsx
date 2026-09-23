"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { normalizeCart, type CartItem } from "@/lib/cart";
const KEY = "bumpr-cart-v1";
type Cart = {
  items: CartItem[];
  ready: boolean;
  add: (id: string, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  removePurchased: (items: CartItem[], orderId: string) => void;
};
const Context = createContext<Cart | null>(null);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]),
    [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      setItems(normalizeCart(JSON.parse(localStorage.getItem(KEY) || "[]")));
    } catch {}
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key === KEY) {
        try {
          setItems(normalizeCart(JSON.parse(event.newValue || "[]")));
        } catch {}
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(KEY, JSON.stringify(items));
      } catch {}
  }, [items, ready]);
  const add = useCallback(
    (id: string, quantity = 1) =>
      setItems((old) => normalizeCart([...old, { id, quantity }])),
    [],
  );
  const setQuantity = useCallback(
    (id: string, quantity: number) =>
      setItems((old) =>
        quantity <= 0
          ? old.filter((i) => i.id !== id)
          : normalizeCart(old.map((i) => (i.id === id ? { id, quantity } : i))),
      ),
    [],
  );
  const removePurchased = useCallback(
    (purchased: CartItem[], orderId: string) => {
      try {
        const key = `bumpr-cleared-${orderId}`;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
      } catch {
        return;
      }
      setItems((old) =>
        normalizeCart(
          old.map((i) => ({
            id: i.id,
            quantity:
              i.quantity -
              (purchased.find((p) => p.id === i.id)?.quantity || 0),
          })),
        ),
      );
    },
    [],
  );
  return (
    <Context.Provider
      value={{ items, ready, add, setQuantity, removePurchased }}
    >
      {children}
    </Context.Provider>
  );
}
export function useCart() {
  const value = useContext(Context);
  if (!value) throw new Error("CartProvider ontbreekt.");
  return value;
}
