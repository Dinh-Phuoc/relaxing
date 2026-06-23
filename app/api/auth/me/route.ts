import { NextRequest, NextResponse } from 'next/server';
import { authService } from '~/services/auth/auth.service';
import { getAuthFromRequest } from '~/lib/auth/get-auth';

export async function GET(request: NextRequest) {
    try {
        const auth = getAuthFromRequest(request);
        if (!auth) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'UNAUTHORIZED', message: 'Unauthorized', statusCode: 401 },
                },
                { status: 401 },
            );
        }
        const user = await authService.getMe(auth.userId);
        return NextResponse.json({ success: true, data: user });
    } catch {
        return NextResponse.json(
            {
                success: false,
                error: { code: 'SERVER_ERROR', message: 'Internal server error', statusCode: 500 },
            },
            { status: 500 },
        );
    }
}
