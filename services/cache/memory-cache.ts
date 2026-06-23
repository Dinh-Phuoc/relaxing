import { CacheInterface } from './cache.interface';

interface CacheEntry {
    value: unknown;
    expiresAt: number;
}

class MemoryCacheService implements CacheInterface {
    private store = new Map<string, CacheEntry>();

    async get<T>(key: string): Promise<T | null> {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return entry.value as T;
    }

    async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
        this.store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
    }

    async del(key: string): Promise<void> {
        this.store.delete(key);
    }

    async flush(): Promise<void> {
        this.store.clear();
    }
}

declare global {
    // eslint-disable-next-line no-var
    var __memoryCache: MemoryCacheService | undefined;
}

export const memoryCache: CacheInterface =
    global.__memoryCache ?? new MemoryCacheService();

if (!global.__memoryCache) {
    global.__memoryCache = memoryCache as MemoryCacheService;
}
