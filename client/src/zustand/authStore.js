import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      admin: null,
      loading: false,

      setLoading: (loading) => set({ loading }),
      setAdmin: (admin) => set({ admin }),
    }),
    {
      name: 'auth-store', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);

export default useAuthStore;
