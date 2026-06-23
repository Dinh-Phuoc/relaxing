import { OPhimProvider } from '~/providers/ophim.provider';
import { KKPhimProvider } from '~/providers/kkphim.provider';
import {
    NormalizedMovie,
    NormalizedMovieDetail,
    PaginatedMovies,
    SearchParams,
} from '~/types/movie';
import { memoryCache } from '~/services/cache/memory-cache';

const ophim = new OPhimProvider();
const kkphim = new KKPhimProvider();

const CACHE_TTL = {
    movie: 3600,
    search: 900,
    trending: 1800,
    latest: 1800,
    list: 1800,
};

function deduplicateMovies(movies: NormalizedMovie[]): NormalizedMovie[] {
    const seen = new Set<string>();
    return movies.filter((m) => {
        const key = m.slug;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

export const movieAggregator = {
    async getLatest(page = 1, limit = 24): Promise<PaginatedMovies> {
        const cacheKey = `latest:${page}:${limit}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        const [ophimResult] = await Promise.allSettled([ophim.getLatest(page, limit)]);
        const result =
            ophimResult.status === 'fulfilled'
                ? ophimResult.value
                : { items: [], pagination: { total: 0, page, limit, totalPages: 0 } };

        await memoryCache.set(cacheKey, result, CACHE_TTL.latest);
        return result;
    },

    async getTrending(page = 1, limit = 24): Promise<PaginatedMovies> {
        const cacheKey = `trending:${page}:${limit}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        const result = await ophim.getTrending(page, limit);
        await memoryCache.set(cacheKey, result, CACHE_TTL.trending);
        return result;
    },

    async getAnime(page = 1, limit = 24): Promise<PaginatedMovies> {
        const cacheKey = `anime:${page}:${limit}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        const result = await ophim.getAnime(page, limit);
        await memoryCache.set(cacheKey, result, CACHE_TTL.list);
        return result;
    },

    async getTvSeries(page = 1, limit = 24): Promise<PaginatedMovies> {
        const cacheKey = `tvseries:${page}:${limit}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        const result = await ophim.getTvSeries(page, limit);
        await memoryCache.set(cacheKey, result, CACHE_TTL.list);
        return result;
    },

    async getByGenre(genre: string, page = 1, limit = 24): Promise<PaginatedMovies> {
        const cacheKey = `genre:${genre}:${page}:${limit}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        const result = await ophim.getByGenre(genre, page, limit);
        await memoryCache.set(cacheKey, result, CACHE_TTL.list);
        return result;
    },

    async getByCountry(country: string, page = 1, limit = 24): Promise<PaginatedMovies> {
        const cacheKey = `country:${country}:${page}:${limit}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        const result = await ophim.getByCountry(country, page, limit);
        await memoryCache.set(cacheKey, result, CACHE_TTL.list);
        return result;
    },

    async getFeatured(): Promise<NormalizedMovie[]> {
        const cacheKey = 'featured';
        const cached = await memoryCache.get<NormalizedMovie[]>(cacheKey);
        if (cached) return cached;

        const result = await ophim.getLatest(1, 10);
        const featured = result.items
            .filter((m) => m.backdrop || m.poster)
            .slice(0, 8);
        await memoryCache.set(cacheKey, featured, CACHE_TTL.trending);
        return featured;
    },

    async getMovie(slug: string, source?: string): Promise<NormalizedMovieDetail | null> {
        const cacheKey = `movie:${source ?? 'auto'}:${slug}`;
        const cached = await memoryCache.get<NormalizedMovieDetail>(cacheKey);
        if (cached) return cached;

        let movie: NormalizedMovieDetail | null = null;

        if (source === 'kkphim') {
            movie = await kkphim.getMovie(slug);
        } else {
            movie = await ophim.getMovie(slug);
            if (!movie) {
                movie = await kkphim.getMovie(slug);
            }
        }

        if (movie) {
            await memoryCache.set(cacheKey, movie, CACHE_TTL.movie);
        }
        return movie;
    },

    async search(params: SearchParams): Promise<PaginatedMovies> {
        const cacheKey = `search:${JSON.stringify(params)}`;
        const cached = await memoryCache.get<PaginatedMovies>(cacheKey);
        if (cached) return cached;

        const [ophimResults, kkphimResults] = await Promise.allSettled([
            ophim.search(params),
            kkphim.search(params),
        ]);

        const ophimItems = ophimResults.status === 'fulfilled' ? ophimResults.value : [];
        const kkphimItems = kkphimResults.status === 'fulfilled' ? kkphimResults.value : [];

        const merged = deduplicateMovies([...ophimItems, ...kkphimItems]);
        const page = params.page ?? 1;
        const limit = params.limit ?? 24;

        const result: PaginatedMovies = {
            items: merged,
            pagination: {
                total: merged.length,
                page,
                limit,
                totalPages: Math.ceil(merged.length / limit),
            },
        };

        await memoryCache.set(cacheKey, result, CACHE_TTL.search);
        return result;
    },

    async getRelated(slug: string, limit = 12): Promise<NormalizedMovie[]> {
        const movie = await this.getMovie(slug);
        if (!movie) return [];

        const genre = movie.genres?.[0] ?? '';
        if (!genre) {
            const latest = await this.getLatest(1, limit + 1);
            return latest.items.filter((m) => m.slug !== slug).slice(0, limit);
        }

        const genreResult = await this.getByGenre(genre, 1, limit + 5);
        return genreResult.items.filter((m) => m.slug !== slug).slice(0, limit);
    },
};
