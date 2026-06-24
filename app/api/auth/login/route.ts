import { NextRequest, NextResponse } from 'next/server';
import { authService } from '~/services/auth/auth.service';
import { getRefreshTokenCookieOptions, REFRESH_TOKEN_COOKIE } from '~/lib/auth/cookies';
import { handleRouteError } from '~/lib/api/handle-route-error';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Username and password are required',
                        statusCode: 400,
                    },
                },
                { status: 400 },
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Password must be at least 6 characters',
                        statusCode: 400,
                    },
                },
                { status: 400 },
            );
        }

        const result = await authService.login({ username, password });

        const response = NextResponse.json({
            success: true,
            data: { accessToken: result.accessToken, user: result.user },
        });

        response.cookies.set(REFRESH_TOKEN_COOKIE, result.refreshToken, getRefreshTokenCookieOptions());
        return response;
    } catch (error: unknown) {
        return handleRouteError('POST /api/auth/login', error);
    }
}
