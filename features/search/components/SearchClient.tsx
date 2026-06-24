'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMovieSearch, useLatestMovies } from '~/hooks/useMovies';
import { useResponsive } from '~/hooks/useResponsive';
import MovieGrid from '~/components/movie/MovieGrid';
import Pagination from '~/components/ui/Pagination';
import { MovieType, SearchParams } from '~/types/movie';
import {
    SearchPageContainer,
    SearchPageTitle,
    SearchBarRow,
    SearchInputWrap,
    SearchInputIcon,
    SearchInput,
    FilterToggleButton,
    FilterDot,
    FilterPanel,
    FilterGrid,
    FilterField,
    FilterLabel,
    FilterSelect,
    ClearFiltersButton,
    TypePillRow,
    TypePill,
    ResultsMeta,
    NoResultsBox,
    NoResultsEmoji,
    SearchFallback,
    SearchFallbackBar,
} from '~/styles/components/search.styles';

const GENRES = [
    { label: 'Hành động', value: 'hanh-dong' },
    { label: 'Tình cảm', value: 'tinh-cam' },
    { label: 'Hài hước', value: 'hai-huoc' },
    { label: 'Kinh dị', value: 'kinh-di' },
    { label: 'Viễn tưởng', value: 'vien-tuong' },
    { label: 'Hoạt hình', value: 'hoat-hinh' },
    { label: 'Tâm lý', value: 'tam-ly' },
    { label: 'Chiến tranh', value: 'chien-tranh' },
];

const COUNTRIES = [
    { label: 'Việt Nam', value: 'viet-nam' },
    { label: 'Hàn Quốc', value: 'han-quoc' },
    { label: 'Nhật Bản', value: 'nhat-ban' },
    { label: 'Trung Quốc', value: 'trung-quoc' },
    { label: 'Mỹ', value: 'au-my' },
    { label: 'Thái Lan', value: 'thai-lan' },
];

const YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

const TYPES = [
    { label: 'Phim lẻ', value: 'movie' },
    { label: 'Phim bộ', value: 'series' },
    { label: 'Anime', value: 'anime' },
    { label: 'TV Shows', value: 'tv-shows' },
];

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

function buildSearchUrl(params: URLSearchParams): string {
    const qs = params.toString();
    return qs ? `/search?${qs}` : '/search';
}

function SearchClientInner() {
    const searchParamsHook = useSearchParams();
    const router = useRouter();
    const { isMobile } = useResponsive();

    const genre = searchParamsHook.get('genre') ?? '';
    const country = searchParamsHook.get('country') ?? '';
    const year = searchParamsHook.get('year') ?? '';
    const type = (searchParamsHook.get('type') as MovieType) ?? '';
    const page = (() => {
        const p = parseInt(searchParamsHook.get('page') ?? '1', 10);
        return Number.isNaN(p) || p < 1 ? 1 : p;
    })();

    const [query, setQuery] = useState(searchParamsHook.get('q') ?? '');
    const [showFilters, setShowFilters] = useState(false);

    const debouncedQuery = useDebounce(query, 400);
    const isFirstQueryRender = useRef(true);
    const urlQuery = searchParamsHook.get('q') ?? '';

    useEffect(() => {
        setQuery(urlQuery);
    }, [urlQuery]);

    const replaceSearchParams = (mutate: (params: URLSearchParams) => void) => {
        const params = new URLSearchParams(searchParamsHook.toString());
        mutate(params);
        router.replace(buildSearchUrl(params), { scroll: false });
    };

    useEffect(() => {
        if (isFirstQueryRender.current) {
            isFirstQueryRender.current = false;
            return;
        }

        if (debouncedQuery === urlQuery) return;

        replaceSearchParams((params) => {
            if (debouncedQuery) params.set('q', debouncedQuery);
            else params.delete('q');
            params.delete('page');
        });
    }, [debouncedQuery, urlQuery]);

    const hasFilters = !!(debouncedQuery || genre || country || year || type);

    const searchParams: SearchParams = {
        q: debouncedQuery || undefined,
        genre: genre || undefined,
        country: country || undefined,
        year: year || undefined,
        type: (type || undefined) as MovieType | undefined,
        page,
        limit: 24,
    };

    const { data: searchResults, isLoading: searchLoading } = useMovieSearch(searchParams);
    const { data: latestMovies, isLoading: latestLoading } = useLatestMovies(1);

    const clearFilters = () => {
        replaceSearchParams((params) => {
            params.delete('genre');
            params.delete('country');
            params.delete('year');
            params.delete('type');
            params.delete('page');
        });
    };

    const handlePageChange = (newPage: number) => {
        replaceSearchParams((params) => {
            if (newPage > 1) params.set('page', String(newPage));
            else params.delete('page');
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const updateFilter = (key: 'genre' | 'country' | 'year' | 'type', value: string) => {
        replaceSearchParams((params) => {
            if (value) params.set(key, value);
            else params.delete(key);
            params.delete('page');
        });
    };

    const toggleTypeFilter = (value: MovieType) => {
        replaceSearchParams((params) => {
            if (params.get('type') === value) params.delete('type');
            else params.set('type', value);
            params.delete('page');
        });
    };

    const hasActiveFilters = !!(genre || country || year || type);
    const filterActive = showFilters || hasActiveFilters;

    return (
        <SearchPageContainer $isMobile={isMobile}>
            <SearchPageTitle $isMobile={isMobile}>
                {debouncedQuery ? `Kết quả: "${debouncedQuery}"` : 'Tìm kiếm phim'}
            </SearchPageTitle>

            <SearchBarRow>
                <SearchInputWrap>
                    <SearchInputIcon>
                        <Search size={16} />
                    </SearchInputIcon>
                    <SearchInput
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Tìm kiếm tên phim..."
                    />
                </SearchInputWrap>
                <FilterToggleButton
                    onClick={() => setShowFilters(!showFilters)}
                    $active={filterActive}
                >
                    <SlidersHorizontal size={15} />
                    {!isMobile && 'Bộ lọc'}
                    {hasActiveFilters && <FilterDot />}
                </FilterToggleButton>
            </SearchBarRow>

            {showFilters && (
                <FilterPanel>
                    <FilterGrid $isMobile={isMobile}>
                        <FilterField>
                            <FilterLabel>THỂ LOẠI</FilterLabel>
                            <FilterSelect
                                value={genre}
                                onChange={(e) => updateFilter('genre', e.target.value)}
                            >
                                <option value="">Tất cả</option>
                                {GENRES.map((g) => (
                                    <option key={g.value} value={g.value}>
                                        {g.label}
                                    </option>
                                ))}
                            </FilterSelect>
                        </FilterField>
                        <FilterField>
                            <FilterLabel>QUỐC GIA</FilterLabel>
                            <FilterSelect
                                value={country}
                                onChange={(e) => updateFilter('country', e.target.value)}
                            >
                                <option value="">Tất cả</option>
                                {COUNTRIES.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </FilterSelect>
                        </FilterField>
                        <FilterField>
                            <FilterLabel>NĂM</FilterLabel>
                            <FilterSelect
                                value={year}
                                onChange={(e) => updateFilter('year', e.target.value)}
                            >
                                <option value="">Tất cả</option>
                                {YEARS.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </FilterSelect>
                        </FilterField>
                        <FilterField>
                            <FilterLabel>LOẠI PHIM</FilterLabel>
                            <FilterSelect
                                value={type}
                                onChange={(e) => updateFilter('type', e.target.value)}
                            >
                                <option value="">Tất cả</option>
                                {TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </FilterSelect>
                        </FilterField>
                    </FilterGrid>

                    {hasActiveFilters && (
                        <ClearFiltersButton onClick={clearFilters}>
                            <X size={13} /> Xóa bộ lọc
                        </ClearFiltersButton>
                    )}
                </FilterPanel>
            )}

            <TypePillRow>
                {TYPES.map((t) => (
                    <TypePill
                        key={t.value}
                        onClick={() => toggleTypeFilter(t.value as MovieType)}
                        $active={type === t.value}
                    >
                        {t.label}
                    </TypePill>
                ))}
            </TypePillRow>

            {hasFilters ? (
                <>
                    <ResultsMeta>
                        {searchLoading
                            ? 'Đang tìm...'
                            : (() => {
                                  const total = searchResults?.pagination.total ?? 0;
                                  if (total === 0) return '0 kết quả';
                                  const from = (page - 1) * 24 + 1;
                                  const to = Math.min(page * 24, total);
                                  return `${from}–${to} / ${total.toLocaleString('vi-VN')} kết quả`;
                              })()}
                    </ResultsMeta>
                    <MovieGrid movies={searchResults?.items ?? []} isLoading={searchLoading} />
                    {!searchLoading && searchResults?.items.length === 0 && (
                        <NoResultsBox>
                            <NoResultsEmoji>🎬</NoResultsEmoji>
                            <p>Không tìm thấy phim phù hợp</p>
                        </NoResultsBox>
                    )}
                    <Pagination
                        page={page}
                        totalPages={searchResults?.pagination.totalPages ?? 0}
                        onPageChange={handlePageChange}
                        isLoading={searchLoading}
                    />
                </>
            ) : (
                <>
                    <ResultsMeta>Phim mới cập nhật</ResultsMeta>
                    <MovieGrid movies={latestMovies?.items ?? []} isLoading={latestLoading} />
                </>
            )}
        </SearchPageContainer>
    );
}

export default function SearchClient() {
    return (
        <Suspense
            fallback={
                <SearchFallback>
                    <SearchFallbackBar />
                </SearchFallback>
            }
        >
            <SearchClientInner />
        </Suspense>
    );
}
