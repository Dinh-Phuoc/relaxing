import { NextRequest, NextResponse } from 'next/server';
import { authService } from '~/services/auth/auth.service';
import { clearRefreshTokenCookieOptions, REFRESH_TOKEN_COOKIE } from '~/lib/auth/cookies';

function buildLogoutResponse(): NextResponse {
    const response = NextResponse.json({ success: true, data: null });
    response.cookies.set(REFRESH_TOKEN_COOKIE, '', clearRefreshTokenCookieOptions());
    return response;
}

export async function POST(request: NextRequest) {
    try {
        const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
        if (refreshToken) {
            await authService.logout(refreshToken);
        }
        return buildLogoutResponse();
    } catch {
        // Vẫn xóa cookie dù revoke token thất bại — tránh session “ma” trên prod
        return buildLogoutResponse();
    }
}
