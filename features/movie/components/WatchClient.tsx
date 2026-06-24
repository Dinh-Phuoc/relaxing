'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Server, ChevronDown, ChevronUp } from 'lucide-react';
import { useMovieDetail, useRelatedMovies } from '~/hooks/useMovies';
import { usePlayerStore } from '~/stores/player.store';
import { useWatchHistory } from '~/hooks/useWatchHistory';
import { useResponsive } from '~/hooks/useResponsive';
import MovieRow from '~/components/movie/MovieRow';
import { EpisodeGroup, Episode } from '~/types/movie';
import {
    FullPageCenter,
    FullPageCenterColumn,
    LoadingSpinner,
    AccentLink,
} from '~/styles/components/layout.styles';
import {
    WatchPageContainer,
    WatchBackLink,
    WatchBackTitle,
    WatchLayout,
    WatchMainColumn,
    PlayerWrapper,
    PlayerIframe,
    PlayerPlaceholder,
    PlayerPlaceholderIcon,
    PlayerPlaceholderText,
    WatchTitleBlock,
    WatchTitle,
    WatchEpisodeLabel,
    WatchEpisodeName,
    ServerSection,
    ServerLabelRow,
    ServerLabel,
    ServerButtonRow,
    ServerButton,
    MobileEpSection,
    MobileEpToggle,
    MobileEpPanel,
    RelatedSection,
    SidebarSticky,
    SidebarCard,
    SidebarHeader,
    SidebarTitle,
    SidebarCount,
    SidebarEpList,
    EpisodeGrid,
    EpisodeButton,
} from '~/styles/components/watch.styles';

interface Props {
    slug: string;
    source?: string;
    initialEp?: string;
    initialServer?: number;
}

function EpisodeGridList({
    episodes,
    compact = false,
    activeEp,
    onSelect,
}: {
    episodes: Episode[];
    compact?: boolean;
    activeEp: Episode | null;
    onSelect: (ep: Episode) => void;
}) {
    return (
        <EpisodeGrid $compact={compact}>
            {episodes.map((ep) => (
                <EpisodeButton
                    key={ep.slug}
                    onClick={() => onSelect(ep)}
                    title={ep.name}
                    $active={activeEp?.slug === ep.slug}
                >
                    {ep.name}
                </EpisodeButton>
            ))}
        </EpisodeGrid>
    );
}

export default function WatchClient({ slug, source, initialEp, initialServer = 0 }: Props) {
    const { data: movie, isLoading } = useMovieDetail(slug, source);
    const { data: related } = useRelatedMovies(slug);
    const { upsertHistory } = useWatchHistory();
    const { isMobile } = useResponsive();
    const { setEpisode, setServer } = usePlayerStore();

    const [activeGroup, setActiveGroup] = useState(initialServer);
    const [activeEp, setActiveEp] = useState<Episode | null>(null);
    const [embedUrl, setEmbedUrl] = useState('');
    const [showEpList, setShowEpList] = useState(!isMobile);

    const recordHistory = useCallback(
        (ep: Episode | null, serverIndex: number) => {
            if (!movie) return;
            upsertHistory({
                movieId: movie.id,
                slug: movie.slug,
                source: movie.source,
                title: movie.title,
                poster: movie.poster,
                episodeSlug: ep?.slug,
                episodeName: ep?.name,
                serverIndex,
                progressSeconds: 0,
            });
        },
        [movie, upsertHistory],
    );

    useEffect(() => {
        if (!movie) return;

        if (!movie.episodeGroups?.length) {
            recordHistory(null, 0);
            return;
        }

        const group: EpisodeGroup = movie.episodeGroups[activeGroup] ?? movie.episodeGroups[0];
        const ep = initialEp
            ? group.episodes.find((e) => e.slug === initialEp) ?? group.episodes[0]
            : group.episodes[0];
        if (ep) {
            setActiveEp(ep);
            setEpisode(ep.slug);
            setEmbedUrl(ep.servers[0]?.link ?? '');
            recordHistory(ep, activeGroup);
        }
    }, [movie, activeGroup, initialEp, recordHistory, setEpisode]);

    const handleSelectEp = (ep: Episode) => {
        setActiveEp(ep);
        setEpisode(ep.slug);
        setEmbedUrl(ep.servers[0]?.link ?? '');
        recordHistory(ep, activeGroup);
    };

    if (isLoading) {
        return (
            <FullPageCenter>
                <LoadingSpinner />
            </FullPageCenter>
        );
    }

    if (!movie) {
        return (
            <FullPageCenterColumn>
                <p className="text-text-secondary">Không tìm thấy phim</p>
                <AccentLink href="/">← Về trang chủ</AccentLink>
            </FullPageCenterColumn>
        );
    }

    const currentGroup = movie.episodeGroups?.[activeGroup];

    return (
        <WatchPageContainer $isMobile={isMobile}>
            <WatchBackLink href={`/movie/${movie.slug}?source=${movie.source}`}>
                <ChevronLeft size={16} />
                <WatchBackTitle $isMobile={isMobile}>{movie.title}</WatchBackTitle>
            </WatchBackLink>

            <WatchLayout $isMobile={isMobile}>
                <WatchMainColumn>
                    <PlayerWrapper>
                        {embedUrl ? (
                            <PlayerIframe
                                src={embedUrl}
                                allowFullScreen
                                allow="autoplay; fullscreen"
                                title={`${movie.title} - ${activeEp?.name ?? ''}`}
                            />
                        ) : (
                            <PlayerPlaceholder>
                                <PlayerPlaceholderIcon>🎬</PlayerPlaceholderIcon>
                                <PlayerPlaceholderText>Chọn tập để xem</PlayerPlaceholderText>
                            </PlayerPlaceholder>
                        )}
                    </PlayerWrapper>

                    <WatchTitleBlock>
                        <WatchTitle $isMobile={isMobile}>{movie.title}</WatchTitle>
                        {activeEp && (
                            <WatchEpisodeLabel>
                                Đang xem: <WatchEpisodeName>{activeEp.name}</WatchEpisodeName>
                            </WatchEpisodeLabel>
                        )}
                    </WatchTitleBlock>

                    {movie.episodeGroups && movie.episodeGroups.length > 1 && (
                        <ServerSection>
                            <ServerLabelRow>
                                <Server size={13} color="#606070" />
                                <ServerLabel>Server:</ServerLabel>
                            </ServerLabelRow>
                            <ServerButtonRow>
                                {movie.episodeGroups.map((g, i) => (
                                    <ServerButton
                                        key={i}
                                        onClick={() => {
                                            setActiveGroup(i);
                                            setServer(i);
                                        }}
                                        $active={activeGroup === i}
                                    >
                                        {g.serverName}
                                    </ServerButton>
                                ))}
                            </ServerButtonRow>
                        </ServerSection>
                    )}

                    {isMobile && currentGroup && currentGroup.episodes.length > 0 && (
                        <MobileEpSection>
                            <MobileEpToggle
                                onClick={() => setShowEpList(!showEpList)}
                                $expanded={showEpList}
                            >
                                <span>Danh sách tập ({currentGroup.episodes.length})</span>
                                {showEpList ? (
                                    <ChevronUp size={14} color="#a0a0b0" />
                                ) : (
                                    <ChevronDown size={14} color="#a0a0b0" />
                                )}
                            </MobileEpToggle>
                            {showEpList && (
                                <MobileEpPanel className="hide-scrollbar">
                                    <EpisodeGridList
                                        episodes={currentGroup.episodes}
                                        compact
                                        activeEp={activeEp}
                                        onSelect={handleSelectEp}
                                    />
                                </MobileEpPanel>
                            )}
                        </MobileEpSection>
                    )}

                    {related && related.length > 0 && (
                        <RelatedSection>
                            <MovieRow title="Phim liên quan" movies={related} />
                        </RelatedSection>
                    )}
                </WatchMainColumn>

                {!isMobile && currentGroup && currentGroup.episodes.length > 0 && (
                    <SidebarSticky>
                        <SidebarCard>
                            <SidebarHeader>
                                <SidebarTitle>Danh sách tập</SidebarTitle>
                                <SidebarCount>({currentGroup.episodes.length})</SidebarCount>
                            </SidebarHeader>
                            <SidebarEpList className="hide-scrollbar">
                                <EpisodeGridList
                                    episodes={currentGroup.episodes}
                                    compact
                                    activeEp={activeEp}
                                    onSelect={handleSelectEp}
                                />
                            </SidebarEpList>
                        </SidebarCard>
                    </SidebarSticky>
                )}
            </WatchLayout>
        </WatchPageContainer>
    );
}
