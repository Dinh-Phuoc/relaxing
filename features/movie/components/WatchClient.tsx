'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useMovieDetail, useRelatedMovies } from '~/hooks/useMovies';
import { usePlayerStore } from '~/stores/player.store';
import { useAuthStore } from '~/stores/auth.store';
import apiClient from '~/lib/axios/client';
import MovieSection from '~/components/movie/MovieSection';
import { Episode } from '~/types/movie';

interface Props {
    slug: string;
    source?: string;
    initialEp?: string;
    initialServer?: number;
}

export default function WatchClient({ slug, source, initialEp, initialServer = 0 }: Props) {
    const { data: movie, isLoading } = useMovieDetail(slug, source);
    const { data: related } = useRelatedMovies(slug);
    const { isAuthenticated } = useAuthStore();
    const { setEpisode, setServer } = usePlayerStore();

    const [activeGroup, setActiveGroup] = useState(initialServer);
    const [activeEp, setActiveEp] = useState<Episode | null>(null);
    const [embedUrl, setEmbedUrl] = useState('');

    useEffect(() => {
        if (!movie?.episodeGroups?.length) return;

        const group = movie.episodeGroups[activeGroup] ?? movie.episodeGroups[0];
        const ep = initialEp
            ? group.episodes.find((e) => e.slug === initialEp) ?? group.episodes[0]
            : group.episodes[0];

        if (ep) {
            setActiveEp(ep);
            setEpisode(ep.slug);
            setEmbedUrl(ep.servers[0]?.link ?? '');
        }
    }, [movie, activeGroup, initialEp, setEpisode]);

    const handleSelectEp = (ep: Episode) => {
        setActiveEp(ep);
        setEpisode(ep.slug);
        setEmbedUrl(ep.servers[0]?.link ?? '');

        if (isAuthenticated && movie) {
            apiClient.post('/watch-history', {
                movieId: movie.id, slug: movie.slug, source: movie.source,
                title: movie.title, poster: movie.poster,
                episodeSlug: ep.slug, episodeName: ep.name,
                serverIndex: activeGroup, progressSeconds: 0,
            }).catch(() => {});
        }
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

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
            <Link
                href={`/movie/${movie.slug}?source=${movie.source}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#a0a0b0', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#a0a0b0')}
            >
                <ChevronLeft size={18} /> {movie.title}
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
                {/* Player area */}
                <div>
                    {/* Video player */}
                    <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden', background: '#000', marginBottom: '20px' }}>
                        {embedUrl ? (
                            <iframe
                                src={embedUrl}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                allowFullScreen
                                allow="autoplay; fullscreen"
                                title={`${movie.title} - ${activeEp?.name ?? ''}`}
                            />
                        ) : (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#606070', flexDirection: 'column', gap: '12px' }}>
                                <span style={{ fontSize: '48px' }}>🎬</span>
                                <p>Chọn tập để xem</p>
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{movie.title}</h1>
                        {activeEp && <p style={{ color: '#a0a0b0', fontSize: '14px' }}>Tập: {activeEp.name}</p>}
                    </div>

                    {/* Server selector */}
                    {movie.episodeGroups && movie.episodeGroups.length > 1 && (
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ color: '#a0a0b0', fontSize: '13px', marginBottom: '10px', fontWeight: 600 }}>Chọn server:</p>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {movie.episodeGroups.map((g, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setActiveGroup(i); setServer(i); }}
                                        style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s', background: activeGroup === i ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.06)', borderColor: activeGroup === i ? 'rgba(229,9,20,0.5)' : 'rgba(255,255,255,0.1)', color: activeGroup === i ? '#fff' : '#a0a0b0' }}
                                    >
                                        {g.serverName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {related && related.length > 0 && (
                        <div style={{ marginTop: '32px' }}>
                            <MovieSection title="Phim liên quan" movies={related.slice(0, 6)} />
                        </div>
                    )}
                </div>

                {/* Episode sidebar */}
                <div>
                    {currentGroup && currentGroup.episodes.length > 0 && (
                        <div style={{ background: '#111118', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                            <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                <h3 style={{ color: 'white', fontSize: '15px', fontWeight: 600 }}>Danh sách tập ({currentGroup.episodes.length})</h3>
                            </div>
                            <div style={{ maxHeight: '600px', overflowY: 'auto', padding: '12px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '6px' }}>
                                    {currentGroup.episodes.map((ep) => {
                                        const isActive = activeEp?.slug === ep.slug;
                                        return (
                                            <button
                                                key={ep.slug}
                                                onClick={() => handleSelectEp(ep)}
                                                style={{
                                                    padding: '8px 4px', borderRadius: '6px', border: '1px solid', cursor: 'pointer',
                                                    fontSize: '12px', fontWeight: 500, transition: 'all 0.2s', textAlign: 'center',
                                                    background: isActive ? 'rgba(229,9,20,0.25)' : 'rgba(255,255,255,0.04)',
                                                    borderColor: isActive ? 'rgba(229,9,20,0.6)' : 'rgba(255,255,255,0.08)',
                                                    color: isActive ? '#fff' : '#a0a0b0',
                                                }}
                                                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; } }}
                                                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#a0a0b0'; } }}
                                            >
                                                {ep.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
