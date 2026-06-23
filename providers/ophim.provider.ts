import axios from 'axios';
import { MovieProviderInterface } from './movie-provider.interface';
import {
    NormalizedMovie,
    NormalizedMovieDetail,
    PaginatedMovies,
    SearchParams,
    EpisodeGroup,
} from '~/types/movie';
import { fixImageUrl, makeMovieId } from '~/utils/normalize-movie';

const BASE_URL = process.env.OPHIM_API_BASE_URL ?? 'https://ophim1.com/v1/api';

interface OPhimMovie {
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
}

interface OPhimDetailMovie extends OPhimMovie {
    content: string;
    director: string[];
    actor: string[];
    trailer_url: string;
}

interface OPhimListResponse {
    status: boolean;
    items: OPhimMovie[];
    pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
    };
}

interface OPhimDetailResponse {
    status: boolean;
    movie: OPhimDetailMovie;
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

function mapType(type: string): NormalizedMovie['type'] {
    if (type === 'single') return 'movie';
    if (type === 'series') return 'series';
    if (type === 'hoathinh') return 'anime';
    if (type === 'tvshows') return 'tv-shows';
    return 'movie';
}

function mapStatus(status: string): NormalizedMovie['status'] {
    if (status === 'completed') return 'completed';
    if (status === 'ongoing') return 'ongoing';
    return 'completed';
}

function normalizeMovie(m: OPhimMovie): NormalizedMovie {
    return {
        id: makeMovieId('ophim', m.slug),
        slug: m.slug,
        source: 'ophim',
        title: m.name,
        originalTitle: m.origin_name,
        poster: fixImageUrl(m.poster_url, 'ophim'),
        thumb: fixImageUrl(m.thumb_url, 'ophim'),
        year: m.year,
        type: mapType(m.type),
        status: mapStatus(m.status),
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

export class OPhimProvider implements MovieProviderInterface {
    readonly name = 'ophim' as const;
    readonly priority = 1;

    private async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
        const { data } = await axios.get<T>(`${BASE_URL}${path}`, {
            params,
            timeout: 10000,
        });
        return data;
    }

    async getLatest(page = 1, limit = 24): Promise<PaginatedMovies> {
        try {
            const data = await this.get<OPhimListResponse>('/danh-sach/phim-moi-cap-nhat', {
                page,
                limit,
            });
            return {
                items: (data.items ?? []).map(normalizeMovie),
                pagination: {
                    total: data.pagination?.totalItems ?? 0,
                    page: data.pagination?.currentPage ?? page,
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
            const data = await this.get<OPhimListResponse>('/danh-sach/hoat-hinh', { page, limit });
            return {
                items: (data.items ?? []).map(normalizeMovie),
                pagination: {
                    total: data.pagination?.totalItems ?? 0,
                    page: data.pagination?.currentPage ?? page,
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
            const data = await this.get<OPhimListResponse>('/danh-sach/tv-shows', { page, limit });
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
            const data = await this.get<OPhimListResponse>(`/the-loai/${genre}`, { page, limit });
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
            const data = await this.get<OPhimListResponse>(`/quoc-gia/${country}`, { page, limit });
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
            const data = await this.get<OPhimListResponse>('/tim-kiem', {
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
            const data = await this.get<OPhimDetailResponse>(`/phim/${slug}`);
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
                id: makeMovieId('ophim', m.slug),
                slug: m.slug,
                source: 'ophim',
                title: m.name,
                originalTitle: m.origin_name,
                poster: fixImageUrl(m.poster_url, 'ophim'),
                thumb: fixImageUrl(m.thumb_url, 'ophim'),
                backdrop: fixImageUrl(m.poster_url, 'ophim'),
                description: m.content,
                year: m.year,
                type: mapType(m.type),
                status: mapStatus(m.status),
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
