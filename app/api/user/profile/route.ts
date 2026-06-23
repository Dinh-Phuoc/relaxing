import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '~/lib/db/mongoose';
import { getAuthFromRequest } from '~/lib/auth/get-auth';
import UserModel from '~/models/user.model';

export async function PATCH(request: NextRequest) {
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

        const body = await request.json();
        const { username, avatar } = body;

        await connectDB();

        const updateData: Record<string, string> = {};
        if (username) updateData.username = username;
        if (avatar !== undefined) updateData.avatar = avatar;

        if (username) {
            const existing = await UserModel.findOne({ username, _id: { $ne: auth.userId } });
            if (existing) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: 'USERNAME_EXISTS',
                            message: 'Username already taken',
                            statusCode: 409,
                        },
                    },
                    { status: 409 },
                );
            }
        }

        const user = await UserModel.findByIdAndUpdate(
            auth.userId,
            { $set: updateData },
            { new: true, select: '-passwordHash' },
        );

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
