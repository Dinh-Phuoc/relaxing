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

interface Props {
    slug: string;
    source?: string;
    initialEp?: string;
    initialServer?: number;
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
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '48px', height: '48px', border: '3px solid rgba(229,9,20,0.3)', borderTopColor: '#e50914', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        );
    }

    if (!movie) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: '#a0a0b0' }}>Không tìm thấy phim</p>
                <Link href="/" style={{ color: '#e50914', textDecoration: 'none' }}>← Về trang chủ</Link>
            </div>
        );
    }

    const currentGroup = movie.episodeGroups?.[activeGroup];

    const EpisodeGrid = ({ episodes, compact = false }: { episodes: Episode[]; compact?: boolean }) => (
        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${compact ? '52px' : '62px'}, 1fr))`,
            gap: '6px',
        }}>
            {episodes.map((ep) => {
                const isActive = activeEp?.slug === ep.slug;
                return (
                    <button
                        key={ep.slug}
                        onClick={() => handleSelectEp(ep)}
                        title={ep.name}
                        style={{
                            padding: '7px 4px',
                            borderRadius: '6px',
                            border: '1px solid',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 500,
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            background: isActive ? 'rgba(229,9,20,0.25)' : 'rgba(255,255,255,0.04)',
                            borderColor: isActive ? 'rgba(229,9,20,0.6)' : 'rgba(255,255,255,0.08)',
                            color: isActive ? '#fff' : '#a0a0b0',
                            transition: 'all 0.15s',
                        }}
                    >
                        {ep.name}
                    </button>
                );
            })}
        </div>
    );

    return (
        // overflow-x: hidden quan trọng — tránh sidebar tràn viewport
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '12px' : '20px 24px', overflowX: 'hidden' }}>

            {/* Back */}
            <Link
                href={`/movie/${movie.slug}?source=${movie.source}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#a0a0b0', textDecoration: 'none', fontSize: '13px', marginBottom: '14px' }}
            >
                <ChevronLeft size={16} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? '180px' : '500px' }}>
                    {movie.title}
                </span>
            </Link>

            {/* Layout: player left, sidebar right on desktop */}
            <div style={{
                display: 'grid',
                // Desktop: player + sidebar. Mobile: chỉ player
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 280px',
                gap: '16px',
                alignItems: 'start',
                minWidth: 0, // Quan trọng để grid không overflow
            }}>

                {/* ===== LEFT: Player + Controls ===== */}
                <div style={{ minWidth: 0 }}>
                    {/* Player */}
                    <div style={{
                        position: 'relative',
                        paddingTop: '56.25%',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        background: '#000',
                        marginBottom: '14px',
                    }}>
                        {embedUrl ? (
                            <iframe
                                src={embedUrl}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                allowFullScreen
                                allow="autoplay; fullscreen"
                                title={`${movie.title} - ${activeEp?.name ?? ''}`}
                            />
                        ) : (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', flexDirection: 'column', gap: '10px', color: '#606070' }}>
                                <span style={{ fontSize: '36px' }}>🎬</span>
                                <p style={{ fontSize: '13px' }}>Chọn tập để xem</p>
                            </div>
                        )}
                    </div>

                    {/* Movie title + episode */}
                    <div style={{ marginBottom: '14px' }}>
                        <h1 style={{ color: 'white', fontSize: isMobile ? '15px' : '18px', fontWeight: 700, marginBottom: '4px', lineHeight: 1.3 }}>
                            {movie.title}
                        </h1>
                        {activeEp && (
                            <p style={{ color: '#a0a0b0', fontSize: '12px' }}>
                                Đang xem: <span style={{ color: '#e50914', fontWeight: 600 }}>{activeEp.name}</span>
                            </p>
                        )}
                    </div>

                    {/* Server selector */}
                    {movie.episodeGroups && movie.episodeGroups.length > 1 && (
                        <div style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                <Server size={13} color="#606070" />
                                <span style={{ color: '#606070', fontSize: '12px', fontWeight: 600 }}>Server:</span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {movie.episodeGroups.map((g, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setActiveGroup(i); setServer(i); }}
                                        style={{
                                            padding: '5px 12px', borderRadius: '6px', border: '1px solid',
                                            cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                                            background: activeGroup === i ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.06)',
                                            borderColor: activeGroup === i ? 'rgba(229,9,20,0.5)' : 'rgba(255,255,255,0.1)',
                                            color: activeGroup === i ? '#fff' : '#a0a0b0',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {g.serverName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mobile episode list — collapsible */}
                    {isMobile && currentGroup && currentGroup.episodes.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <button
                                onClick={() => setShowEpList(!showEpList)}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '10px 14px', background: '#111118', borderRadius: showEpList ? '8px 8px 0 0' : '8px',
                                    border: '1px solid rgba(255,255,255,0.08)', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                                }}
                            >
                                <span>Danh sách tập ({currentGroup.episodes.length})</span>
                                {showEpList ? <ChevronUp size={14} color="#a0a0b0" /> : <ChevronDown size={14} color="#a0a0b0" />}
                            </button>
                            {showEpList && (
                                <div style={{
                                    background: '#111118', borderRadius: '0 0 8px 8px',
                                    border: '1px solid rgba(255,255,255,0.08)', borderTop: 'none',
                                    padding: '12px',
                                    maxHeight: '220px', overflowY: 'auto',
                                    overflowX: 'hidden', // Ngăn tràn ngang
                                }}>
                                    <EpisodeGrid episodes={currentGroup.episodes} compact />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Related movies */}
                    {related && related.length > 0 && (
                        <div style={{ marginTop: '24px' }}>
                            <MovieRow title="Phim liên quan" movies={related} />
                        </div>
                    )}
                </div>

                {/* ===== RIGHT: Desktop sidebar ===== */}
                {!isMobile && currentGroup && currentGroup.episodes.length > 0 && (
                    <div style={{
                        position: 'sticky', top: '76px',
                        minWidth: 0, // Quan trọng!
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            background: '#111118',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            overflow: 'hidden',
                        }}>
                            {/* Header */}
                            <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h3 style={{ color: 'white', fontSize: '13px', fontWeight: 700 }}>
                                    Danh sách tập
                                </h3>
                                <span style={{ color: '#606070', fontSize: '11px' }}>({currentGroup.episodes.length})</span>
                            </div>

                            {/* Episode grid */}
                            <div style={{
                                maxHeight: '62vh', overflowY: 'auto', overflowX: 'hidden',
                                padding: '10px',
                            }} className="hide-scrollbar">
                                <EpisodeGrid episodes={currentGroup.episodes} compact />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
