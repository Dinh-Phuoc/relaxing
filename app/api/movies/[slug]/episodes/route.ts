import { NextRequest, NextResponse } from 'next/server';
import { movieAggregator } from '~/services/movie/movie-aggregator.service';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params;
    const movie = await movieAggregator.getMovie(slug);
    return NextResponse.json({ success: true, data: movie?.episodeGroups ?? [] });
}
