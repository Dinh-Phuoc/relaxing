import { MovieSource } from '~/types/movie';

export function fixImageUrl(url: string | undefined, source: MovieSource): string {
    if (!url) return '/placeholder-movie.jpg';
    if (url.startsWith('http')) return url;
    if (source === 'ophim') {
        return `https://img.ophim.live/uploads/movies/${url}`;
    }
    return url;
}

export function normalizeSlug(title: string, year?: number): string {
    return `${title}-${year ?? ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function makeMovieId(source: MovieSource, slug: string): string {
    return `${source}:${slug}`;
}
