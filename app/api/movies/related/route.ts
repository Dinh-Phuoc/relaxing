import { NextRequest, NextResponse } from 'next/server';
import { movieAggregator } from '~/services/movie/movie-aggregator.service';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') ?? '';
    const limit = parseInt(searchParams.get('limit') ?? '12');
    const related = await movieAggregator.getRelated(slug, limit);
    return NextResponse.json({ success: true, data: related });
}
