import { NextRequest, NextResponse } from 'next/server';
import { movieAggregator } from '~/services/movie/movie-aggregator.service';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params;
    const source = new URL(request.url).searchParams.get('source') ?? undefined;
    const movie = await movieAggregator.getMovie(slug, source);

    if (!movie) {
        return NextResponse.json(
            {
                success: false,
                error: { code: 'NOT_FOUND', message: 'Movie not found', statusCode: 404 },
            },
            { status: 404 },
        );
    }
    return NextResponse.json({ success: true, data: movie });
}
