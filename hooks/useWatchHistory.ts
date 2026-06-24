'use client';

import { useState, useEffect, useCallback } from 'react';

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

const STORAGE_KEY = 'cinehub_watch_history';
const MAX_ITEMS = 100;

function makeHistoryId(source: string, movieId: string): string {
    return `${source}:${movieId}`;
}

function loadHistory(): WatchHistoryItem[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
        return [];
    }
}

function saveHistory(items: WatchHistoryItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function sortHistory(items: WatchHistoryItem[]): WatchHistoryItem[] {
    return [...items].sort((a, b) => b.lastWatchedAt - a.lastWatchedAt);
}

export function useWatchHistory() {
    const [history, setHistory] = useState<WatchHistoryItem[]>([]);

    const refresh = useCallback(() => {
        setHistory(sortHistory(loadHistory()));
    }, []);

    useEffect(() => {
        refresh();

        const onStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) refresh();
        };
        const onFocus = () => refresh();

        window.addEventListener('storage', onStorage);
        window.addEventListener('focus', onFocus);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('focus', onFocus);
        };
    }, [refresh]);

    const upsertHistory = useCallback((input: UpsertWatchHistoryInput) => {
        const id = makeHistoryId(input.source, input.movieId);
        const now = Date.now();

        setHistory((prev) => {
            const base = prev.length > 0 ? prev : loadHistory();
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
            saveHistory(next);
            return next;
        });
    }, []);

    const removeHistory = useCallback((id: string) => {
        setHistory((prev) => {
            const next = prev.filter((item) => item.id !== id);
            saveHistory(next);
            return next;
        });
    }, []);

    const clearHistory = useCallback(() => {
        saveHistory([]);
        setHistory([]);
    }, []);

    return { history, upsertHistory, removeHistory, clearHistory };
}
