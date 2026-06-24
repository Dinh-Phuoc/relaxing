import { NextResponse } from 'next/server';
import { logger } from '~/lib/logger';

export interface ApiErrorBody {
    code: string;
    message: string;
    statusCode: number;
    detail?: string;
}

const KNOWN_ERRORS: Record<string, ApiErrorBody> = {
    UNAUTHORIZED: { code: 'UNAUTHORIZED', message: 'Unauthorized', statusCode: 401 },
    FORBIDDEN: { code: 'FORBIDDEN', message: 'Forbidden', statusCode: 403 },
    USERNAME_EXISTS: { code: 'USERNAME_EXISTS', message: 'Tên người dùng đã tồn tại', statusCode: 409 },
    INVALID_ROLE: { code: 'INVALID_ROLE', message: 'Vai trò không hợp lệ', statusCode: 400 },
    FORBIDDEN_ROLE: {
        code: 'FORBIDDEN_ROLE',
        message: 'Bạn không có quyền gán vai trò này',
        statusCode: 403,
    },
    INVALID_CREDENTIALS: {
        code: 'INVALID_CREDENTIALS',
        message: 'Tên đăng nhập hoặc mật khẩu không đúng',
        statusCode: 401,
    },
    ACCOUNT_DISABLED: {
        code: 'ACCOUNT_DISABLED',
        message: 'Tài khoản đã bị vô hiệu hóa. Liên hệ admin.',
        statusCode: 403,
    },
    USER_NOT_FOUND: { code: 'USER_NOT_FOUND', message: 'Không tìm thấy tài khoản', statusCode: 404 },
    INVALID_REFRESH_TOKEN: {
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Invalid refresh token',
        statusCode: 401,
    },
};

function getMongoDuplicateField(error: unknown): string | null {
    if (!error || typeof error !== 'object' || (error as { code?: number }).code !== 11000) {
        return null;
    }

    const keyPattern = (error as { keyPattern?: Record<string, number> }).keyPattern;
    if (!keyPattern) return null;

    return Object.keys(keyPattern)[0] ?? null;
}

export function handleRouteError(context: string, error: unknown, extraKnown?: Record<string, ApiErrorBody>) {
    const known = { ...KNOWN_ERRORS, ...extraKnown };
    const message = error instanceof Error ? error.message : '';

    logger.error(context, error);

    if (message && known[message]) {
        const body = known[message];
        return NextResponse.json({ success: false, error: body }, { status: body.statusCode });
    }

    const dupField = getMongoDuplicateField(error);
    if (dupField === 'username') {
        const body = known.USERNAME_EXISTS;
        return NextResponse.json({ success: false, error: body }, { status: body.statusCode });
    }

    if (dupField === 'email') {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'STALE_DB_INDEX',
                    message:
                        'Index email cũ trên MongoDB chưa được xóa. Khởi động lại server hoặc chạy db.users.dropIndex("email_1").',
                    statusCode: 500,
                },
            },
            { status: 500 },
        );
    }

    const isDev = process.env.NODE_ENV === 'development';
    const detail = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
        {
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: isDev ? detail : 'Internal server error',
                statusCode: 500,
                ...(isDev && error instanceof Error ? { detail: error.stack } : {}),
            },
        },
        { status: 500 },
    );
}
