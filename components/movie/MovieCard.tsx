'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { NormalizedMovie } from '~/types/movie';
import { Badge } from '~/components/ui/badge';
import {
    MoviePosterLink,
    MoviePosterCard,
    MoviePosterOverlay,
    MoviePosterPlay,
    MovieBadgeRow,
    MovieTitle,
    PosterPlaceholder,
    PosterGradient,
    PlayIconOffset,
} from '~/styles/components/movie.styles';

interface MovieCardProps {
    movie: NormalizedMovie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const [hovered, setHovered] = useState(false);
    const [imgError, setImgError] = useState(false);

    const episodeBadge = movie.currentEpisode ?? (movie.type === 'movie' ? null : null);

    return (
        <MoviePosterLink href={`/movie/${movie.slug}?source=${movie.source}`}>
            <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                <MoviePosterCard $hovered={hovered}>
                    {!imgError ? (
                        <Image
                            src={movie.poster || movie.thumb || '/placeholder.jpg'}
                            alt={movie.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 150px, 180px"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <PosterPlaceholder>
                            <Play size={28} color="#e50914" />
                        </PosterPlaceholder>
                    )}

                    <MoviePosterOverlay $hovered={hovered} />

                    {hovered && (
                        <MoviePosterPlay>
                            <PlayIconOffset>
                                <Play size={18} color="white" fill="white" />
                            </PlayIconOffset>
                        </MoviePosterPlay>
                    )}

                    {movie.quality && (
                        <MovieBadgeRow>
                            <Badge variant="quality">{movie.quality}</Badge>
                            {movie.type === 'anime' && <Badge variant="anime">ANIME</Badge>}
                        </MovieBadgeRow>
                    )}

                    {episodeBadge && (
                        <div className="absolute top-1.5 right-1.5">
                            <Badge variant="episode" className="max-w-[70px] truncate block">
                                {episodeBadge}
                            </Badge>
                        </div>
                    )}

                    <PosterGradient>
                        {movie.year && (
                            <span className="text-white/60 text-[10px]">{movie.year}</span>
                        )}
                    </PosterGradient>
                </MoviePosterCard>

                <MovieTitle $hovered={hovered}>{movie.title}</MovieTitle>
            </div>
        </MoviePosterLink>
    );
}
