'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '~/stores/auth.store';
import {
    AUTH_CHANGED_EVENT,
    getUserStorageKey,
} from '~/lib/storage/user-local-storage';

export interface WatchHistoryItem {
    id: string;
    movieId: string;
    slug: string;
    source: string;
    title: string;
    poster: string;
    episodeSlug?: string;
    episodeName?: string;
    serverIndex?: number;
    progressSeconds: number;
    durationSeconds?: number;
    completed: boolean;
    lastWatchedAt: number;
}

export interface UpsertWatchHistoryInput {
    movieId: string;
    slug: string;
    source: string;
    title: string;
    poster: string;
    episodeSlug?: string;
    episodeName?: string;
    serverIndex?: number;
    progressSeconds?: number;
    durationSeconds?: number;
    completed?: boolean;
}

const STORAGE_BASE_KEY = 'cinehub_watch_history';
const MAX_ITEMS = 100;

function makeHistoryId(source: string, movieId: string): string {
    return `${source}:${movieId}`;
}

function loadHistory(storageKey: string | null): WatchHistoryItem[] {
    if (!storageKey || typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    } catch {
        return [];
    }
}

function saveHistory(storageKey: string, items: WatchHistoryItem[]): void {
    localStorage.setItem(storageKey, JSON.stringify(items));
}

function sortHistory(items: WatchHistoryItem[]): WatchHistoryItem[] {
    return [...items].sort((a, b) => b.lastWatchedAt - a.lastWatchedAt);
}

export function useWatchHistory() {
    const userId = useAuthStore((state) => state.user?._id ?? null);
    const storageKey = getUserStorageKey(STORAGE_BASE_KEY, userId);
    const [history, setHistory] = useState<WatchHistoryItem[]>([]);

    const refresh = useCallback(() => {
        setHistory(sortHistory(loadHistory(storageKey)));
    }, [storageKey]);

    useEffect(() => {
        refresh();

        const onStorage = (e: StorageEvent) => {
            if (storageKey && e.key === storageKey) refresh();
        };
        const onFocus = () => refresh();
        const onAuthChanged = () => refresh();

        window.addEventListener('storage', onStorage);
        window.addEventListener('focus', onFocus);
        window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('focus', onFocus);
            window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
        };
    }, [refresh, storageKey]);

    const upsertHistory = useCallback(
        (input: UpsertWatchHistoryInput) => {
            if (!storageKey) return;

            const id = makeHistoryId(input.source, input.movieId);
            const now = Date.now();

            setHistory((prev) => {
                const base = prev.length > 0 ? prev : loadHistory(storageKey);
                const existing = base.find((item) => item.id === id);
                const updated: WatchHistoryItem = {
                    id,
                    movieId: input.movieId,
                    slug: input.slug,
                    source: input.source,
                    title: input.title,
                    poster: input.poster,
                    episodeSlug: input.episodeSlug ?? existing?.episodeSlug,
                    episodeName: input.episodeName ?? existing?.episodeName,
                    serverIndex: input.serverIndex ?? existing?.serverIndex ?? 0,
                    progressSeconds: input.progressSeconds ?? existing?.progressSeconds ?? 0,
                    durationSeconds: input.durationSeconds ?? existing?.durationSeconds,
                    completed: input.completed ?? existing?.completed ?? false,
                    lastWatchedAt: now,
                };

                const without = base.filter((item) => item.id !== id);
                const next = sortHistory([updated, ...without]).slice(0, MAX_ITEMS);
                saveHistory(storageKey, next);
                return next;
            });
        },
        [storageKey],
    );

    const removeHistory = useCallback(
        (id: string) => {
            if (!storageKey) return;
            setHistory((prev) => {
                const base = prev.length > 0 ? prev : loadHistory(storageKey);
                const next = base.filter((item) => item.id !== id);
                saveHistory(storageKey, next);
                return next;
            });
        },
        [storageKey],
    );

    const clearHistory = useCallback(() => {
        if (!storageKey) return;
        saveHistory(storageKey, []);
        setHistory([]);
    }, [storageKey]);

    return { history, upsertHistory, removeHistory, clearHistory };
}
