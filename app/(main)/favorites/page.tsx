'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '~/stores/auth.store';
import apiClient from '~/lib/axios/client';
import MovieGrid from '~/components/movie/MovieGrid';
import { NormalizedMovie } from '~/types/movie';

interface FavoriteItem {
    movieId: string;
    slug: string;
    source: string;
    title: string;
    poster: string;
    year?: number;
}

export default function FavoritesPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => { if (!isAuthenticated) router.push('/login'); }, [isAuthenticated, router]);

    const { data, isLoading } = useQuery({
        queryKey: ['favorites'],
        queryFn: async () => {
            const { data } = await apiClient.get('/favorites');
            return data.data as FavoriteItem[];
        },
        enabled: isAuthenticated,
    });

    const movies: NormalizedMovie[] = (data ?? []).map((f) => ({
        id: f.movieId, slug: f.slug,
        source: f.source as 'ophim' | 'kkphim',
        title: f.title, poster: f.poster, year: f.year,
    }));

    if (!isAuthenticated) return null;

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <Heart size={24} color="#e50914" />
                <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>Phim yêu thích</h1>
            </div>

            {!isLoading && !movies.length ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <Heart size={48} color="#3a3a4a" style={{ margin: '0 auto 16px' }} />
                    <p style={{ color: '#606070', fontSize: '16px', marginBottom: '16px' }}>Chưa có phim yêu thích</p>
                    <Link href="/" style={{ color: '#e50914', textDecoration: 'none' }}>Khám phá phim →</Link>
                </div>
            ) : (
                <MovieGrid movies={movies} isLoading={isLoading} />
            )}
        </div>
    );
}
