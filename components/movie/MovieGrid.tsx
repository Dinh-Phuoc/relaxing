'use client';

import React from 'react';
import { NormalizedMovie } from '~/types/movie';
import MovieCard from './MovieCard';
import { MovieGridSkeleton } from './MovieSkeleton';
import { MovieGridWrap } from '~/styles/components/movie.styles';

interface MovieGridProps {
    movies: NormalizedMovie[];
    isLoading?: boolean;
    skeletonCount?: number;
    columns?: number;
}

export default function MovieGrid({ movies, isLoading, skeletonCount = 12 }: MovieGridProps) {
    if (isLoading) return <MovieGridSkeleton count={skeletonCount} />;

    return (
        <MovieGridWrap>
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </MovieGridWrap>
    );
}
