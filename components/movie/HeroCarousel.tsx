'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { NormalizedMovie } from '~/types/movie';
import {
    HeroRoot,
    HeroBackdrop,
    HeroGradient,
    HeroContent,
    HeroInfo,
    HeroBadgeRow,
    HeroQualityBadge,
    HeroGenreBadge,
    HeroYearBadge,
    HeroTitle,
    HeroOriginalTitle,
    HeroDescription,
    HeroActions,
    HeroWatchLink,
    HeroDetailLink,
    HeroDots,
    HeroDot,
    HeroNavButtonLeft,
    HeroNavButtonRight,
} from '~/styles/components/hero.styles';

interface HeroCarouselProps {
    movies: NormalizedMovie[];
}

export default function HeroCarousel({ movies }: HeroCarouselProps) {
    const [current, setCurrent] = useState(0);
    const [fading, setFading] = useState(false);

    const goTo = useCallback((index: number) => {
        setFading(true);
        setTimeout(() => {
            setCurrent(index);
            setFading(false);
        }, 200);
    }, []);

    const next = useCallback(() => goTo((current + 1) % movies.length), [current, movies.length, goTo]);
    const prev = useCallback(() => goTo((current - 1 + movies.length) % movies.length), [current, movies.length, goTo]);

    useEffect(() => {
        if (movies.length <= 1) return;
        const timer = setInterval(next, 6000);
        return () => clearInterval(timer);
    }, [next, movies.length]);

    if (!movies.length) return null;

    const movie = movies[current];

    return (
        <HeroRoot>
            <HeroBackdrop $fading={fading}>
                <Image
                    src={movie.backdrop || movie.poster || movie.thumb || '/placeholder.jpg'}
                    alt={movie.title}
                    fill
                    priority
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    sizes="100vw"
                />
                <HeroGradient />
            </HeroBackdrop>

            <HeroContent>
                <HeroInfo $fading={fading}>
                    <HeroBadgeRow>
                        {movie.quality && <HeroQualityBadge>{movie.quality}</HeroQualityBadge>}
                        {movie.genres?.slice(0, 2).map((g) => (
                            <HeroGenreBadge key={g}>{g}</HeroGenreBadge>
                        ))}
                        {movie.year && <HeroYearBadge>{movie.year}</HeroYearBadge>}
                    </HeroBadgeRow>

                    <HeroTitle>{movie.title}</HeroTitle>

                    {movie.originalTitle && movie.originalTitle !== movie.title && (
                        <HeroOriginalTitle>{movie.originalTitle}</HeroOriginalTitle>
                    )}

                    {movie.description && (
                        <HeroDescription className="hero-desc">
                            {movie.description.replace(/<[^>]*>/g, '')}
                        </HeroDescription>
                    )}

                    <HeroActions>
                        <HeroWatchLink href={`/watch/${movie.slug}?source=${movie.source}`}>
                            <Play size={16} fill="white" /> Xem ngay
                        </HeroWatchLink>
                        <HeroDetailLink href={`/movie/${movie.slug}?source=${movie.source}`}>
                            <Info size={15} /> Chi tiết
                        </HeroDetailLink>
                    </HeroActions>
                </HeroInfo>
            </HeroContent>

            {movies.length > 1 && (
                <HeroDots>
                    {movies.map((_, i) => (
                        <HeroDot key={i} type="button" $active={i === current} onClick={() => goTo(i)} />
                    ))}
                </HeroDots>
            )}

            {movies.length > 1 && (
                <>
                    <HeroNavButtonLeft type="button" onClick={prev}>
                        <ChevronLeft size={18} />
                    </HeroNavButtonLeft>
                    <HeroNavButtonRight type="button" onClick={next}>
                        <ChevronRight size={18} />
                    </HeroNavButtonRight>
                </>
            )}
        </HeroRoot>
    );
}
