import { create } from 'zustand';
import api from '../lib/api';

interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  archived: boolean;
  type: string;
  createdAt: string;
}

interface NotificationState {
  items: Notification[];
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  archive: (id: string) => Promise<void>;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  loading: false,
  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/notifications');
      set({ items: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  markRead: async (id) => {
    await api.patch(`/notifications/${id}`, { read: true });
    set({ items: get().items.map((n) => (n.id === id ? { ...n, read: true } : n)) });
  },
  archive: async (id) => {
    await api.patch(`/notifications/${id}`, { archived: true });
    set({ items: get().items.map((n) => (n.id === id ? { ...n, archived: true } : n)) });
  },
  unreadCount: () => get().items.filter((n) => !n.read).length,
}));
