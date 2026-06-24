'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '~/types/auth';
import { setAccessToken } from '~/lib/axios/client';
import { clearLoggedOutFlag } from '~/lib/auth/session-flags';
import { dispatchAuthChanged } from '~/lib/storage/user-local-storage';

interface AuthStore {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            setAuth: (user, token) => {
                clearLoggedOutFlag();
                setAccessToken(token);
                set({ user, accessToken: token, isAuthenticated: true });
                dispatchAuthChanged();
            },
            clearAuth: () => {
                setAccessToken(null);
                set({ user: null, accessToken: null, isAuthenticated: false });
                dispatchAuthChanged();
            },
            updateUser: (partial) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...partial } : null,
                })),
        }),
        {
            name: 'cinehub-auth',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
);
