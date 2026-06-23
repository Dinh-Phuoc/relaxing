import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '~/lib/db/mongoose';
import { getAuthFromRequest } from '~/lib/auth/get-auth';
import WatchHistoryModel from '~/models/watch-history.model';

export async function GET(request: NextRequest) {
    const auth = getAuthFromRequest(request);
    if (!auth) {
        return NextResponse.json(
            { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized', statusCode: 401 } },
            { status: 401 },
        );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');

    await connectDB();
    const [items, total] = await Promise.all([
        WatchHistoryModel.find({ userId: auth.userId })
            .sort({ lastWatchedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        WatchHistoryModel.countDocuments({ userId: auth.userId }),
    ]);

    return NextResponse.json({
        success: true,
        data: {
            items,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1,
            },
        },
    });
}

export async function POST(request: NextRequest) {
    const auth = getAuthFromRequest(request);
    if (!auth) {
        return NextResponse.json(
            { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized', statusCode: 401 } },
            { status: 401 },
        );
    }

    const body = await request.json();
    await connectDB();

    const history = await WatchHistoryModel.findOneAndUpdate(
        { userId: auth.userId, movieId: body.movieId },
        {
            ...body,
            userId: auth.userId,
            lastWatchedAt: new Date(),
            completed: body.durationSeconds
                ? body.progressSeconds / body.durationSeconds > 0.9
                : false,
        },
        { upsert: true, new: true },
    );
    return NextResponse.json({ success: true, data: history });
}
