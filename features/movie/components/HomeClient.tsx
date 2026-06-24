'use client';

import React from 'react';
import HeroCarousel from '~/components/movie/HeroCarousel';
import MovieRow from '~/components/movie/MovieRow';
import {
    useFeaturedMovies,
    useLatestMovies,
    useTrendingMovies,
    useAnimeMovies,
    useTvSeries,
    useMoviesByCountry,
    useMoviesByGenre,
} from '~/hooks/useMovies';

export default function HomeClient() {
    const { data: featured, isLoading: featuredLoading } = useFeaturedMovies();
    const { data: latest, isLoading: latestLoading } = useLatestMovies(1);
    const { data: trending, isLoading: trendingLoading } = useTrendingMovies(1);
    const { data: anime, isLoading: animeLoading } = useAnimeMovies(1);
    const { data: tvSeries, isLoading: tvLoading } = useTvSeries(1);
    const { data: korean, isLoading: koreanLoading } = useMoviesByCountry('han-quoc', 1);
    const { data: chinese, isLoading: chineseLoading } = useMoviesByCountry('trung-quoc', 1);
    const { data: action, isLoading: actionLoading } = useMoviesByGenre('hanh-dong', 1);

    return (
        <div>
            {/* Hero */}
            {featuredLoading ? (
                <div style={{ height: 'clamp(280px, 55vw, 600px)', background: 'linear-gradient(135deg, #0a0a0f, #1a1a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(229,9,20,0.3)', borderTopColor: '#e50914', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
            ) : featured?.length ? (
                <HeroCarousel movies={featured} />
            ) : null}

            {/* Sections */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px) 0' }}>
                <MovieRow
                    title="Phim mới cập nhật"
                    movies={latest?.items}
                    isLoading={latestLoading}
                    viewAllHref="/search"
                    accentColor="#e50914"
                />
                <MovieRow
                    title="Phim thịnh hành"
                    movies={trending?.items}
                    isLoading={trendingLoading}
                    viewAllHref="/search"
                    accentColor="#f5c518"
                />
                <MovieRow
                    title="Phim bộ / TV Series"
                    movies={tvSeries?.items}
                    isLoading={tvLoading}
                    viewAllHref="/search?type=series"
                    accentColor="#8b5cf6"
                />
                <MovieRow
                    title="Anime"
                    movies={anime?.items}
                    isLoading={animeLoading}
                    viewAllHref="/search?type=anime"
                    accentColor="#06b6d4"
                />
                <MovieRow
                    title="Phim Hàn Quốc"
                    movies={korean?.items}
                    isLoading={koreanLoading}
                    viewAllHref="/search?country=han-quoc"
                    accentColor="#ec4899"
                />
                <MovieRow
                    title="Phim Trung Quốc"
                    movies={chinese?.items}
                    isLoading={chineseLoading}
                    viewAllHref="/search?country=trung-quoc"
                    accentColor="#f97316"
                />
                <MovieRow
                    title="Phim Hành Động"
                    movies={action?.items}
                    isLoading={actionLoading}
                    viewAllHref="/search?genre=hanh-dong"
                    accentColor="#22c55e"
                />
            </div>
        </div>
    );
}
