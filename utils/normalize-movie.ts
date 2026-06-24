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

/** Chuyển tên tiếng Việt hoặc slug sang slug dùng cho API phim (the-loai, quoc-gia) */
export function toFilterSlug(value: string, type?: 'genre' | 'country'): string {
    const trimmed = value.trim();
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
        return trimmed;
    }

    const slug = trimmed
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    if (type === 'country' && slug === 'my') {
        return 'au-my';
    }

    return slug;
}
