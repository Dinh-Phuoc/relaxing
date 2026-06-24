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

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const auth = requireAdmin(request);

        const { id } = await params;
        const body = await request.json();
        const { isActive } = body as { isActive?: boolean };

        if (typeof isActive !== 'boolean') {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'isActive phải là boolean',
                        statusCode: 400,
                    },
                },
                { status: 400 },
            );
        }

        const user = await authService.updateUserStatus(id, isActive, toActor(auth));
        return NextResponse.json({
            success: true,
            data: user,
            message: isActive ? 'Đã kích hoạt tài khoản.' : 'Đã vô hiệu hóa tài khoản.',
        });
    } catch (error: unknown) {
        return handleRouteError('PATCH /api/admin/users/[id]', error);
    }
}
