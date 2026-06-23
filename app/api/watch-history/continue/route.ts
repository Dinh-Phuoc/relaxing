import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '~/lib/db/mongoose';
import { getAuthFromRequest } from '~/lib/auth/get-auth';
import WatchHistoryModel from '~/models/watch-history.model';

export async function GET(request: NextRequest) {
    const auth = getAuthFromRequest(request);
    if (!auth) return NextResponse.json({ success: true, data: [] });

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') ?? '10');

    await connectDB();
    const items = await WatchHistoryModel.find({ userId: auth.userId, completed: false })
        .sort({ lastWatchedAt: -1 })
        .limit(limit);

    return NextResponse.json({ success: true, data: items });
}
