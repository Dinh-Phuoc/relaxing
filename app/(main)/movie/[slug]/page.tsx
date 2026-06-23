import React from 'react';
import MovieDetailClient from '~/features/movie/components/MovieDetailClient';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ source?: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    return { title: `${slug} | CineHub` };
}

export default async function MovieDetailPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { source } = await searchParams;
    return <MovieDetailClient slug={slug} source={source} />;
}
