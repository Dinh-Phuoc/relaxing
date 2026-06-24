export const COOKIE_PROBE_KEY = 'cinehub-cookie-probed';
export const LOGGED_OUT_KEY = 'cinehub-logged-out';

export function markLoggedOut(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(LOGGED_OUT_KEY, '1');
    sessionStorage.removeItem(COOKIE_PROBE_KEY);
}

export function clearLoggedOutFlag(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(LOGGED_OUT_KEY);
}

export function hasLoggedOutFlag(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(LOGGED_OUT_KEY) === '1';
}
