import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAuthStore = create(
    persist((set) => ({
        token: '',
        data: null,
        setAuthToken: (data) => set(() => ({ token: data })),
        setAuthData: (data) => set(() => ({ data: data })),
        removeAuthToken: () => set({ token: '' }),
    }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    ))