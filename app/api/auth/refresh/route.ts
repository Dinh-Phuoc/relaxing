import { NextRequest, NextResponse } from 'next/server';
import { authService } from '~/services/auth/auth.service';
import { getRefreshTokenCookieOptions, REFRESH_TOKEN_COOKIE } from '~/lib/auth/cookies';

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
    } catch {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'INVALID_REFRESH_TOKEN',
                    message: 'Invalid refresh token',
                    statusCode: 401,
                },
            },
            { status: 401 },
        );
    }
}
