import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '~/lib/db/mongoose';
import { getAuthFromRequest } from '~/lib/auth/get-auth';
import WatchHistoryModel from '~/models/watch-history.model';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const auth = getAuthFromRequest(request);
    if (!auth) {
        return NextResponse.json(
            { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized', statusCode: 401 } },
            { status: 401 },
        );
    }

    const { id } = await params;
    await connectDB();
    await WatchHistoryModel.deleteOne({ _id: id, userId: auth.userId });
    return NextResponse.json({ success: true, data: null });
}
