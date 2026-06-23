import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '~/lib/db/mongoose';
import { getAuthFromRequest } from '~/lib/auth/get-auth';
import FavoriteModel from '~/models/favorite.model';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ movieId: string }> },
) {
    const auth = getAuthFromRequest(request);
    if (!auth) {
        return NextResponse.json(
            { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized', statusCode: 401 } },
            { status: 401 },
        );
    }

    const { movieId } = await params;
    await connectDB();
    await FavoriteModel.deleteOne({ userId: auth.userId, movieId: decodeURIComponent(movieId) });
    return NextResponse.json({ success: true, data: null });
}
