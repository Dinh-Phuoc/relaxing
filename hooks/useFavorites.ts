'use client';

import { useState, useEffect, useCallback } from 'react';

export interface FavoriteItem {
    id: string;
    slug: string;
    source: string;
    title: string;
    poster: string;
    year?: number;
    addedAt: number;
}

const STORAGE_KEY = 'cinehub_favorites';

function loadFavorites(): FavoriteItem[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
        return [];
    }
}

function saveFavorites(items: FavoriteItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    useEffect(() => {
        setFavorites(loadFavorites());

        const onStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) setFavorites(loadFavorites());
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const isFavorited = useCallback(
        (id: string) => favorites.some((f) => f.id === id),
        [favorites],
    );

    const addFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
        setFavorites((prev) => {
            if (prev.some((f) => f.id === item.id)) return prev;
            const next = [{ ...item, addedAt: Date.now() }, ...prev];
            saveFavorites(next);
            return next;
        });
    }, []);

    const removeFavorite = useCallback((id: string) => {
        setFavorites((prev) => {
            const next = prev.filter((f) => f.id !== id);
            saveFavorites(next);
            return next;
        });
    }, []);

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
