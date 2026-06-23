import { NextRequest, NextResponse } from 'next/server';
import { authService } from '~/services/auth/auth.service';
import { getRefreshTokenCookieOptions, REFRESH_TOKEN_COOKIE } from '~/lib/auth/cookies';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Email and password are required',
                        statusCode: 400,
                    },
                },
                { status: 400 },
            );
        }

        const result = await authService.login({ email, password });

        const response = NextResponse.json({
            success: true,
            data: { accessToken: result.accessToken, user: result.user },
        });

        response.cookies.set(REFRESH_TOKEN_COOKIE, result.refreshToken, getRefreshTokenCookieOptions());
        return response;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : '';
        if (message === 'INVALID_CREDENTIALS') {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Invalid email or password',
                        statusCode: 401,
                    },
                },
                { status: 401 },
            );
        }
        return NextResponse.json(
            {
                success: false,
                error: { code: 'SERVER_ERROR', message: 'Internal server error', statusCode: 500 },
            },
            { status: 500 },
        );
    }
}
