'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '~/lib/axios/client';
import { PaginatedMovies, NormalizedMovie, NormalizedMovieDetail, SearchParams } from '~/types/movie';

export const MOVIE_KEYS = {
    featured: ['movies', 'featured'] as const,
    latest: (page: number) => ['movies', 'latest', page] as const,
    trending: (page: number) => ['movies', 'trending', page] as const,
    anime: (page: number) => ['movies', 'anime', page] as const,
    tvSeries: (page: number) => ['movies', 'tv-series', page] as const,
    byGenre: (genre: string, page: number) => ['movies', 'genre', genre, page] as const,
    byCountry: (country: string, page: number) => ['movies', 'country', country, page] as const,
    detail: (slug: string, source?: string) => ['movies', 'detail', slug, source] as const,
    related: (slug: string) => ['movies', 'related', slug] as const,
    search: (params: SearchParams) => ['movies', 'search', params] as const,
};

async function fetchMovies(url: string): Promise<PaginatedMovies> {
    const { data } = await apiClient.get(url);
    return data.data;
}

export function useFeaturedMovies() {
    return useQuery({
        queryKey: MOVIE_KEYS.featured,
        queryFn: async () => {
            const { data } = await apiClient.get('/movies/featured');
            return data.data as NormalizedMovie[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useLatestMovies(page = 1) {
    return useQuery({
        queryKey: MOVIE_KEYS.latest(page),
        queryFn: () => fetchMovies(`/movies/latest?page=${page}&limit=24`),
        staleTime: 2 * 60 * 1000,
    });
}

export function useTrendingMovies(page = 1) {
    return useQuery({
        queryKey: MOVIE_KEYS.trending(page),
        queryFn: () => fetchMovies(`/movies/trending?page=${page}&limit=24`),
        staleTime: 5 * 60 * 1000,
    });
}

export function useAnimeMovies(page = 1) {
    return useQuery({
        queryKey: MOVIE_KEYS.anime(page),
        queryFn: () => fetchMovies(`/movies/anime?page=${page}&limit=24`),
        staleTime: 5 * 60 * 1000,
    });
}

export function useTvSeries(page = 1) {
    return useQuery({
        queryKey: MOVIE_KEYS.tvSeries(page),
        queryFn: () => fetchMovies(`/movies/tv-series?page=${page}&limit=24`),
        staleTime: 5 * 60 * 1000,
    });
}

export function useMoviesByGenre(genre: string, page = 1) {
    return useQuery({
        queryKey: MOVIE_KEYS.byGenre(genre, page),
        queryFn: () => fetchMovies(`/movies/by-genre?genre=${genre}&page=${page}&limit=24`),
        staleTime: 5 * 60 * 1000,
    });
}

export function useMoviesByCountry(country: string, page = 1) {
    return useQuery({
        queryKey: MOVIE_KEYS.byCountry(country, page),
        queryFn: () => fetchMovies(`/movies/by-country?country=${country}&page=${page}&limit=24`),
        staleTime: 5 * 60 * 1000,
    });
}

export function useMovieDetail(slug: string, source?: string) {
    return useQuery({
        queryKey: MOVIE_KEYS.detail(slug, source),
        queryFn: async () => {
            const url = `/movies/${slug}${source ? `?source=${source}` : ''}`;
            const { data } = await apiClient.get(url);
            return data.data as NormalizedMovieDetail;
        },
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
    });
}

export function useRelatedMovies(slug: string) {
    return useQuery({
        queryKey: MOVIE_KEYS.related(slug),
        queryFn: async () => {
            const { data } = await apiClient.get(`/movies/related?slug=${slug}&limit=12`);
            return data.data as NormalizedMovie[];
        },
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
    });
}

export function useMovieSearch(params: SearchParams) {
    return useQuery({
        queryKey: MOVIE_KEYS.search(params),
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([k, v]) => {
                if (v !== undefined && v !== '') searchParams.set(k, String(v));
            });
            const { data } = await apiClient.get(`/movies/search?${searchParams}`);
            return data.data as PaginatedMovies;
        },
        enabled: !!(params.q || params.genre || params.country || params.year || params.type),
        staleTime: 2 * 60 * 1000,
    });
}
