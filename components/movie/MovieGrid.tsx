'use client';

import React from 'react';
import { NormalizedMovie } from '~/types/movie';
import MovieCard from './MovieCard';
import { MovieGridSkeleton } from './MovieSkeleton';

interface MovieGridProps {
    movies: NormalizedMovie[];
    isLoading?: boolean;
    skeletonCount?: number;
    columns?: number;
}

export default function MovieGrid({ movies, isLoading, skeletonCount = 12 }: MovieGridProps) {
    if (isLoading) return <MovieGridSkeleton count={skeletonCount} />;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '12px',
        }}>
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
}
