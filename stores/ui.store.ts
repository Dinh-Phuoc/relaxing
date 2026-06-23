'use client';

import { create } from 'zustand';

interface UIStore {
    isMobileNavOpen: boolean;
    isSearchOpen: boolean;
    toggleMobileNav: () => void;
    closeMobileNav: () => void;
    toggleSearch: () => void;
    closeSearch: () => void;
}

export const useUIStore = create<UIStore>()((set) => ({
    isMobileNavOpen: false,
    isSearchOpen: false,
    toggleMobileNav: () => set((s) => ({ isMobileNavOpen: !s.isMobileNavOpen })),
    closeMobileNav: () => set({ isMobileNavOpen: false }),
    toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
    closeSearch: () => set({ isSearchOpen: false }),
}));
