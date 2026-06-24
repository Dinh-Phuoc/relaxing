'use client';

import React from 'react';
import {
    MovieGridSkeletonWrap,
    MovieCardSkeletonRoot,
    MovieCardSkeletonShimmer,
} from '~/styles/components/movie.styles';

export function MovieCardSkeleton() {
    return (
        <MovieCardSkeletonRoot>
            <MovieCardSkeletonShimmer />
        </MovieCardSkeletonRoot>
    );
}

export function MovieGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <MovieGridSkeletonWrap>
            {Array.from({ length: count }).map((_, i) => (
                <MovieCardSkeleton key={i} />
            ))}
        </MovieGridSkeletonWrap>
    );
}
