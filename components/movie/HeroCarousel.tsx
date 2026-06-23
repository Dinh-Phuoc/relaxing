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
    const [isTransitioning, setIsTransitioning] = useState(false);

    const goTo = useCallback((index: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrent(index);
        setTimeout(() => setIsTransitioning(false), 500);
    }, [isTransitioning]);

    const next = useCallback(() => {
        goTo((current + 1) % movies.length);
    }, [current, movies.length, goTo]);

    const prev = useCallback(() => {
        goTo((current - 1 + movies.length) % movies.length);
    }, [current, movies.length, goTo]);

    useEffect(() => {
        if (movies.length <= 1) return;
        const timer = setInterval(next, 6000);
        return () => clearInterval(timer);
    }, [next, movies.length]);

    if (!movies.length) return null;

    const movie = movies[current];

    return (
        <div style={{ position: 'relative', height: 'min(85vh, 700px)', overflow: 'hidden', background: '#0a0a0f' }}>
            {/* Backdrop */}
            <div style={{ position: 'absolute', inset: 0, opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.5s ease' }}>
                <Image
                    src={movie.backdrop || movie.poster || movie.thumb || '/hero-placeholder.jpg'}
                    alt={movie.title}
                    fill
                    priority
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    sizes="100vw"
                />
            </div>

            {/* Gradient overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to right, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.7) 40%, rgba(10,10,15,0.2) 70%, transparent 100%), linear-gradient(to top, rgba(10,10,15,1) 0%, rgba(10,10,15,0.5) 30%, transparent 60%)',
            }} />

            {/* Content */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', padding: '80px 24px 120px', width: '100%', left: '50%', transform: 'translateX(-50%)' }}>
                <div style={{
                    maxWidth: '550px',
                    opacity: isTransitioning ? 0 : 1,
                    transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
                    transition: 'all 0.5s ease',
                }}>
                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        {movie.quality && (
                            <span style={{ background: '#e50914', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                                {movie.quality}
                            </span>
                        )}
                        {movie.genres?.slice(0, 2).map((g) => (
                            <span key={g} style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', backdropFilter: 'blur(4px)' }}>
                                {g}
                            </span>
                        ))}
                        {movie.year && (
                            <span style={{ background: 'rgba(255,255,255,0.08)', color: '#a0a0b0', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>
                                {movie.year}
                            </span>
                        )}
                    </div>

                    <h1 style={{
                        color: 'white', fontSize: 'clamp(28px, 5vw, 52px)',
                        fontWeight: 800, lineHeight: 1.1, marginBottom: '8px',
                        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                    }}>
                        {movie.title}
                    </h1>

                    {movie.originalTitle && movie.originalTitle !== movie.title && (
                        <p style={{ color: '#a0a0b0', fontSize: '16px', marginBottom: '16px' }}>{movie.originalTitle}</p>
                    )}

                    {movie.description && (
                        <p style={{
                            color: '#c0c0d0', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px',
                            overflow: 'hidden', display: '-webkit-box',
                            WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                        }}>
                            {movie.description.replace(/<[^>]*>/g, '')}
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Link
                            href={`/watch/${movie.slug}?source=${movie.source}`}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '14px 28px', borderRadius: '10px',
                                background: 'linear-gradient(135deg, #e50914, #b20710)',
                                color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '15px',
                                boxShadow: '0 4px 20px rgba(229,9,20,0.4)', transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            <Play size={18} fill="white" /> Xem ngay
                        </Link>
                        <Link
                            href={`/movie/${movie.slug}?source=${movie.source}`}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '14px 24px', borderRadius: '10px',
                                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                                color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '15px',
                                backdropFilter: 'blur(10px)', transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                        >
                            <Info size={18} /> Chi tiết
                        </Link>
                    </div>
                </div>
            </div>

            {/* Nav arrows */}
            {movies.length > 1 && (
                <>
                    <button onClick={prev} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', transition: 'all 0.2s', zIndex: 10 }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,9,20,0.5)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={next} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', transition: 'all 0.2s', zIndex: 10 }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,9,20,0.5)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}
                    >
                        <ChevronRight size={20} />
                    </button>
                </>
            )}

            {/* Dots */}
            {movies.length > 1 && (
                <div style={{ position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
                    {movies.map((_, i) => (
                        <button key={i} onClick={() => goTo(i)} style={{ width: i === current ? '24px' : '8px', height: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: i === current ? '#e50914' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s ease', padding: 0 }} />
                    ))}
                </div>
            )}

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to bottom, transparent, #0a0a0f)' }} />
        </div>
    );
}
