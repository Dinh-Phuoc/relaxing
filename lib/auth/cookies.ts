import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const REFRESH_TOKEN_COOKIE = 'refreshToken';
const THIRTY_DAYS_S = 30 * 24 * 60 * 60;

export function getRefreshTokenCookieOptions(): Partial<ResponseCookie> {
    return {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        path: '/',
        maxAge: THIRTY_DAYS_S,
    };
}

export function clearRefreshTokenCookieOptions(): Partial<ResponseCookie> {
    return {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        path: '/',
        maxAge: 0,
    };
}

export { REFRESH_TOKEN_COOKIE };
