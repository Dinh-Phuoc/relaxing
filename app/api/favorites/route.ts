import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '~/lib/db/mongoose';
import { getAuthFromRequest } from '~/lib/auth/get-auth';
import FavoriteModel from '~/models/favorite.model';

export async function GET(request: NextRequest) {
    const auth = getAuthFromRequest(request);
    if (!auth) {
        return NextResponse.json(
            { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized', statusCode: 401 } },
            { status: 401 },
        );
    }

    await connectDB();
    const favorites = await FavoriteModel.find({ userId: auth.userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: favorites });
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

    const favorite = await FavoriteModel.findOneAndUpdate(
        { userId: auth.userId, movieId: body.movieId },
        { ...body, userId: auth.userId },
        { upsert: true, new: true },
    );
    return NextResponse.json({ success: true, data: favorite });
}
