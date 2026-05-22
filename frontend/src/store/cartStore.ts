import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../services/apiClient';
import { Cart, CartItem, CartSummary } from '../types';

interface CartState {
  cart: Cart['cart'];
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearError: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      items: [],
      summary: { subtotal: 0, tax: 0, total: 0 },
      isLoading: false,
      error: null,
      lastFetched: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.get('/cart');
          const data: Cart = response.data;
          set({
            cart: data.cart,
            items: data.items,
            summary: data.summary,
            isLoading: false,
            lastFetched: Date.now(),
          });
        } catch (err: any) {
          const message = err.response?.data?.message || 'Failed to fetch cart.';
          set({ error: message, isLoading: false });
        }
      },

      addItem: async (productId, quantity = 1) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post('/cart/items', { product_id: productId, quantity });
          const data: { items: CartItem[]; summary: CartSummary } = response.data;
          set({ items: data.items, summary: data.summary, isLoading: false });
          const { fetchCart } = get();
          await fetchCart();
        } catch (err: any) {
          const message = err.response?.data?.message || 'Failed to add item to cart.';
          set({ error: message, isLoading: false });
        }
      },

      removeItem: async (itemId) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.delete(`/cart/items/${itemId}`);
          const { fetchCart } = get();
          await fetchCart();
        } catch (err: any) {
          const message = err.response?.data?.message || 'Failed to remove item from cart.';
          set({ error: message, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cart: state.cart,
        items: state.items,
        summary: state.summary,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
