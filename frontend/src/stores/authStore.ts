import { create } from 'zustand';
import api from '../lib/api';

interface AuthState {
  role: 'buyer' | 'seller' | 'admin' | null;
  setRole: (role: AuthState['role']) => void;
  syncRole: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
  syncRole: async (userId) => {
    try {
      const { data } = await api.get(`/users/${userId}/role`);
      set({ role: data.role });
    } catch {
      set({ role: 'buyer' });
    }
  },
}));
