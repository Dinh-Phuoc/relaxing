import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '~/lib/auth/get-auth';
import { handleRouteError } from '~/lib/api/handle-route-error';
import { authService } from '~/services/auth/auth.service';
import { UserRole } from '~/types/auth';

function toActor(auth: { userId: string; username: string; role: string }) {
    return {
        userId: auth.userId,
        username: auth.username,
        role: auth.role as UserRole,
    };
}

export async function GET(request: NextRequest) {
    try {
        const auth = requireAdmin(request);

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') ?? '1', 10);
        const limit = parseInt(searchParams.get('limit') ?? '50', 10);

        const result = await authService.listUsers(page, limit, toActor(auth));
        return NextResponse.json({ success: true, data: result });
    } catch (error: unknown) {
        return handleRouteError('GET /api/admin/users', error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = requireAdmin(request);

        const body = await request.json();
        const { username, password, role, isActive } = body as {
            username?: string;
            password?: string;
            role?: UserRole;
            isActive?: boolean;
        };

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

        const user = await authService.createUser({
            username,
            password,
            role,
            isActive,
            createdBy: toActor(auth),
        });
        return NextResponse.json({ success: true, data: user, message: 'Tạo tài khoản thành công.' });
    } catch (error: unknown) {
        return handleRouteError('POST /api/admin/users', error);
    }
}
