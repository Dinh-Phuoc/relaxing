'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Trash2 } from 'lucide-react';
import { FavoriteItem } from '~/hooks/useFavorites';
import { Badge } from '~/components/ui/badge';
import {
    CardItemWrap,
    MoviePosterLink,
    MoviePosterCard,
    HoverPosterOverlay,
    PlayButton,
    YearBadgeBottom,
    MovieTitle,
    FavoriteRemoveButton,
    PlayIconOffset,
} from '~/styles/components/movie.styles';

interface FavoriteCardProps {
    item: FavoriteItem;
    onRemove: (id: string) => void;
}

export default function FavoriteCard({ item, onRemove }: FavoriteCardProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <CardItemWrap onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <MoviePosterLink href={`/movie/${item.slug}?source=${item.source}`}>
                <MoviePosterCard $hovered={hovered}>
                    <Image
                        src={item.poster}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 140px, 170px"
                    />

                    <HoverPosterOverlay $hovered={hovered}>
                        {hovered && (
                            <PlayButton $size={40}>
                                <PlayIconOffset>
                                    <Play size={17} color="white" fill="white" />
                                </PlayIconOffset>
                            </PlayButton>
                        )}
                    </HoverPosterOverlay>

                    {item.year && (
                        <YearBadgeBottom>
                            <Badge variant="episode">{item.year}</Badge>
                        </YearBadgeBottom>
                    )}
                </MoviePosterCard>

                <MovieTitle $hovered={hovered}>{item.title}</MovieTitle>
            </MoviePosterLink>

            <FavoriteRemoveButton
                type="button"
                $visible={hovered}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                }}
                title="Bỏ yêu thích"
            >
                <Trash2 size={12} />
            </FavoriteRemoveButton>
        </CardItemWrap>
    );
}
