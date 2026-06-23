'use client';

import React from 'react';
import HeroCarousel from '~/components/movie/HeroCarousel';
import MovieSection from '~/components/movie/MovieSection';
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
    const { data: action, isLoading: actionLoading } = useMoviesByGenre('hanh-dong', 1);

    return (
        <div>
            {/* Hero Section */}
            {featuredLoading ? (
                <div style={{ height: 'min(85vh, 700px)', background: 'linear-gradient(135deg, #0a0a0f, #1a1a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '48px', height: '48px', border: '3px solid rgba(229,9,20,0.3)', borderTopColor: '#e50914', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
            ) : featured?.length ? (
                <HeroCarousel movies={featured} />
            ) : null}

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 24px 0' }}>
                <MovieSection title="Phim mới cập nhật" movies={latest?.items} isLoading={latestLoading} viewAllHref="/search?type=movie" accentColor="#e50914" />
                <MovieSection title="Phim thịnh hành" movies={trending?.items} isLoading={trendingLoading} viewAllHref="/search" accentColor="#f5c518" />
                <MovieSection title="Phim bộ / TV Series" movies={tvSeries?.items} isLoading={tvLoading} viewAllHref="/search?type=series" accentColor="#8b5cf6" />
                <MovieSection title="Anime" movies={anime?.items} isLoading={animeLoading} viewAllHref="/search?type=anime" accentColor="#06b6d4" />
                <MovieSection title="Phim Hàn Quốc" movies={korean?.items} isLoading={koreanLoading} viewAllHref="/search?country=han-quoc" accentColor="#ec4899" />
                <MovieSection title="Phim Hành Động" movies={action?.items} isLoading={actionLoading} viewAllHref="/search?genre=hanh-dong" accentColor="#f97316" />
            </div>
        </div>
    );
}
