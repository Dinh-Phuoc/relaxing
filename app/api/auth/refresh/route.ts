import { NextRequest, NextResponse } from 'next/server';
import { authService } from '~/services/auth/auth.service';
import {
    clearRefreshTokenCookieOptions,
    getRefreshTokenCookieOptions,
    REFRESH_TOKEN_COOKIE,
} from '~/lib/auth/cookies';
import { handleRouteError } from '~/lib/api/handle-route-error';

export async function POST(request: NextRequest) {
    try {
        const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

        if (!refreshToken) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'NO_REFRESH_TOKEN', message: 'No refresh token', statusCode: 401 },
                },
                { status: 401 },
            );
        }

        const result = await authService.refresh(refreshToken);

        const response = NextResponse.json({
            success: true,
            data: { accessToken: result.accessToken },
        });

        response.cookies.set(
            REFRESH_TOKEN_COOKIE,
            result.refreshToken,
            getRefreshTokenCookieOptions(),
        );
        return response;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : '';
        const response = handleRouteError('POST /api/auth/refresh', error);

        if (message === 'ACCOUNT_DISABLED' || message === 'INVALID_REFRESH_TOKEN') {
            response.cookies.set(REFRESH_TOKEN_COOKIE, '', clearRefreshTokenCookieOptions());
        }

        return response;
    }
}
