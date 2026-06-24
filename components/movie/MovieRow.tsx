'use client';

import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { NormalizedMovie } from '~/types/movie';
import MovieCard from './MovieCard';
import {
    RowSection,
    RowHeader,
    RowTitleGroup,
    RowAccentBar,
    RowTitle,
    RowViewAllLink,
    RowScrollWrap,
    RowScrollButtonLeft,
    RowScrollButtonRight,
    RowScrollTrack,
    RowCardSlot,
    SkeletonPoster,
    SkeletonTitle,
} from '~/styles/components/movie-row.styles';

interface MovieRowProps {
    title: string;
    movies?: NormalizedMovie[];
    isLoading?: boolean;
    viewAllHref?: string;
    accentColor?: string;
}

export default function MovieRow({
    title,
    movies,
    isLoading,
    viewAllHref,
    accentColor = '#e50914',
}: MovieRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const amount = scrollRef.current.clientWidth * 0.75;
        scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    };

    return (
        <RowSection>
            <RowHeader>
                <RowTitleGroup>
                    <RowAccentBar $color={accentColor} />
                    <RowTitle>{title}</RowTitle>
                </RowTitleGroup>
                {viewAllHref && (
                    <RowViewAllLink href={viewAllHref}>
                        Xem tất cả <ChevronRight size={14} />
                    </RowViewAllLink>
                )}
            </RowHeader>

            <RowScrollWrap>
                <RowScrollButtonLeft type="button" onClick={() => scroll('left')}>
                    <ChevronLeft size={16} />
                </RowScrollButtonLeft>

                <RowScrollTrack ref={scrollRef} className="hide-scrollbar">
                    {isLoading
                        ? Array.from({ length: 8 }).map((_, i) => (
                              <RowCardSlot key={i}>
                                  <SkeletonPoster />
                                  <SkeletonTitle />
                              </RowCardSlot>
                          ))
                        : (movies ?? []).slice(0, 20).map((movie) => (
                              <RowCardSlot key={movie.id}>
                                  <MovieCard movie={movie} />
                              </RowCardSlot>
                          ))}
                </RowScrollTrack>

                <RowScrollButtonRight type="button" onClick={() => scroll('right')}>
                    <ChevronRight size={16} />
                </RowScrollButtonRight>
            </RowScrollWrap>
        </RowSection>
    );
}
