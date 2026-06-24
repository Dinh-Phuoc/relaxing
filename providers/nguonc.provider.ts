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

// Base URL — không cần config vì domain ổn định
const BASE_URL = 'https://phim.nguonc.com/api';

// ——— Raw types ———

interface NguonCItem {
    name: string;
    slug: string;
    original_name?: string;
    thumb_url: string;
    poster_url: string;
    description?: string;
    total_episodes?: number;
    current_episode?: string;
    time?: string;
    quality?: string;
    language?: string;
    director?: string;
    casts?: string;
}

interface NguonCListResponse {
    status: string;
    paginate: {
        current_page: number;
        total_page: number;
        total_items: number;
        items_per_page: number;
    };
    items: NguonCItem[];
}

interface NguonCCategoryGroup {
    group: { id: string; name: string };
    list: Array<{ id: string; name: string; slug?: string }>;
}

interface NguonCDetailMovie extends NguonCItem {
    id: string;
    category?: Record<string, NguonCCategoryGroup>;
    episodes?: Array<{
        server_name: string;
        items: Array<{ name: string; slug: string; embed?: string; m3u8?: string }>;
    }>;
}

interface NguonCDetailResponse {
    status: string;
    movie: NguonCDetailMovie;
}

// ——— Helpers ———

function extractCategories(category?: Record<string, NguonCCategoryGroup>): {
    genres: string[];
    countries: string[];
    type: NormalizedMovie['type'];
} {
    if (!category) return { genres: [], countries: [], type: 'series' };

    let genres: string[] = [];
    let countries: string[] = [];
    let type: NormalizedMovie['type'] = 'series';

    for (const group of Object.values(category)) {
        const groupName = group.group?.name?.toLowerCase() ?? '';

        if (groupName.includes('định dạng') || groupName.includes('dinh dang')) {
            const fmt = group.list?.[0]?.name?.toLowerCase() ?? '';
            if (fmt.includes('lẻ') || fmt.includes('le')) type = 'movie';
            else if (fmt.includes('hoạt') || fmt.includes('hoat')) type = 'anime';
            else if (fmt.includes('tv')) type = 'tv-shows';
            else type = 'series';
        } else if (groupName.includes('thể loại') || groupName.includes('the loai')) {
            genres = (group.list ?? []).map((g) => g.name).filter(Boolean);
        } else if (groupName.includes('quốc gia') || groupName.includes('quoc gia')) {
            countries = (group.list ?? []).map((g) => g.name).filter(Boolean);
        }
    }

    return { genres, countries, type };
}

function normalizeItem(m: NguonCItem): NormalizedMovie {
    return {
        id: makeMovieId('kkphim', m.slug), // Dùng chung namespace để dedup với KKPhim
        slug: m.slug,
        source: 'kkphim', // Map về 'kkphim' để player/detail dùng KKPhim khi xem
        title: m.name,
        originalTitle: m.original_name,
        poster: m.poster_url || m.thumb_url || '',
        thumb: m.thumb_url || m.poster_url || '',
        description: m.description,
        totalEpisodes: m.total_episodes,
        currentEpisode: m.current_episode,
        duration: m.time ?? undefined,
        quality: m.quality,
        language: m.language,
        genres: [],
        countries: [],
        type: 'series',
    };
}

// ——— Provider ———

export class NguonCProvider implements MovieProviderInterface {
    readonly name = 'kkphim' as const; // Map về kkphim để tái sử dụng player
    readonly priority = 3;

    private async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
        const { data } = await axios.get<T>(`${BASE_URL}${path}`, {
            params,
            timeout: 12000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                Accept: 'application/json',
            },
        });
        return data;
    }

    private mapList(data: NguonCListResponse, page: number): PaginatedMovies {
        return {
            items: (data.items ?? []).map(normalizeItem),
            pagination: {
                total: data.paginate?.total_items ?? 0,
                page: data.paginate?.current_page ?? page,
                limit: data.paginate?.items_per_page ?? 10,
                totalPages: data.paginate?.total_page ?? 0,
            },
        };
    }

    async getLatest(page = 1): Promise<PaginatedMovies> {
        try {
            const data = await this.get<NguonCListResponse>('/films/phim-moi-cap-nhat', { page });
            return this.mapList(data, page);
        } catch {
            return { items: [], pagination: { total: 0, page, limit: 10, totalPages: 0 } };
        }
    }

    async getTrending(page = 1): Promise<PaginatedMovies> {
        return this.getLatest(page);
    }

    async getTvSeries(page = 1): Promise<PaginatedMovies> {
        try {
            const data = await this.get<NguonCListResponse>('/films/the-loai/tv-shows', { page });
            return this.mapList(data, page);
        } catch {
            return { items: [], pagination: { total: 0, page, limit: 10, totalPages: 0 } };
        }
    }

    async getAnime(page = 1): Promise<PaginatedMovies> {
        try {
            const data = await this.get<NguonCListResponse>('/films/the-loai/hoat-hinh', { page });
            return this.mapList(data, page);
        } catch {
            return { items: [], pagination: { total: 0, page, limit: 10, totalPages: 0 } };
        }
    }

    async getByGenre(genre: string, page = 1): Promise<PaginatedMovies> {
        try {
            const data = await this.get<NguonCListResponse>(`/films/the-loai/${genre}`, { page });
            return this.mapList(data, page);
        } catch {
            return { items: [], pagination: { total: 0, page, limit: 10, totalPages: 0 } };
        }
    }

    async getByCountry(country: string, page = 1): Promise<PaginatedMovies> {
        try {
            const data = await this.get<NguonCListResponse>(`/films/quoc-gia/${country}`, { page });
            return this.mapList(data, page);
        } catch {
            return { items: [], pagination: { total: 0, page, limit: 10, totalPages: 0 } };
        }
    }

    async getMovies(page = 1): Promise<PaginatedMovies> {
        try {
            const data = await this.get<NguonCListResponse>('/films/danh-sach/phim-le', { page });
            return this.mapList(data, page);
        } catch {
            return { items: [], pagination: { total: 0, page, limit: 10, totalPages: 0 } };
        }
    }

    async getSeries(page = 1): Promise<PaginatedMovies> {
        try {
            const data = await this.get<NguonCListResponse>('/films/danh-sach/phim-bo', { page });
            return this.mapList(data, page);
        } catch {
            return { items: [], pagination: { total: 0, page, limit: 10, totalPages: 0 } };
        }
    }

    async search(params: SearchParams): Promise<PaginatedMovies> {
        const page = params.page ?? 1;

        try {
            const data = await this.get<NguonCListResponse>('/films/search', {
                keyword: params.q,
                page,
            });
            return this.mapList(data, page);
        } catch {
            return { items: [], pagination: { total: 0, page, limit: 10, totalPages: 0 } };
        }
    }

    async getMovie(slug: string): Promise<NormalizedMovieDetail | null> {
        try {
            const data = await this.get<NguonCDetailResponse>(`/film/${slug}`);
            if (data.status !== 'success' || !data.movie) return null;

            const m = data.movie;
            const { genres, countries, type } = extractCategories(m.category);

            const episodeGroups: EpisodeGroup[] = (m.episodes ?? []).map((server, idx) => ({
                serverName: server.server_name,
                serverIndex: idx,
                episodes: (server.items ?? []).map((ep) => ({
                    slug: ep.slug,
                    name: ep.name,
                    servers: [
                        ...(ep.embed ? [{ name: 'Embed', link: ep.embed, type: 'embed' as const }] : []),
                        ...(ep.m3u8 ? [{ name: 'M3U8', link: ep.m3u8, type: 'm3u8' as const }] : []),
                    ],
                })),
            }));

            return {
                id: makeMovieId('kkphim', m.slug),
                slug: m.slug,
                source: 'kkphim',
                title: m.name,
                originalTitle: m.original_name,
                poster: m.poster_url || m.thumb_url || '',
                thumb: m.thumb_url || m.poster_url || '',
                backdrop: m.poster_url || m.thumb_url || '',
                description: m.description,
                totalEpisodes: m.total_episodes,
                currentEpisode: m.current_episode,
                duration: m.time ?? undefined,
                quality: m.quality,
                language: m.language,
                genres,
                countries,
                type,
                actors: m.casts ? m.casts.split(',').map((s) => s.trim()) : [],
                directors: m.director ? [m.director] : [],
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
