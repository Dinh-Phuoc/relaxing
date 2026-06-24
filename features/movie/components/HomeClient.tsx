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
import { LoadingSpinner } from '~/styles/components/layout.styles';
import { HeroLoadingPlaceholder, HomeSectionsContainer } from '~/styles/components/hero.styles';

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
            {featuredLoading ? (
                <HeroLoadingPlaceholder>
                    <LoadingSpinner $size={40} />
                </HeroLoadingPlaceholder>
            ) : featured?.length ? (
                <HeroCarousel movies={featured} />
            ) : null}

            <HomeSectionsContainer>
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
            </HomeSectionsContainer>
        </div>
    );
}
