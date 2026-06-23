import { NextRequest, NextResponse } from 'next/server';
import { movieAggregator } from '~/services/movie/movie-aggregator.service';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '24');
    const result = await movieAggregator.getLatest(page, limit);
    return NextResponse.json({ success: true, data: result });
}
