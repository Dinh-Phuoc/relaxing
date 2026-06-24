'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { NormalizedMovie } from '~/types/movie';

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
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#0a0a0f' }}>
            {/* Backdrop image */}
            <div style={{
                position: 'absolute', inset: 0,
                opacity: fading ? 0 : 1,
                transition: 'opacity 0.3s ease',
                zIndex: 0,
            }}>
                <Image
                    src={movie.backdrop || movie.poster || movie.thumb || '/placeholder.jpg'}
                    alt={movie.title}
                    fill
                    priority
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    sizes="100vw"
                />
                {/* Gradient overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to right, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.7) 50%, rgba(10,10,15,0.2) 100%), linear-gradient(to top, rgba(10,10,15,1) 0%, rgba(10,10,15,0.3) 40%, transparent 70%)',
                }} />
            </div>

            {/* Content — flexbox column, không dùng absolute */}
            <div style={{
                position: 'relative', zIndex: 1,
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                minHeight: 'clamp(320px, 56vw, 620px)',
                padding: 'clamp(60px, 8vw, 90px) clamp(16px, 3vw, 40px) 0',
                maxWidth: '1400px', margin: '0 auto',
            }}>
                <div style={{
                    maxWidth: 'min(540px, 90vw)',
                    opacity: fading ? 0 : 1,
                    transform: fading ? 'translateY(8px)' : 'translateY(0)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    paddingBottom: 'clamp(48px, 8vw, 72px)',
                }}>
                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        {movie.quality && (
                            <span style={{ background: '#e50914', color: 'white', padding: '3px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 700 }}>
                                {movie.quality}
                            </span>
                        )}
                        {movie.genres?.slice(0, 2).map((g) => (
                            <span key={g} style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', padding: '3px 8px', borderRadius: '5px', fontSize: '11px', backdropFilter: 'blur(4px)' }}>
                                {g}
                            </span>
                        ))}
                        {movie.year && (
                            <span style={{ background: 'rgba(255,255,255,0.08)', color: '#a0a0b0', padding: '3px 8px', borderRadius: '5px', fontSize: '11px' }}>
                                {movie.year}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 style={{
                        color: 'white',
                        fontSize: 'clamp(18px, 4.5vw, 44px)',
                        fontWeight: 800, lineHeight: 1.15, marginBottom: '6px',
                        textShadow: '0 2px 16px rgba(0,0,0,0.6)',
                    }}>
                        {movie.title}
                    </h1>

                    {movie.originalTitle && movie.originalTitle !== movie.title && (
                        <p style={{ color: '#a0a0b0', fontSize: 'clamp(12px, 1.8vw, 15px)', marginBottom: '10px' }}>
                            {movie.originalTitle}
                        </p>
                    )}

                    {/* Description — hidden on small screens */}
                    {movie.description && (
                        <p style={{
                            color: '#c0c0d0', fontSize: '13px', lineHeight: '1.7', marginBottom: '20px',
                            overflow: 'hidden', display: '-webkit-box',
                            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                        }}
                            className="hero-desc"
                        >
                            {movie.description.replace(/<[^>]*>/g, '')}
                        </p>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <Link
                            href={`/watch/${movie.slug}?source=${movie.source}`}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '7px',
                                padding: 'clamp(9px, 1.5vw, 13px) clamp(16px, 2.5vw, 24px)',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #e50914, #b20710)',
                                color: 'white', textDecoration: 'none', fontWeight: 700,
                                fontSize: 'clamp(13px, 1.8vw, 15px)',
                                boxShadow: '0 4px 16px rgba(229,9,20,0.4)',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <Play size={16} fill="white" /> Xem ngay
                        </Link>
                        <Link
                            href={`/movie/${movie.slug}?source=${movie.source}`}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '7px',
                                padding: 'clamp(9px, 1.5vw, 13px) clamp(14px, 2vw, 20px)',
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: 'white', textDecoration: 'none', fontWeight: 600,
                                fontSize: 'clamp(13px, 1.8vw, 15px)',
                                backdropFilter: 'blur(8px)',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <Info size={15} /> Chi tiết
                        </Link>
                    </div>
                </div>
            </div>

            {/* Dots — NGOÀI content div, ở cuối cùng */}
            {movies.length > 1 && (
                <div style={{
                    position: 'relative', zIndex: 2,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    gap: '6px', padding: '12px 16px 16px',
                    background: 'linear-gradient(to bottom, transparent, rgba(10,10,15,0.8))',
                }}>
                    {movies.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            style={{
                                width: i === current ? '20px' : '6px',
                                height: '6px',
                                borderRadius: '3px',
                                border: 'none', cursor: 'pointer', padding: 0,
                                background: i === current ? '#e50914' : 'rgba(255,255,255,0.3)',
                                transition: 'all 0.3s ease',
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Arrow buttons */}
            {movies.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        style={{
                            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-60%)',
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)',
                            color: 'white', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 3, transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,9,20,0.6)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={next}
                        style={{
                            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-60%)',
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)',
                            color: 'white', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 3, transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,9,20,0.6)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}
                    >
                        <ChevronRight size={18} />
                    </button>
                </>
            )}
        </div>
    );
}
