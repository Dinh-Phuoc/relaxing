import {
    NormalizedMovie,
    NormalizedMovieDetail,
    PaginatedMovies,
    SearchParams,
    EpisodeGroup,
    MovieSource,
} from '~/types/movie';

export interface MovieProviderInterface {
    readonly name: MovieSource;
    readonly priority: number;

    search(params: SearchParams): Promise<NormalizedMovie[]>;
    getMovie(slug: string): Promise<NormalizedMovieDetail | null>;
    getEpisodes(slug: string): Promise<EpisodeGroup[]>;
    getLatest(page: number, limit: number): Promise<PaginatedMovies>;
    getTrending(page: number, limit: number): Promise<PaginatedMovies>;
    getByGenre(genre: string, page: number, limit: number): Promise<PaginatedMovies>;
    getByCountry(country: string, page: number, limit: number): Promise<PaginatedMovies>;
    getAnime(page: number, limit: number): Promise<PaginatedMovies>;
    getTvSeries(page: number, limit: number): Promise<PaginatedMovies>;
}
