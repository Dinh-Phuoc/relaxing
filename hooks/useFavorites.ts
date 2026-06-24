'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '~/stores/auth.store';
import {
    AUTH_CHANGED_EVENT,
    getUserStorageKey,
} from '~/lib/storage/user-local-storage';

export interface FavoriteItem {
    id: string;
    slug: string;
    source: string;
    title: string;
    poster: string;
    year?: number;
    addedAt: number;
}

const STORAGE_BASE_KEY = 'cinehub_favorites';

function loadFavorites(storageKey: string | null): FavoriteItem[] {
    if (!storageKey || typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    } catch {
        return [];
    }
}

function saveFavorites(storageKey: string, items: FavoriteItem[]): void {
    localStorage.setItem(storageKey, JSON.stringify(items));
}

export function useFavorites() {
    const userId = useAuthStore((state) => state.user?._id ?? null);
    const storageKey = getUserStorageKey(STORAGE_BASE_KEY, userId);
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    const refresh = useCallback(() => {
        setFavorites(loadFavorites(storageKey));
    }, [storageKey]);

    useEffect(() => {
        refresh();

        const onStorage = (e: StorageEvent) => {
            if (storageKey && e.key === storageKey) refresh();
        };
        const onAuthChanged = () => refresh();

        window.addEventListener('storage', onStorage);
        window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
        };
    }, [refresh, storageKey]);

    const isFavorited = useCallback(
        (id: string) => favorites.some((f) => f.id === id),
        [favorites],
    );

    const addFavorite = useCallback(
        (item: Omit<FavoriteItem, 'addedAt'>) => {
            if (!storageKey) return;
            setFavorites((prev) => {
                const base = storageKey && prev.length === 0 ? loadFavorites(storageKey) : prev;
                if (base.some((f) => f.id === item.id)) return base;
                const next = [{ ...item, addedAt: Date.now() }, ...base];
                saveFavorites(storageKey, next);
                return next;
            });
        },
        [storageKey],
    );

    const removeFavorite = useCallback(
        (id: string) => {
            if (!storageKey) return;
            setFavorites((prev) => {
                const base = prev.length > 0 ? prev : loadFavorites(storageKey);
                const next = base.filter((f) => f.id !== id);
                saveFavorites(storageKey, next);
                return next;
            });
        },
        [storageKey],
    );

    const toggleFavorite = useCallback(
        (item: Omit<FavoriteItem, 'addedAt'>) => {
            if (isFavorited(item.id)) {
                removeFavorite(item.id);
            } else {
                addFavorite(item);
            }
        },
        [isFavorited, addFavorite, removeFavorite],
    );

    return { favorites, isFavorited, addFavorite, removeFavorite, toggleFavorite };
}
