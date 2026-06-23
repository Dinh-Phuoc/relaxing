'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Heart, Share2, Star, Clock, Calendar, Globe, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useMovieDetail, useRelatedMovies } from '~/hooks/useMovies';
import MovieSection from '~/components/movie/MovieSection';
import { useAuthStore } from '~/stores/auth.store';
import apiClient from '~/lib/axios/client';

interface Props {
    slug: string;
    source?: string;
}

export default function MovieDetailClient({ slug, source }: Props) {
    const { data: movie, isLoading, error } = useMovieDetail(slug, source);
    const { data: related } = useRelatedMovies(slug);
    const { isAuthenticated } = useAuthStore();
    const [isFavorited, setIsFavorited] = useState(false);
    const [showFullDesc, setShowFullDesc] = useState(false);

    const handleFavorite = async () => {
        if (!isAuthenticated || !movie) return;
        try {
            if (isFavorited) {
                await apiClient.delete(`/favorites/${encodeURIComponent(movie.id)}`);
            } else {
                await apiClient.post('/favorites', {
                    movieId: movie.id, slug: movie.slug, source: movie.source,
                    title: movie.title, poster: movie.poster, year: movie.year,
                });
            }
            setIsFavorited(!isFavorited);
        } catch (e) {
            console.error(e);
        }
    };

    const handleShare = () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({ title: movie?.title, url: window.location.href });
        } else {
            navigator.clipboard?.writeText(window.location.href);
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

    if (error || !movie) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: '#a0a0b0', fontSize: '18px' }}>Không tìm thấy phim</p>
                <Link href="/" style={{ color: '#e50914', textDecoration: 'none' }}>← Về trang chủ</Link>
            </div>
        );
    }

    const description = movie.description?.replace(/<[^>]*>/g, '') ?? '';

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Backdrop */}
            <div style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
                <Image
                    src={movie.backdrop || movie.poster}
                    alt={movie.title}
                    fill
                    priority
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    sizes="100vw"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.7) 50%, rgba(10,10,15,1) 100%)' }} />
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '32px', marginTop: '-200px', position: 'relative', zIndex: 10, alignItems: 'start' }}>
                    {/* Poster */}
                    <div>
                        <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', border: '2px solid rgba(255,255,255,0.1)', aspectRatio: '2/3', position: 'relative' }}>
                            <Image src={movie.poster} alt={movie.title} fill style={{ objectFit: 'cover' }} sizes="200px" />
                        </div>
                    </div>

                    {/* Info */}
                    <div style={{ paddingTop: '160px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            {movie.genres?.slice(0, 4).map((g) => (
                                <Link key={g} href={`/search?genre=${encodeURIComponent(g)}`} style={{ background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.3)', color: '#e57080', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', textDecoration: 'none' }}>
                                    {g}
                                </Link>
                            ))}
                        </div>

                        <h1 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, lineHeight: 1.2, marginBottom: '8px' }}>
                            {movie.title}
                        </h1>

                        {movie.originalTitle && movie.originalTitle !== movie.title && (
                            <p style={{ color: '#a0a0b0', fontSize: '16px', marginBottom: '16px' }}>{movie.originalTitle}</p>
                        )}

                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                            {movie.year && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a0a0b0', fontSize: '14px' }}><Calendar size={14} /> {movie.year}</span>}
                            {movie.duration && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a0a0b0', fontSize: '14px' }}><Clock size={14} /> {movie.duration}</span>}
                            {movie.rating && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f5c518', fontSize: '14px' }}><Star size={14} fill="#f5c518" /> {movie.rating.toFixed(1)}</span>}
                            {movie.countries?.length ? <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a0a0b0', fontSize: '14px' }}><Globe size={14} /> {movie.countries.join(', ')}</span> : null}
                            {movie.quality && <span style={{ background: '#e50914', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>{movie.quality}</span>}
                            {movie.status && <span style={{ background: movie.status === 'completed' ? 'rgba(34,197,94,0.2)' : 'rgba(249,115,22,0.2)', color: movie.status === 'completed' ? '#22c55e' : '#f97316', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{movie.status === 'completed' ? 'Hoàn thành' : 'Đang chiếu'}</span>}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                            <Link href={`/watch/${movie.slug}?source=${movie.source}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '10px', background: 'linear-gradient(135deg, #e50914, #b20710)', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '15px', boxShadow: '0 4px 20px rgba(229,9,20,0.4)' }}>
                                <Play size={18} fill="white" /> Xem phim
                            </Link>
                            <button onClick={handleFavorite} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 20px', borderRadius: '10px', background: isFavorited ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.08)', border: `1px solid ${isFavorited ? 'rgba(229,9,20,0.5)' : 'rgba(255,255,255,0.15)'}`, color: isFavorited ? '#e50914' : 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                                <Heart size={18} fill={isFavorited ? '#e50914' : 'none'} /> {isFavorited ? 'Đã lưu' : 'Yêu thích'}
                            </button>
                            <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                                <Share2 size={18} /> Chia sẻ
                            </button>
                        </div>

                        {description && (
                            <div style={{ marginBottom: '24px' }}>
                                <p style={{
                                    color: '#c0c0d0', fontSize: '14px', lineHeight: '1.8',
                                    overflow: showFullDesc ? 'visible' : 'hidden',
                                    display: showFullDesc ? 'block' : '-webkit-box',
                                    WebkitLineClamp: showFullDesc ? undefined : 4,
                                    WebkitBoxOrient: 'vertical' as const,
                                }}>
                                    {description}
                                </p>
                                {description.length > 300 && (
                                    <button onClick={() => setShowFullDesc(!showFullDesc)} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#e50914', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', marginTop: '8px' }}>
                                        {showFullDesc ? <><ChevronUp size={14} /> Thu gọn</> : <><ChevronDown size={14} /> Xem thêm</>}
                                    </button>
                                )}
                            </div>
                        )}

                        {movie.actors?.length ? (
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <Users size={16} color="#a0a0b0" />
                                    <span style={{ color: '#a0a0b0', fontSize: '13px', fontWeight: 600 }}>Diễn viên</span>
                                </div>
                                <p style={{ color: '#c0c0d0', fontSize: '13px' }}>{movie.actors.slice(0, 10).join(', ')}</p>
                            </div>
                        ) : null}

                        {movie.directors?.length ? (
                            <div style={{ marginBottom: '16px' }}>
                                <span style={{ color: '#a0a0b0', fontSize: '13px', fontWeight: 600 }}>Đạo diễn: </span>
                                <span style={{ color: '#c0c0d0', fontSize: '13px' }}>{movie.directors.join(', ')}</span>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Episodes */}
                {movie.episodeGroups && movie.episodeGroups.length > 0 && (
                    <div style={{ marginTop: '48px' }}>
                        <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '4px', height: '24px', background: '#e50914', borderRadius: '2px' }} />
                            Danh sách tập
                        </h2>
                        {movie.episodeGroups.map((group) => (
                            <div key={group.serverIndex} style={{ marginBottom: '24px' }}>
                                <h3 style={{ color: '#a0a0b0', fontSize: '14px', marginBottom: '12px' }}>{group.serverName}</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {group.episodes.slice(0, 50).map((ep) => (
                                        <Link
                                            key={ep.slug}
                                            href={`/watch/${movie.slug}?source=${movie.source}&ep=${ep.slug}&server=${group.serverIndex}`}
                                            style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#c0c0d0', textDecoration: 'none', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s', minWidth: '60px', textAlign: 'center' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(229,9,20,0.2)'; e.currentTarget.style.borderColor = 'rgba(229,9,20,0.4)'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#c0c0d0'; }}
                                        >
                                            {ep.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {related && related.length > 0 && (
                    <div style={{ marginTop: '48px' }}>
                        <MovieSection title="Phim liên quan" movies={related} viewAllHref={`/search?genre=${movie.genres?.[0] ?? ''}`} />
                    </div>
                )}
            </div>
        </div>
    );
}
