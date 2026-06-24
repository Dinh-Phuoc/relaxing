'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { NormalizedMovie } from '~/types/movie';
import MovieCard from './MovieCard';

interface MovieRowProps {
    title: string;
    movies?: NormalizedMovie[];
    isLoading?: boolean;
    viewAllHref?: string;
    accentColor?: string;
}

function RowSkeleton() {
    return (
        <div style={{ display: 'flex', gap: '10px', overflowX: 'hidden' }}>
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} style={{ flexShrink: 0, width: '140px' }}>
                    <div style={{
                        aspectRatio: '2/3', borderRadius: '8px',
                        background: 'linear-gradient(90deg, #1a1a2e 0%, #252535 50%, #1a1a2e 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        marginBottom: '8px',
                    }} />
                    <div style={{ height: '12px', borderRadius: '4px', background: '#1a1a2e', width: '80%' }} />
                    <style>{`@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }`}</style>
                </div>
            ))}
        </div>
    );
}

export default function MovieRow({ title, movies, isLoading, viewAllHref, accentColor = '#e50914' }: MovieRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const amount = scrollRef.current.clientWidth * 0.75;
        scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    };

    return (
        <section style={{ marginBottom: '32px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingRight: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '3px', height: '18px', background: accentColor, borderRadius: '2px', flexShrink: 0 }} />
                    <h2 style={{ color: 'white', fontSize: 'clamp(14px, 2vw, 18px)', fontWeight: 700, lineHeight: 1 }}>{title}</h2>
                </div>
                {viewAllHref && (
                    <Link
                        href={viewAllHref}
                        style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#606070', textDecoration: 'none', fontSize: '12px', flexShrink: 0, transition: 'color 0.2s', whiteSpace: 'nowrap' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#e50914')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#606070')}
                    >
                        Xem tất cả <ChevronRight size={14} />
                    </Link>
                )}
            </div>

            {/* Scroll container */}
            <div style={{ position: 'relative' }}>
                {/* Left arrow */}
                <button
                    onClick={() => scroll('left')}
                    style={{
                        position: 'absolute', left: '-12px', top: '35%', transform: 'translateY(-50%)',
                        width: '28px', height: '28px', borderRadius: '50%', zIndex: 10,
                        background: 'rgba(20,20,30,0.9)', border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s', flexShrink: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,9,20,0.8)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(20,20,30,0.9)')}
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Scrollable row */}
                <div
                    ref={scrollRef}
                    style={{
                    display: 'flex',
                    gap: '10px',
                    overflowX: 'auto',
                    paddingBottom: '8px',
                    paddingLeft: '2px',
                    paddingRight: '2px',
                }}
                className="hide-scrollbar"
                >
                    <style>{`.scroll-row::-webkit-scrollbar { display: none; }`}</style>

                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} style={{ flexShrink: 0, width: 'clamp(120px, 13vw, 170px)' }}>
                                <div style={{ aspectRatio: '2/3', borderRadius: '8px', background: '#1a1a2e', marginBottom: '8px', animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, #1a1a2e 0%, #252535 50%, #1a1a2e 100%)' }} />
                                <div style={{ height: '10px', borderRadius: '3px', background: '#1a1a2e', width: '70%' }} />
                            </div>
                        ))
                    ) : (
                        (movies ?? []).slice(0, 20).map((movie) => (
                            <div key={movie.id} style={{ flexShrink: 0, width: 'clamp(120px, 13vw, 170px)' }}>
                                <MovieCard movie={movie} />
                            </div>
                        ))
                    )}
                </div>

                {/* Right arrow */}
                <button
                    onClick={() => scroll('right')}
                    style={{
                        position: 'absolute', right: '-12px', top: '35%', transform: 'translateY(-50%)',
                        width: '28px', height: '28px', borderRadius: '50%', zIndex: 10,
                        background: 'rgba(20,20,30,0.9)', border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,9,20,0.8)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(20,20,30,0.9)')}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </section>
    );
}
