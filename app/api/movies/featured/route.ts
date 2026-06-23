import { NextResponse } from 'next/server';
import { movieAggregator } from '~/services/movie/movie-aggregator.service';

export async function GET() {
    const items = await movieAggregator.getFeatured();
    return NextResponse.json({ success: true, data: items });
}
