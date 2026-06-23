'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { NormalizedMovie } from '~/types/movie';
import MovieCard from './MovieCard';
import { MovieGridSkeleton } from './MovieSkeleton';

interface MovieSectionProps {
    title: string;
    movies?: NormalizedMovie[];
    isLoading?: boolean;
    viewAllHref?: string;
    accentColor?: string;
}

export default function MovieSection({ title, movies, isLoading, viewAllHref, accentColor = '#e50914' }: MovieSectionProps) {
    return (
        <section style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '4px', height: '24px', background: accentColor, borderRadius: '2px' }} />
                    <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 700 }}>{title}</h2>
                </div>
                {viewAllHref && (
                    <Link
                        href={viewAllHref}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a0a0b0', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#a0a0b0')}
                    >
                        Xem tất cả <ChevronRight size={16} />
                    </Link>
                )}
            </div>

            {isLoading ? (
                <MovieGridSkeleton count={8} />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
                    {(movies ?? []).slice(0, 12).map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </section>
    );
}
