import axios from 'axios';
import { MovieProviderInterface } from './movie-provider.interface';
import {
    NormalizedMovie,
    NormalizedMovieDetail,
    PaginatedMovies,
    SearchParams,
    EpisodeGroup,
} from '~/types/movie';
import { makeMovieId } from '~/utils/normalize-movie';

const BASE_URL = process.env.KKPHIM_API_BASE_URL ?? 'https://phimapi.com';

interface KKMovie {
    _id: string;
    name: string;
    origin_name: string;
    slug: string;
    type: string;
    thumb_url: string;
    poster_url: string;
    year: number;
    episode_current: string;
    episode_total: string;
    quality: string;
    lang: string;
    status: string;
    category?: Array<{ id: string; name: string; slug: string }>;
    country?: Array<{ id: string; name: string; slug: string }>;
    time?: string;
    view?: number;
    content?: string;
    director?: string[];
    actor?: string[];
}

interface KKListResponse {
    status: boolean;
    items: KKMovie[];
    pagination: {
        totalItems: number;
        currentPage: number;
    };
}

interface KKDetailResponse {
    status: boolean;
    movie: KKMovie;
    episodes: Array<{
        server_name: string;
        server_data: Array<{
            slug: string;
            name: string;
            filename: string;
            link_embed: string;
            link_m3u8: string;
        }>;
    }>;
}

function resolveImage(url: string | undefined): string {
    if (!url) return '/placeholder-movie.jpg';
    if (url.startsWith('http')) return url;
    return `https://phimimg.com/${url}`;
}

function normalizeMovie(m: KKMovie): NormalizedMovie {
    return {
        id: makeMovieId('kkphim', m.slug),
        slug: m.slug,
        source: 'kkphim',
        title: m.name,
        originalTitle: m.origin_name,
        poster: resolveImage(m.poster_url),
        thumb: resolveImage(m.thumb_url),
        year: m.year,
        type: m.type === 'single' ? 'movie' : m.type === 'hoathinh' ? 'anime' : 'series',
        status: m.status === 'completed' ? 'completed' : 'ongoing',
        currentEpisode: m.episode_current,
        quality: m.quality,
        language: m.lang,
        duration: m.time,
        views: m.view,
        genres: m.category?.map((c) => c.name) ?? [],
        countries: m.country?.map((c) => c.name) ?? [],
        categories: m.category,
    };
}

export class KKPhimProvider implements MovieProviderInterface {
    readonly name = 'kkphim' as const;
    readonly priority = 2;

    private async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
        const { data } = await axios.get<T>(`${BASE_URL}${path}`, {
            params,
            timeout: 10000,
        });
        return data;
    }

    async getLatest(page = 1, limit = 24): Promise<PaginatedMovies> {
        try {
            const data = await this.get<KKListResponse>('/danh-sach/phim-moi-cap-nhat', {
                page,
                limit,
            });
            return {
                items: (data.items ?? []).map(normalizeMovie),
                pagination: {
                    total: data.pagination?.totalItems ?? 0,
                    page,
                    limit,
                    totalPages: Math.ceil((data.pagination?.totalItems ?? 0) / limit),
                },
            };
        } catch {
            return { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        }
    }

    async getTrending(page = 1, limit = 24): Promise<PaginatedMovies> {
        return this.getLatest(page, limit);
    }

    async getAnime(page = 1, limit = 24): Promise<PaginatedMovies> {
        try {
            const data = await this.get<KKListResponse>('/danh-sach/hoat-hinh', { page, limit });
            return {
                items: (data.items ?? []).map(normalizeMovie),
                pagination: {
                    total: data.pagination?.totalItems ?? 0,
                    page,
                    limit,
                    totalPages: Math.ceil((data.pagination?.totalItems ?? 0) / limit),
                },
            };
        } catch {
            return { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        }
    }

    async getTvSeries(page = 1, limit = 24): Promise<PaginatedMovies> {
        try {
            const data = await this.get<KKListResponse>('/danh-sach/tv-shows', { page, limit });
            return {
                items: (data.items ?? []).map(normalizeMovie),
                pagination: {
                    total: data.pagination?.totalItems ?? 0,
                    page,
                    limit,
                    totalPages: Math.ceil((data.pagination?.totalItems ?? 0) / limit),
                },
            };
        } catch {
            return { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        }
    }

    async getByGenre(genre: string, page = 1, limit = 24): Promise<PaginatedMovies> {
        try {
            const data = await this.get<KKListResponse>(`/the-loai/${genre}`, { page, limit });
            return {
                items: (data.items ?? []).map(normalizeMovie),
                pagination: {
                    total: data.pagination?.totalItems ?? 0,
                    page,
                    limit,
                    totalPages: Math.ceil((data.pagination?.totalItems ?? 0) / limit),
                },
            };
        } catch {
            return { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        }
    }

    async getByCountry(country: string, page = 1, limit = 24): Promise<PaginatedMovies> {
        try {
            const data = await this.get<KKListResponse>(`/quoc-gia/${country}`, { page, limit });
            return {
                items: (data.items ?? []).map(normalizeMovie),
                pagination: {
                    total: data.pagination?.totalItems ?? 0,
                    page,
                    limit,
                    totalPages: Math.ceil((data.pagination?.totalItems ?? 0) / limit),
                },
            };
        } catch {
            return { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        }
    }

    async search(params: SearchParams): Promise<NormalizedMovie[]> {
        try {
            const data = await this.get<KKListResponse>('/tim-kiem', {
                keyword: params.q,
                page: params.page ?? 1,
                limit: params.limit ?? 24,
            });
            return (data.items ?? []).map(normalizeMovie);
        } catch {
            return [];
        }
    }

    async getMovie(slug: string): Promise<NormalizedMovieDetail | null> {
        try {
            const data = await this.get<KKDetailResponse>(`/phim/${slug}`);
            if (!data.status || !data.movie) return null;

            const m = data.movie;
            const episodeGroups: EpisodeGroup[] = (data.episodes ?? []).map((server, idx) => ({
                serverName: server.server_name,
                serverIndex: idx,
                episodes: (server.server_data ?? []).map((ep) => ({
                    slug: ep.slug,
                    name: ep.name,
                    filename: ep.filename,
                    servers: [
                        ...(ep.link_embed
                            ? [{ name: 'Embed', link: ep.link_embed, type: 'embed' as const }]
                            : []),
                        ...(ep.link_m3u8
                            ? [{ name: 'M3U8', link: ep.link_m3u8, type: 'm3u8' as const }]
                            : []),
                    ],
                })),
            }));

            return {
                id: makeMovieId('kkphim', m.slug),
                slug: m.slug,
                source: 'kkphim',
                title: m.name,
                originalTitle: m.origin_name,
                poster: resolveImage(m.poster_url),
                thumb: resolveImage(m.thumb_url),
                backdrop: resolveImage(m.poster_url),
                description: m.content,
                year: m.year,
                type: m.type === 'single' ? 'movie' : m.type === 'hoathinh' ? 'anime' : 'series',
                status: m.status === 'completed' ? 'completed' : 'ongoing',
                currentEpisode: m.episode_current,
                quality: m.quality,
                language: m.lang,
                duration: m.time,
                views: m.view,
                genres: m.category?.map((c) => c.name) ?? [],
                countries: m.country?.map((c) => c.name) ?? [],
                categories: m.category,
                actors: m.actor ?? [],
                directors: m.director ?? [],
                episodeGroups,
            };
        } catch {
            return null;
        }
    }

    async getEpisodes(slug: string): Promise<EpisodeGroup[]> {
        const movie = await this.getMovie(slug);
        return movie?.episodeGroups ?? [];
    }
}
