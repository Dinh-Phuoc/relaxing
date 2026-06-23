export type MovieSource = 'ophim' | 'kkphim';
export type MovieType = 'movie' | 'series' | 'anime' | 'tv-shows';
export type MovieStatus = 'ongoing' | 'completed' | 'trailer';

export interface Server {
    name: string;
    link: string;
    type?: 'embed' | 'm3u8';
}

export interface Episode {
    slug: string;
    name: string;
    filename?: string;
    servers: Server[];
}

export interface EpisodeGroup {
    serverName: string;
    serverIndex: number;
    episodes: Episode[];
}

export interface NormalizedMovie {
    id: string;
    slug: string;
    source: MovieSource;
    title: string;
    originalTitle?: string;
    poster: string;
    thumb?: string;
    backdrop?: string;
    description?: string;
    year?: number;
    countries?: string[];
    genres?: string[];
    rating?: number;
    duration?: string;
    status?: MovieStatus;
    type?: MovieType;
    totalEpisodes?: number;
    currentEpisode?: string;
    quality?: string;
    language?: string;
    views?: number;
    actors?: string[];
    directors?: string[];
    categories?: Array<{ id: string; name: string; slug: string }>;
    episodeGroups?: EpisodeGroup[];
}

export interface NormalizedMovieDetail extends NormalizedMovie {
    episodeGroups: EpisodeGroup[];
}

export interface PaginatedMovies {
    items: NormalizedMovie[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface SearchParams {
    q?: string;
    genre?: string;
    country?: string;
    year?: string;
    type?: MovieType;
    status?: MovieStatus;
    page?: number;
    limit?: number;
}
