import { KKPhimProvider } from '~/providers/kkphim.provider';
import { NguonCProvider } from '~/providers/nguonc.provider';
import { NormalizedMovie, NormalizedMovieDetail, PaginatedMovies, SearchParams } from '~/types/movie';
import { memoryCache } from '~/services/cache/memory-cache';
import { toFilterSlug } from '~/utils/normalize-movie';

const kkphim = new KKPhimProvider();
const nguonc = new NguonCProvider();

const CACHE_TTL = {
    movie: 3600,
    search: 900,
    trending: 1800,
    latest: 1800,
    list: 1800,
};

// Dedup theo slug — ưu tiên KKPhim (thường có FHD/embed tốt hơn)
function deduplicateMovies(primary: NormalizedMovie[], secondary: NormalizedMovie[]): NormalizedMovie[] {
    const seen = new Set(primary.map((m) => m.slug));
    const extra = secondary.filter((m) => !seen.has(m.slug));
    return [...primary, ...extra];
}

function mergePaginated(primary: PaginatedMovies, secondary: PaginatedMovies): PaginatedMovies {
    const merged = deduplicateMovies(primary.items, secondary.items);
    return {
        items: merged,
        pagination: {
            total: Math.max(primary.pagination.total, secondary.pagination.total),
            page: primary.pagination.page,
            limit: Math.max(primary.pagination.limit, 10),
            totalPages: Math.max(primary.pagination.totalPages, secondary.pagination.totalPages),
        },
    };
}

function filterMovies(items: NormalizedMovie[], params: SearchParams): NormalizedMovie[] {
    return items.filter((m) => {
        if (params.q) {
            const q = params.q.toLowerCase();
            const matchTitle = m.title.toLowerCase().includes(q);
            const matchOriginal = m.originalTitle?.toLowerCase().includes(q);
            if (!matchTitle && !matchOriginal) return false;
        }
        if (params.type && m.type && m.type !== params.type) return false;
        if (params.year && String(m.year) !== params.year) return false;
        return true;
    });
}

export const movieAggregator = {
    async getLatest(page = 1, limit = 24): Promise<PaginatedMovies> {
        const cacheKey = `latest:${page}:${limit}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        // Gọi song song cả 2 nguồn
        const [kkResult, ncResult] = await Promise.allSettled([
            kkphim.getLatest(page, limit),
            nguonc.getLatest(page),
        ]);

        const kk = kkResult.status === 'fulfilled' ? kkResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const nc = ncResult.status === 'fulfilled' ? ncResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const result = mergePaginated(kk, nc);

        if (result.items.length > 0) {
            await memoryCache.set(cacheKey, result, CACHE_TTL.latest);
        }
        return result;
    },

    async getTrending(page = 1, limit = 24): Promise<PaginatedMovies> {
        const cacheKey = `trending:${page}:${limit}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        const [kkResult, ncResult] = await Promise.allSettled([
            kkphim.getTrending(page, limit),
            nguonc.getTrending(page),
        ]);
        const kk = kkResult.status === 'fulfilled' ? kkResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const nc = ncResult.status === 'fulfilled' ? ncResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const result = mergePaginated(kk, nc);

        if (result.items.length > 0) await memoryCache.set(cacheKey, result, CACHE_TTL.trending);
        return result;
    },

    async getAnime(page = 1, limit = 24): Promise<PaginatedMovies> {
        const cacheKey = `anime:${page}:${limit}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        const [kkResult, ncResult] = await Promise.allSettled([
            kkphim.getAnime(page, limit),
            nguonc.getAnime(page),
        ]);
        const kk = kkResult.status === 'fulfilled' ? kkResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const nc = ncResult.status === 'fulfilled' ? ncResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const result = mergePaginated(kk, nc);

        if (result.items.length > 0) await memoryCache.set(cacheKey, result, CACHE_TTL.list);
        return result;
    },

    async getTvSeries(page = 1, limit = 24): Promise<PaginatedMovies> {
        const cacheKey = `tvseries:${page}:${limit}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        const [kkResult, ncResult] = await Promise.allSettled([
            kkphim.getTvSeries(page, limit),
            nguonc.getTvSeries(page),
        ]);
        const kk = kkResult.status === 'fulfilled' ? kkResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const nc = ncResult.status === 'fulfilled' ? ncResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const result = mergePaginated(kk, nc);

        if (result.items.length > 0) await memoryCache.set(cacheKey, result, CACHE_TTL.list);
        return result;
    },

    async getByGenre(genre: string, page = 1, limit = 24): Promise<PaginatedMovies> {
        const genreSlug = toFilterSlug(genre, 'genre');
        const cacheKey = `genre:${genreSlug}:${page}:${limit}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        const [kkResult, ncResult] = await Promise.allSettled([
            kkphim.getByGenre(genreSlug, page, limit),
            nguonc.getByGenre(genreSlug, page),
        ]);
        const kk = kkResult.status === 'fulfilled' ? kkResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const nc = ncResult.status === 'fulfilled' ? ncResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const result = mergePaginated(kk, nc);

        if (result.items.length > 0) await memoryCache.set(cacheKey, result, CACHE_TTL.list);
        return result;
    },

    async getByCountry(country: string, page = 1, limit = 24): Promise<PaginatedMovies> {
        const countrySlug = toFilterSlug(country, 'country');
        const cacheKey = `country:${countrySlug}:${page}:${limit}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        const [kkResult, ncResult] = await Promise.allSettled([
            kkphim.getByCountry(countrySlug, page, limit),
            nguonc.getByCountry(countrySlug, page),
        ]);
        const kk = kkResult.status === 'fulfilled' ? kkResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const nc = ncResult.status === 'fulfilled' ? ncResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const result = mergePaginated(kk, nc);

        if (result.items.length > 0) await memoryCache.set(cacheKey, result, CACHE_TTL.list);
        return result;
    },

    async getByYear(year: string, page = 1, limit = 24): Promise<PaginatedMovies> {
        const cacheKey = `year:${year}:${page}:${limit}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        // NguonC chưa có API lọc theo năm — chỉ dùng KKPhim
        const result = await kkphim.getByYear(year, page, limit);

        if (result.items.length > 0) await memoryCache.set(cacheKey, result, CACHE_TTL.list);
        return result;
    },

    async getMovies(page = 1, limit = 24): Promise<PaginatedMovies> {
        const cacheKey = `movies:${page}:${limit}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        const [kkResult, ncResult] = await Promise.allSettled([
            kkphim.getMovies(page, limit),
            nguonc.getMovies(page),
        ]);
        const kk = kkResult.status === 'fulfilled' ? kkResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const nc = ncResult.status === 'fulfilled' ? ncResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const result = mergePaginated(kk, nc);

        if (result.items.length > 0) await memoryCache.set(cacheKey, result, CACHE_TTL.list);
        return result;
    },

    async getSeries(page = 1, limit = 24): Promise<PaginatedMovies> {
        const cacheKey = `series:${page}:${limit}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        const [kkResult, ncResult] = await Promise.allSettled([
            kkphim.getSeries(page, limit),
            nguonc.getSeries(page),
        ]);
        const kk = kkResult.status === 'fulfilled' ? kkResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const nc = ncResult.status === 'fulfilled' ? ncResult.value : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        const result = mergePaginated(kk, nc);

        if (result.items.length > 0) await memoryCache.set(cacheKey, result, CACHE_TTL.list);
        return result;
    },

    async fetchByFilters(params: SearchParams): Promise<PaginatedMovies> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 24;

        // Ưu tiên endpoint cụ thể nhất làm nguồn dữ liệu chính
        let base: PaginatedMovies;
        if (params.genre) {
            base = await this.getByGenre(params.genre, page, limit);
        } else if (params.country) {
            base = await this.getByCountry(params.country, page, limit);
        } else if (params.type === 'anime') {
            base = await this.getAnime(page, limit);
        } else if (params.type === 'tv-shows') {
            base = await this.getTvSeries(page, limit);
        } else if (params.type === 'movie') {
            base = await this.getMovies(page, limit);
        } else if (params.type === 'series') {
            base = await this.getSeries(page, limit);
        } else if (params.year) {
            base = await this.getByYear(params.year, page, limit);
        } else {
            return { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        }

        const filtered = filterMovies(base.items, params);
        return {
            items: filtered,
            pagination: {
                total: filtered.length > 0 ? base.pagination.total : 0,
                page: base.pagination.page,
                limit: base.pagination.limit,
                totalPages: base.pagination.totalPages,
            },
        };
    },

    async getFeatured(): Promise<NormalizedMovie[]> {
        const cacheKey = 'featured';
        const cached = await memoryCache.get<NormalizedMovie[]>(cacheKey);
        if (cached) return cached;

        // Featured từ KKPhim trước (chất lượng poster tốt hơn)
        const [kkResult, ncResult] = await Promise.allSettled([
            kkphim.getLatest(1, 12),
            nguonc.getLatest(1),
        ]);
        const kkItems = kkResult.status === 'fulfilled' ? kkResult.value.items : [];
        const ncItems = ncResult.status === 'fulfilled' ? ncResult.value.items : [];
        const merged = deduplicateMovies(kkItems, ncItems);
        const featured = merged.filter((m) => m.poster && m.title).slice(0, 8);

        if (featured.length > 0) await memoryCache.set(cacheKey, featured, CACHE_TTL.trending);
        return featured;
    },

    async getMovie(slug: string, source?: string): Promise<NormalizedMovieDetail | null> {
        const cacheKey = `movie:${source ?? 'auto'}:${slug}`;
        const cached = await memoryCache.get<NormalizedMovieDetail>(cacheKey);
        if (cached) return cached;

        // Thử KKPhim trước, fallback NguonC
        let movie: NormalizedMovieDetail | null = await kkphim.getMovie(slug);
        if (!movie) {
            movie = await nguonc.getMovie(slug);
        }

        if (movie) await memoryCache.set(cacheKey, movie, CACHE_TTL.movie);
        return movie;
    },

    async search(params: SearchParams): Promise<PaginatedMovies> {
        const cacheKey = `search:${JSON.stringify(params)}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        const page = params.page ?? 1;
        const limit = params.limit ?? 24;
        let result: PaginatedMovies;

        if (params.q) {
            const [kkResult, ncResult] = await Promise.allSettled([
                kkphim.search(params),
                nguonc.search(params),
            ]);
            const kk =
                kkResult.status === 'fulfilled'
                    ? kkResult.value
                    : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };
            const nc =
                ncResult.status === 'fulfilled'
                    ? ncResult.value
                    : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };

            const merged = mergePaginated(kk, nc);
            const filtered = filterMovies(merged.items, { ...params, q: undefined });

            result = {
                items: filtered,
                pagination: merged.pagination,
            };
        } else {
            result = await this.fetchByFilters(params);
        }

        if (result.items.length > 0) await memoryCache.set(cacheKey, result, CACHE_TTL.search);
        return result;
    },

    async getRelated(slug: string, limit = 12): Promise<NormalizedMovie[]> {
        const movie = await this.getMovie(slug);
        if (!movie?.genres?.length) {
            const latest = await this.getLatest(1, limit + 1);
            return latest.items.filter((m) => m.slug !== slug).slice(0, limit);
        }

        const genreSlug = movie.genres[0]
            ? toFilterSlug(movie.genres[0], 'genre')
            : '';

        const genreResult = await this.getByGenre(genreSlug, 1, limit + 5);
        const related = genreResult.items.filter((m) => m.slug !== slug).slice(0, limit);

        if (!related.length) {
            const latest = await this.getLatest(1, limit + 1);
            return latest.items.filter((m) => m.slug !== slug).slice(0, limit);
        }
        return related;
    },
};
