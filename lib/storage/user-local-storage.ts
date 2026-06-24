export const AUTH_CHANGED_EVENT = 'cinehub-auth-changed';

export function getUserStorageKey(baseKey: string, userId: string | null | undefined): string | null {
    if (!userId) return null;
    return `${baseKey}_${userId}`;
}

export function dispatchAuthChanged(): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}
