'use client';

import { create } from 'zustand';

interface PlayerStore {
    currentEpisodeSlug: string | null;
    currentServerIndex: number;
    progressSeconds: number;
    setEpisode: (slug: string) => void;
    setServer: (index: number) => void;
    setProgress: (seconds: number) => void;
    reset: () => void;
}

export const usePlayerStore = create<PlayerStore>()((set) => ({
    currentEpisodeSlug: null,
    currentServerIndex: 0,
    progressSeconds: 0,
    setEpisode: (slug) => set({ currentEpisodeSlug: slug, progressSeconds: 0 }),
    setServer: (index) => set({ currentServerIndex: index }),
    setProgress: (seconds) => set({ progressSeconds: seconds }),
    reset: () => set({ currentEpisodeSlug: null, currentServerIndex: 0, progressSeconds: 0 }),
}));
