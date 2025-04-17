import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      login: (username, password) => set({ user: { username, password } }),
      logout: () => set({ user: null }),
    }),
    { name: 'auth-storage' }
  )
);