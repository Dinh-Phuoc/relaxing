import { NextRequest, NextResponse } from 'next/server';
import { authService } from '~/services/auth/auth.service';
import { getRefreshTokenCookieOptions, REFRESH_TOKEN_COOKIE } from '~/lib/auth/cookies';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, username, password } = body;

        if (!email || !username || !password) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Email, username and password are required',
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

        const result = await authService.register({ email, username, password });

        const response = NextResponse.json({
            success: true,
            data: { accessToken: result.accessToken, user: result.user },
        });

        response.cookies.set(REFRESH_TOKEN_COOKIE, result.refreshToken, getRefreshTokenCookieOptions());
        return response;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        if (message === 'EMAIL_EXISTS') {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'EMAIL_EXISTS', message: 'Email already in use', statusCode: 409 },
                },
                { status: 409 },
            );
        }
        if (message === 'USERNAME_EXISTS') {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'USERNAME_EXISTS', message: 'Username already taken', statusCode: 409 },
                },
                { status: 409 },
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
