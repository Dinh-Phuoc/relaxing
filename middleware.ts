import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '~/lib/auth/jwt';
import { REFRESH_TOKEN_COOKIE } from '~/lib/auth/cookies';

// Routes yêu cầu đăng nhập
const PROTECTED_ROUTES = ['/profile', '/favorites', '/history'];

// Routes chỉ cho user chưa đăng nhập
const AUTH_ONLY_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Lấy access token từ header
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    let isAuthenticated = false;
    if (accessToken) {
        try {
            verifyAccessToken(accessToken);
            isAuthenticated = true;
        } catch {
            isAuthenticated = false;
        }
    }

    // Có refresh token cookie = có thể tự refresh (coi như authenticated ở edge)
    const hasRefreshToken = !!request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    const isLoggedIn = isAuthenticated || hasRefreshToken;

    // Redirect nếu chưa login mà vào protected route
    if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) && !isLoggedIn) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect nếu đã login mà vào login/register
    if (AUTH_ONLY_ROUTES.some((route) => pathname.startsWith(route)) && isLoggedIn) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Bỏ qua static files và API routes (API tự handle auth)
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
