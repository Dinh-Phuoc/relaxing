'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Heart, Star, Clock, Calendar, Globe, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useMovieDetail, useRelatedMovies } from '~/hooks/useMovies';
import { useResponsive } from '~/hooks/useResponsive';
import { useFavorites } from '~/hooks/useFavorites';
import MovieSection from '~/components/movie/MovieSection';

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
    const backdropHeight = isMobile ? '280px' : isTablet ? '380px' : '480px';

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Backdrop */}
            <div style={{ position: 'relative', height: backdropHeight, overflow: 'hidden' }}>
                <Image
                    src={movie.backdrop || movie.poster}
                    alt={movie.title}
                    fill
                    priority
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    sizes="100vw"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.6) 50%, rgba(10,10,15,1) 100%)' }} />
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px' }}>
                {/* Hero info */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isSingleColumn ? '1fr' : '200px 1fr',
                    gap: '32px',
                    marginTop: isSingleColumn ? '-80px' : '-180px',
                    position: 'relative', zIndex: 10,
                    alignItems: 'start',
                }}>
                    {/* Poster — desktop only */}
                    {!isSingleColumn && (
                        <div style={{ width: '200px', flexShrink: 0 }}>
                            <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', border: '2px solid rgba(255,255,255,0.1)', aspectRatio: '2/3', position: 'relative' }}>
                                <Image src={movie.poster} alt={movie.title} fill style={{ objectFit: 'cover' }} sizes="200px" />
                            </div>
                        </div>
                    )}

                    {/* Info */}
                    <div style={{ paddingTop: isSingleColumn ? '0' : '120px' }}>
                        {/* Genres */}
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                            {movie.genres?.slice(0, 3).map((g) => (
                                <Link key={g} href={`/search?genre=${encodeURIComponent(g)}`}
                                    style={{ background: 'rgba(229,9,20,0.12)', border: '1px solid rgba(229,9,20,0.25)', color: '#e57080', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', textDecoration: 'none' }}>
                                    {g}
                                </Link>
                            ))}
                        </div>

                        <h1 style={{ color: 'white', fontSize: isMobile ? '22px' : isTablet ? '28px' : '36px', fontWeight: 800, lineHeight: 1.2, marginBottom: '6px' }}>
                            {movie.title}
                        </h1>

                        {movie.originalTitle && movie.originalTitle !== movie.title && (
                            <p style={{ color: '#a0a0b0', fontSize: isMobile ? '13px' : '15px', marginBottom: '12px' }}>
                                {movie.originalTitle}
                            </p>
                        )}

                        {/* Meta */}
                        <div style={{ display: 'flex', gap: isMobile ? '12px' : '20px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            {movie.year && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#a0a0b0', fontSize: '13px' }}><Calendar size={13} /> {movie.year}</span>}
                            {movie.duration && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#a0a0b0', fontSize: '13px' }}><Clock size={13} /> {movie.duration}</span>}
                            {movie.rating && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f5c518', fontSize: '13px' }}><Star size={13} fill="#f5c518" /> {movie.rating.toFixed(1)}</span>}
                            {movie.countries?.length ? <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#a0a0b0', fontSize: '13px' }}><Globe size={13} /> {movie.countries.join(', ')}</span> : null}
                            {movie.quality && <span style={{ background: '#e50914', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>{movie.quality}</span>}
                            {movie.status && (
                                <span style={{ background: movie.status === 'completed' ? 'rgba(34,197,94,0.15)' : 'rgba(249,115,22,0.15)', color: movie.status === 'completed' ? '#22c55e' : '#f97316', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                                    {movie.status === 'completed' ? 'Hoàn thành' : 'Đang chiếu'}
                                </span>
                            )}
                        </div>

                        {/* Actions — chỉ 2 button: Xem phim + Yêu thích */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
                            <Link
                                href={`/watch/${movie.slug}?source=${movie.source}`}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: isMobile ? '10px 20px' : '12px 24px',
                                    borderRadius: '10px', background: 'linear-gradient(135deg, #e50914, #b20710)',
                                    color: 'white', textDecoration: 'none', fontWeight: 700,
                                    fontSize: isMobile ? '14px' : '15px',
                                    boxShadow: '0 4px 20px rgba(229,9,20,0.4)',
                                }}
                            >
                                <Play size={16} fill="white" /> Xem phim
                            </Link>

                            <button
                                onClick={handleFavorite}
                                title={favorited ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
                                style={{
                                    width: 44, height: 44, borderRadius: '10px', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: favorited ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.08)',
                                    border: `1px solid ${favorited ? 'rgba(229,9,20,0.5)' : 'rgba(255,255,255,0.15)'}`,
                                    color: favorited ? '#e50914' : '#a0a0b0', cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <Heart size={18} fill={favorited ? '#e50914' : 'none'} />
                            </button>
                        </div>

                        {/* Description */}
                        {description && (
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{
                                    color: '#c0c0d0', fontSize: '13px', lineHeight: '1.8',
                                    overflow: showFullDesc ? 'visible' : 'hidden',
                                    display: showFullDesc ? 'block' : '-webkit-box',
                                    WebkitLineClamp: showFullDesc ? undefined : 3,
                                    WebkitBoxOrient: 'vertical' as const,
                                }}>
                                    {description}
                                </p>
                                {description.length > 200 && (
                                    <button onClick={() => setShowFullDesc(!showFullDesc)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#e50914', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', marginTop: '6px' }}>
                                        {showFullDesc ? <><ChevronUp size={13} /> Thu gọn</> : <><ChevronDown size={13} /> Xem thêm</>}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Cast */}
                        {movie.actors?.length ? (
                            <div style={{ marginBottom: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <span style={{ color: '#a0a0b0', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                    <Users size={12} /> Diễn viên:
                                </span>
                                <p style={{ color: '#c0c0d0', fontSize: '12px', margin: 0 }}>{movie.actors.slice(0, 8).join(', ')}</p>
                            </div>
                        ) : null}

                        {movie.directors?.length ? (
                            <div style={{ marginBottom: '10px' }}>
                                <span style={{ color: '#a0a0b0', fontSize: '12px', fontWeight: 600 }}>Đạo diễn: </span>
                                <span style={{ color: '#c0c0d0', fontSize: '12px' }}>{movie.directors.join(', ')}</span>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Episodes */}
                {movie.episodeGroups && movie.episodeGroups.length > 0 && (
                    <div style={{ marginTop: '40px' }}>
                        <h2 style={{ color: 'white', fontSize: isMobile ? '16px' : '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '4px', height: '22px', background: '#e50914', borderRadius: '2px' }} />
                            Danh sách tập
                        </h2>
                        {movie.episodeGroups.map((group) => {
                            const displayEps = showAllEps ? group.episodes : group.episodes.slice(0, 50);
                            return (
                                <div key={group.serverIndex} style={{ marginBottom: '20px' }}>
                                    {movie.episodeGroups!.length > 1 && (
                                        <h3 style={{ color: '#a0a0b0', fontSize: '13px', marginBottom: '10px', fontWeight: 600 }}>{group.serverName}</h3>
                                    )}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {displayEps.map((ep) => (
                                            <Link
                                                key={ep.slug}
                                                href={`/watch/${movie.slug}?source=${movie.source}&ep=${ep.slug}&server=${group.serverIndex}`}
                                                style={{
                                                    padding: isMobile ? '7px 12px' : '8px 16px', borderRadius: '7px',
                                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                                    color: '#c0c0d0', textDecoration: 'none', fontSize: '12px',
                                                    fontWeight: 500, minWidth: '52px', textAlign: 'center', transition: 'all 0.15s',
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(229,9,20,0.2)'; e.currentTarget.style.borderColor = 'rgba(229,9,20,0.4)'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#c0c0d0'; }}
                                            >
                                                {ep.name}
                                            </Link>
                                        ))}
                                        {group.episodes.length > 50 && (
                                            <button
                                                onClick={() => setShowAllEps(!showAllEps)}
                                                style={{ padding: '8px 16px', borderRadius: '7px', background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.3)', color: '#e50914', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                                            >
                                                {showAllEps ? '▲ Thu gọn' : `+${group.episodes.length - 50} tập nữa`}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Related */}
                {related && related.length > 0 && (
                    <div style={{ marginTop: '40px' }}>
                        <MovieSection title="Phim liên quan" movies={related} viewAllHref={`/search?genre=${movie.genres?.[0] ?? ''}`} />
                    </div>
                )}
            </div>
        </div>
    );
}
