import { NextRequest, NextResponse } from 'next/server';
import { movieAggregator } from '~/services/movie/movie-aggregator.service';
import { MovieType, MovieStatus } from '~/types/movie';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const result = await movieAggregator.search({
        q: searchParams.get('q') ?? undefined,
        genre: searchParams.get('genre') ?? undefined,
        country: searchParams.get('country') ?? undefined,
        year: searchParams.get('year') ?? undefined,
        type: (searchParams.get('type') as MovieType) || undefined,
        status: (searchParams.get('status') as MovieStatus) || undefined,
        page: parseInt(searchParams.get('page') ?? '1'),
        limit: parseInt(searchParams.get('limit') ?? '24'),
    });
    return NextResponse.json({ success: true, data: result });
}
