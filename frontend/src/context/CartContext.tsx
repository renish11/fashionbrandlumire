"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types";
import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/constants";

interface CartState {
  items: CartItem[];
  couponCode: string;
  discount: number;
  shippingMethod: string;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "APPLY_COUPON"; payload: { code: string; discount: number } }
  | { type: "REMOVE_COUPON" }
  | { type: "SET_SHIPPING_METHOD"; payload: string }
  | { type: "CLEAR" };

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  couponCode: string;
  shippingMethod: string;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  setShippingMethod: (method: string) => void;
  clearCart: () => void;
  isInCart: (productId: string, color: string, size: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (i) =>
          i.productId === action.payload.productId &&
          i.color === action.payload.color &&
          i.size === action.payload.size
      );
      if (existingIndex >= 0) {
        const updated = [...state.items];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          quantity: Math.min(existing.quantity + action.payload.quantity, existing.maxQuantity),
        };
        return { ...state, items: updated };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.min(action.payload.quantity, i.maxQuantity) }
            : i
        ),
      };
    }
    case "APPLY_COUPON":
      return { ...state, couponCode: action.payload.code, discount: action.payload.discount };
    case "REMOVE_COUPON":
      return { ...state, couponCode: "", discount: 0 };
    case "SET_SHIPPING_METHOD":
      return { ...state, shippingMethod: action.payload };
    case "CLEAR":
      return { items: [], couponCode: "", discount: 0, shippingMethod: "standard" };
    default:
      return state;
  }
}

const VALID_COUPONS: Record<string, number> = {
  WELCOME10: 10,
  VIP20: 20,
  LUMIERE15: 15,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    couponCode: "",
    discount: 0,
    shippingMethod: "standard",
  });

  const subtotal = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  );

  const shipping = state.shippingMethod === "express" ? 25 : (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST);
  const discountAmount = (subtotal * state.discount) / 100;
  const tax = (subtotal - discountAmount) * TAX_RATE;
  const total = subtotal - discountAmount + shipping + tax;
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  }, []);

  const applyCoupon = useCallback((code: string): boolean => {
    const upperCode = code.toUpperCase();
    let discount = VALID_COUPONS[upperCode];

    if (!discount && typeof window !== "undefined") {
      try {
        const custom = localStorage.getItem("lumiere_custom_coupons");
        if (custom) {
          const map = JSON.parse(custom);
          if (map[upperCode]) {
            discount = map[upperCode];
          }
        }
      } catch {}
    }

    if (discount) {
      dispatch({ type: "APPLY_COUPON", payload: { code: upperCode, discount } });
      return true;
    }
    return false;
  }, []);

  const removeCoupon = useCallback(() => {
    dispatch({ type: "REMOVE_COUPON" });
  }, []);

  const setShippingMethod = useCallback((method: string) => {
    dispatch({ type: "SET_SHIPPING_METHOD", payload: method });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const isInCart = useCallback(
    (productId: string, color: string, size: string) =>
      state.items.some(
        (i) => i.productId === productId && i.color === color && i.size === size
      ),
    [state.items]
  );

  const value: CartContextValue = {
    items: state.items,
    totalItems,
    subtotal,
    shipping,
    tax,
    discount: discountAmount,
    total,
    couponCode: state.couponCode,
    shippingMethod: state.shippingMethod,
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    setShippingMethod,
    clearCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
