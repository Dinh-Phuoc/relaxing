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
    episode_current?: string;
    episode_total?: string;
    quality?: string;
    lang?: string;
    status?: string;
    category?: Array<{ id: string; name: string; slug: string }>;
    country?: Array<{ id: string; name: string; slug: string }>;
    time?: string;
    view?: number;
    chieurap?: boolean;
    sub_docquyen?: boolean;
}

interface KKDetailMovie extends KKMovie {
    content: string;
    director: string[];
    actor: string[];
    trailer_url?: string;
    notify?: string;
}

function fixImage(url: string | undefined): string {
    if (!url) return '/placeholder-movie.jpg';
    if (url.startsWith('http')) return url;
    return `https://phimimg.com/${url}`;
}

function mapType(type: string): NormalizedMovie['type'] {
    if (type === 'single') return 'movie';
    if (type === 'hoathinh') return 'anime';
    if (type === 'tvshows') return 'tv-shows';
    return 'series';
}

function normalizeMovie(m: KKMovie): NormalizedMovie {
    return {
        id: makeMovieId('kkphim', m.slug),
        slug: m.slug,
        source: 'kkphim',
        title: m.name,
        originalTitle: m.origin_name,
        poster: fixImage(m.poster_url),
        thumb: fixImage(m.thumb_url),
        year: m.year,
        type: mapType(m.type ?? 'series'),
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
            timeout: 12000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                Accept: 'application/json',
            },
        });
        return data;
    }

    // Latest dùng endpoint flat (không có /v1/api)
    async getLatest(page = 1, limit = 24): Promise<PaginatedMovies> {
        try {
            const data = await this.get<{
                status: boolean;
                items: KKMovie[];
                pagination: { totalItems: number; currentPage: number; totalItemsPerPage: number; totalPages: number };
            }>('/danh-sach/phim-moi-cap-nhat', { page, limit });

            return {
                items: (data.items ?? []).map(normalizeMovie),
                pagination: {
                    total: data.pagination?.totalItems ?? 0,
                    page: data.pagination?.currentPage ?? page,
                    limit: data.pagination?.totalItemsPerPage ?? limit,
                    totalPages: data.pagination?.totalPages ?? 0,
                },
            };
        } catch {
            return { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        }
    }

    async getTrending(page = 1, limit = 24): Promise<PaginatedMovies> {
        return this.getLatest(page, limit);
    }

    // Category endpoints dùng /v1/api với response nested: { data: { items, params.pagination } }
    private async getV1List(path: string, page = 1, limit = 24): Promise<PaginatedMovies> {
        try {
            const data = await this.get<{
                status: boolean;
                data: {
                    items: KKMovie[];
                    params: {
                        pagination: { totalItems: number; currentPage: number; totalItemsPerPage: number; totalPages: number };
                    };
                };
            }>(`/v1/api${path}`, { page, limit });

            const items = data.data?.items ?? [];
            const pagination = data.data?.params?.pagination;

            return {
                items: items.map(normalizeMovie),
                pagination: {
                    total: pagination?.totalItems ?? 0,
                    page: pagination?.currentPage ?? page,
                    limit: pagination?.totalItemsPerPage ?? limit,
                    totalPages: pagination?.totalPages ?? 0,
                },
            };
        } catch {
            return { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        }
    }

    async getAnime(page = 1, limit = 24): Promise<PaginatedMovies> {
        return this.getV1List('/danh-sach/hoat-hinh', page, limit);
    }

    async getTvSeries(page = 1, limit = 24): Promise<PaginatedMovies> {
        return this.getV1List('/danh-sach/tv-shows', page, limit);
    }

    async getByGenre(genre: string, page = 1, limit = 24): Promise<PaginatedMovies> {
        return this.getV1List(`/the-loai/${genre}`, page, limit);
    }

    async getByCountry(country: string, page = 1, limit = 24): Promise<PaginatedMovies> {
        return this.getV1List(`/quoc-gia/${country}`, page, limit);
    }

    async getByYear(year: string, page = 1, limit = 24): Promise<PaginatedMovies> {
        return this.getV1List(`/nam/${year}`, page, limit);
    }

    async getMovies(page = 1, limit = 24): Promise<PaginatedMovies> {
        return this.getV1List('/danh-sach/phim-le', page, limit);
    }

    async getSeries(page = 1, limit = 24): Promise<PaginatedMovies> {
        return this.getV1List('/danh-sach/phim-bo', page, limit);
    }

    async search(params: SearchParams): Promise<PaginatedMovies> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 24;

        try {
            const data = await this.get<{
                status: boolean;
                data: {
                    items: KKMovie[];
                    params: {
                        pagination: {
                            totalItems: number;
                            currentPage: number;
                            totalItemsPerPage: number;
                            totalPages: number;
                        };
                    };
                };
            }>('/v1/api/tim-kiem', {
                keyword: params.q,
                page,
                limit,
            });

            const pagination = data.data?.params?.pagination;

            return {
                items: (data.data?.items ?? []).map(normalizeMovie),
                pagination: {
                    total: pagination?.totalItems ?? 0,
                    page: pagination?.currentPage ?? page,
                    limit: pagination?.totalItemsPerPage ?? limit,
                    totalPages: pagination?.totalPages ?? 0,
                },
            };
        } catch {
            return { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        }
    }

    async getMovie(slug: string): Promise<NormalizedMovieDetail | null> {
        try {
            const data = await this.get<{
                status: boolean;
                movie: KKDetailMovie;
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
            }>(`/phim/${slug}`);

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
                        ...(ep.link_embed ? [{ name: 'Embed', link: ep.link_embed, type: 'embed' as const }] : []),
                        ...(ep.link_m3u8 ? [{ name: 'M3U8', link: ep.link_m3u8, type: 'm3u8' as const }] : []),
                    ],
                })),
            }));

            return {
                id: makeMovieId('kkphim', m.slug),
                slug: m.slug,
                source: 'kkphim',
                title: m.name,
                originalTitle: m.origin_name,
                poster: fixImage(m.poster_url),
                thumb: fixImage(m.thumb_url),
                backdrop: fixImage(m.poster_url),
                description: m.content,
                year: m.year,
                type: mapType(m.type ?? 'series'),
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
