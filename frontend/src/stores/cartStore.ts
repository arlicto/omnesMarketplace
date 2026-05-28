import { create } from 'zustand';
import api from '../lib/api';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: 'immediate' | 'auction' | 'negotiation';
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, qty: number) => Promise<void>;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  fetchCart: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/cart');
      set({ items: data.items, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  addItem: async (item) => {
    const { data } = await api.post('/cart', item);
    set({ items: data.items });
  },
  removeItem: async (id) => {
    const { data } = await api.delete(`/cart/${id}`);
    set({ items: data.items });
  },
  updateQuantity: async (id, qty) => {
    const { data } = await api.patch(`/cart/${id}`, { quantity: qty });
    set({ items: data.items });
  },
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
