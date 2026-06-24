import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, verifyRefreshToken } from '~/lib/auth/jwt';
import { REFRESH_TOKEN_COOKIE } from '~/lib/auth/cookies';
import { isAccountManager } from '~/lib/auth/roles';

/** Trang công khai — không cần đăng nhập */
const PUBLIC_ROUTES = ['/login'];

/** API công khai — phục vụ đăng nhập / refresh session */
const PUBLIC_API_PREFIXES = ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'];

/** Routes chỉ dành cho admin */
const ADMIN_ROUTES = ['/admin'];

function resolveAuth(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    let isAuthenticated = false;
    let userRole: string | null = null;

    if (accessToken) {
        try {
            const payload = verifyAccessToken(accessToken);
            isAuthenticated = true;
            userRole = payload.role;
        } catch {
            isAuthenticated = false;
        }
    }

    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    if (!isAuthenticated && refreshToken) {
        try {
            const payload = verifyRefreshToken(refreshToken);
            isAuthenticated = true;
            userRole = payload.role;
        } catch {
            // Refresh token không hợp lệ
        }
    }

    return { isAuthenticated, userRole };
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const { isAuthenticated, userRole } = resolveAuth(request);

    // Đã bỏ đăng ký công khai — chuyển về trang login
    if (pathname.startsWith('/register')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // API đăng ký công khai đã tắt
    if (pathname.startsWith('/api/auth/register')) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Đăng ký công khai đã bị vô hiệu hóa. Vui lòng liên hệ admin.',
                    statusCode: 403,
                },
            },
            { status: 403 },
        );
    }

    const isApiRoute = pathname.startsWith('/api');
    const isPublicPage = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
    const isPublicApi = PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));

    // Chưa đăng nhập — chặn toàn bộ trang & API (trừ public)
    if (!isAuthenticated) {
        if (isApiRoute) {
            if (isPublicApi) return NextResponse.next();
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'UNAUTHORIZED', message: 'Unauthorized', statusCode: 401 },
                },
                { status: 401 },
            );
        }

        if (!isPublicPage) {
            const loginUrl = new URL('/login', request.url);
            const redirectPath = `${pathname}${request.nextUrl.search}`;
            if (redirectPath !== '/') {
                loginUrl.searchParams.set('redirect', redirectPath);
            }
            return NextResponse.redirect(loginUrl);
        }

        return NextResponse.next();
    }

    // Đã đăng nhập — không vào lại login
    if (pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Chỉ admin / super-admin mới vào /admin
    if (ADMIN_ROUTES.some((route) => pathname.startsWith(route)) && !isAccountManager(userRole)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Bao gồm cả API — web nội bộ, mọi request đều qua proxy
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
