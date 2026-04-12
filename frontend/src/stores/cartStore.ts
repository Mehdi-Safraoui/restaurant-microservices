import { create } from "zustand";
import { Plat } from "@/types";

export interface CartItem {
  plat: Plat;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (plat: Plat) => void;
  removeItem: (platId: number) => void;
  updateQuantity: (platId: number, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (plat) => {
    set((state) => {
      const existing = state.items.find((i) => i.plat.id === plat.id);
      if (existing) {
        return { items: state.items.map((i) => i.plat.id === plat.id ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { items: [...state.items, { plat, quantity: 1 }] };
    });
  },
  removeItem: (platId) => set((state) => ({ items: state.items.filter((i) => i.plat.id !== platId) })),
  updateQuantity: (platId, quantity) => {
    if (quantity <= 0) {
      set((state) => ({ items: state.items.filter((i) => i.plat.id !== platId) }));
    } else {
      set((state) => ({ items: state.items.map((i) => i.plat.id === platId ? { ...i, quantity } : i) }));
    }
  },
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.plat.prix * i.quantity, 0),
  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
