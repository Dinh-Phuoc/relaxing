'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Heart, Star, Clock, Calendar, Globe, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useMovieDetail, useRelatedMovies } from '~/hooks/useMovies';
import { useResponsive } from '~/hooks/useResponsive';
import { useFavorites } from '~/hooks/useFavorites';
import MovieSection from '~/components/movie/MovieSection';
import {
    FullPageCenter,
    FullPageCenterColumn,
    LoadingSpinner,
    AccentLink,
    NotFoundText,
} from '~/styles/components/layout.styles';
import {
    DetailPage,
    BackdropSection,
    BackdropGradient,
    DetailContainer,
    HeroGrid,
    PosterColumn,
    PosterFrame,
    InfoColumn,
    GenreRow,
    GenreLink,
    DetailTitle,
    OriginalTitle,
    MetaRow,
    MetaItem,
    MetaRating,
    QualityBadge,
    StatusBadge,
    ActionRow,
    WatchLink,
    FavoriteButton,
    DescriptionBlock,
    DescriptionText,
    ToggleDescButton,
    CastRow,
    CastLabel,
    CastText,
    DirectorRow,
    DirectorLabel,
    DirectorText,
    EpisodesSection,
    SectionTitle,
    SectionAccentBar,
    EpisodeGroupBlock,
    EpisodeGroupTitle,
    EpisodeLinkRow,
    EpisodeLink,
    ShowMoreEpButton,
    RelatedSection,
} from '~/styles/components/movie-detail.styles';

interface Props {
    slug: string;
    source?: string;
}

export default function MovieDetailClient({ slug, source }: Props) {
    const { data: movie, isLoading, error } = useMovieDetail(slug, source);
    const { data: related } = useRelatedMovies(slug);
    const { isMobile, isTablet } = useResponsive();
    const { isFavorited, toggleFavorite } = useFavorites();
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [showAllEps, setShowAllEps] = useState(false);

    const isSingleColumn = isMobile || isTablet;
    const favorited = movie ? isFavorited(movie.id) : false;

    const handleFavorite = () => {
        if (!movie) return;
        toggleFavorite({
            id: movie.id,
            slug: movie.slug,
            source: movie.source,
            title: movie.title,
            poster: movie.poster,
            year: movie.year,
        });
    };

    if (isLoading) {
        return (
            <FullPageCenter>
                <LoadingSpinner />
            </FullPageCenter>
        );
    }

    if (error || !movie) {
        return (
            <FullPageCenterColumn>
                <NotFoundText>Không tìm thấy phim</NotFoundText>
                <AccentLink href="/">← Về trang chủ</AccentLink>
            </FullPageCenterColumn>
        );
    }

    const description = movie.description?.replace(/<[^>]*>/g, '') ?? '';
    const backdropHeight = isMobile ? '280px' : isTablet ? '380px' : '480px';

    return (
        <DetailPage>
            <BackdropSection $height={backdropHeight}>
                <Image
                    src={movie.backdrop || movie.poster}
                    alt={movie.title}
                    fill
                    priority
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    sizes="100vw"
                />
                <BackdropGradient />
            </BackdropSection>

            <DetailContainer $isMobile={isMobile}>
                <HeroGrid $isSingleColumn={isSingleColumn}>
                    {!isSingleColumn && (
                        <PosterColumn>
                            <PosterFrame>
                                <Image
                                    src={movie.poster}
                                    alt={movie.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="200px"
                                />
                            </PosterFrame>
                        </PosterColumn>
                    )}

                    <InfoColumn $isSingleColumn={isSingleColumn}>
                        <GenreRow>
                            {movie.genres?.slice(0, 3).map((g) => (
                                <GenreLink key={g} href={`/search?genre=${encodeURIComponent(g)}`}>
                                    {g}
                                </GenreLink>
                            ))}
                        </GenreRow>

                        <DetailTitle $isMobile={isMobile} $isTablet={isTablet}>
                            {movie.title}
                        </DetailTitle>

                        {movie.originalTitle && movie.originalTitle !== movie.title && (
                            <OriginalTitle $isMobile={isMobile}>{movie.originalTitle}</OriginalTitle>
                        )}

                        <MetaRow $isMobile={isMobile}>
                            {movie.year && (
                                <MetaItem>
                                    <Calendar size={13} /> {movie.year}
                                </MetaItem>
                            )}
                            {movie.duration && (
                                <MetaItem>
                                    <Clock size={13} /> {movie.duration}
                                </MetaItem>
                            )}
                            {movie.rating && (
                                <MetaRating>
                                    <Star size={13} fill="#f5c518" /> {movie.rating.toFixed(1)}
                                </MetaRating>
                            )}
                            {movie.countries?.length ? (
                                <MetaItem>
                                    <Globe size={13} /> {movie.countries.join(', ')}
                                </MetaItem>
                            ) : null}
                            {movie.quality && <QualityBadge>{movie.quality}</QualityBadge>}
                            {movie.status && (
                                <StatusBadge $completed={movie.status === 'completed'}>
                                    {movie.status === 'completed' ? 'Hoàn thành' : 'Đang chiếu'}
                                </StatusBadge>
                            )}
                        </MetaRow>

                        <ActionRow>
                            <WatchLink
                                href={`/watch/${movie.slug}?source=${movie.source}`}
                                $isMobile={isMobile}
                            >
                                <Play size={16} fill="white" /> Xem phim
                            </WatchLink>

                            <FavoriteButton
                                onClick={handleFavorite}
                                title={favorited ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
                                $favorited={favorited}
                            >
                                <Heart size={18} fill={favorited ? '#e50914' : 'none'} />
                            </FavoriteButton>
                        </ActionRow>

                        {description && (
                            <DescriptionBlock>
                                <DescriptionText $expanded={showFullDesc}>{description}</DescriptionText>
                                {description.length > 200 && (
                                    <ToggleDescButton onClick={() => setShowFullDesc(!showFullDesc)}>
                                        {showFullDesc ? (
                                            <>
                                                <ChevronUp size={13} /> Thu gọn
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown size={13} /> Xem thêm
                                            </>
                                        )}
                                    </ToggleDescButton>
                                )}
                            </DescriptionBlock>
                        )}

                        {movie.actors?.length ? (
                            <CastRow>
                                <CastLabel>
                                    <Users size={12} /> Diễn viên:
                                </CastLabel>
                                <CastText>{movie.actors.slice(0, 8).join(', ')}</CastText>
                            </CastRow>
                        ) : null}

                        {movie.directors?.length ? (
                            <DirectorRow>
                                <DirectorLabel>Đạo diễn: </DirectorLabel>
                                <DirectorText>{movie.directors.join(', ')}</DirectorText>
                            </DirectorRow>
                        ) : null}
                    </InfoColumn>
                </HeroGrid>

                {movie.episodeGroups && movie.episodeGroups.length > 0 && (
                    <EpisodesSection>
                        <SectionTitle $isMobile={isMobile}>
                            <SectionAccentBar />
                            Danh sách tập
                        </SectionTitle>
                        {movie.episodeGroups.map((group) => {
                            const displayEps = showAllEps
                                ? group.episodes
                                : group.episodes.slice(0, 50);
                            return (
                                <EpisodeGroupBlock key={group.serverIndex}>
                                    {movie.episodeGroups!.length > 1 && (
                                        <EpisodeGroupTitle>{group.serverName}</EpisodeGroupTitle>
                                    )}
                                    <EpisodeLinkRow>
                                        {displayEps.map((ep) => (
                                            <EpisodeLink
                                                key={ep.slug}
                                                href={`/watch/${movie.slug}?source=${movie.source}&ep=${ep.slug}&server=${group.serverIndex}`}
                                                $isMobile={isMobile}
                                            >
                                                {ep.name}
                                            </EpisodeLink>
                                        ))}
                                        {group.episodes.length > 50 && (
                                            <ShowMoreEpButton onClick={() => setShowAllEps(!showAllEps)}>
                                                {showAllEps
                                                    ? '▲ Thu gọn'
                                                    : `+${group.episodes.length - 50} tập nữa`}
                                            </ShowMoreEpButton>
                                        )}
                                    </EpisodeLinkRow>
                                </EpisodeGroupBlock>
                            );
                        })}
                    </EpisodesSection>
                )}

                {related && related.length > 0 && (
                    <RelatedSection>
                        <MovieSection
                            title="Phim liên quan"
                            movies={related}
                            viewAllHref={`/search?genre=${movie.genres?.[0] ?? ''}`}
                        />
                    </RelatedSection>
                )}
            </DetailContainer>
        </DetailPage>
    );
}
