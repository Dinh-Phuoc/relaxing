'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMovieSearch, useLatestMovies } from '~/hooks/useMovies';
import { useResponsive } from '~/hooks/useResponsive';
import MovieGrid from '~/components/movie/MovieGrid';
import Pagination from '~/components/ui/Pagination';
import { MovieType, SearchParams } from '~/types/movie';

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

    // URL là nguồn dữ liệu chính — đồng bộ với header nav
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

    // Đồng bộ ô tìm kiếm khi URL đổi (header nav, back/forward)
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

    const selectStyle: React.CSSProperties = {
        width: '100%', padding: '9px 12px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px', color: '#fff', fontSize: '13px',
        cursor: 'pointer', outline: 'none',
        appearance: 'none',
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '16px' : '24px' }}>
            <h1 style={{ color: 'white', fontSize: isMobile ? '22px' : '28px', fontWeight: 700, marginBottom: '20px' }}>
                {debouncedQuery ? `Kết quả: "${debouncedQuery}"` : 'Tìm kiếm phim'}
            </h1>

            {/* Search + Filter bar */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#606070' }} />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Tìm kiếm tên phim..."
                        style={{
                            width: '100%', padding: '12px 12px 12px 40px',
                            background: '#111118', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '10px', color: '#fff', fontSize: '15px', outline: 'none',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                        background: showFilters || hasActiveFilters ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${showFilters || hasActiveFilters ? 'rgba(229,9,20,0.4)' : 'rgba(255,255,255,0.1)'}`,
                        color: showFilters || hasActiveFilters ? '#e50914' : '#a0a0b0',
                        fontWeight: 500, fontSize: '13px', whiteSpace: 'nowrap', flexShrink: 0,
                    }}
                >
                    <SlidersHorizontal size={15} />
                    {!isMobile && 'Bộ lọc'}
                    {hasActiveFilters && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e50914', flexShrink: 0 }} />}
                </button>
            </div>

            {/* Filter panel */}
            {showFilters && (
                <div style={{
                    background: '#111118', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', padding: '16px', marginBottom: '20px',
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                        gap: '12px',
                    }}>
                        <div>
                            <label style={{ display: 'block', color: '#a0a0b0', fontSize: '11px', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.5px' }}>THỂ LOẠI</label>
                            <select value={genre} onChange={(e) => updateFilter('genre', e.target.value)} style={selectStyle}>
                                <option value="">Tất cả</option>
                                {GENRES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#a0a0b0', fontSize: '11px', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.5px' }}>QUỐC GIA</label>
                            <select value={country} onChange={(e) => updateFilter('country', e.target.value)} style={selectStyle}>
                                <option value="">Tất cả</option>
                                {COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#a0a0b0', fontSize: '11px', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.5px' }}>NĂM</label>
                            <select value={year} onChange={(e) => updateFilter('year', e.target.value)} style={selectStyle}>
                                <option value="">Tất cả</option>
                                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#a0a0b0', fontSize: '11px', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.5px' }}>LOẠI PHIM</label>
                            <select value={type} onChange={(e) => updateFilter('type', e.target.value)} style={selectStyle}>
                                <option value="">Tất cả</option>
                                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '12px', color: '#e50914', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                        >
                            <X size={13} /> Xóa bộ lọc
                        </button>
                    )}
                </div>
            )}

            {/* Quick type filter pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {TYPES.map((t) => (
                    <button
                        key={t.value}
                        onClick={() => toggleTypeFilter(t.value as MovieType)}
                        style={{
                            padding: '6px 14px', borderRadius: '20px', border: '1px solid', cursor: 'pointer',
                            fontSize: '12px', fontWeight: 500, transition: 'all 0.15s',
                            background: type === t.value ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.04)',
                            borderColor: type === t.value ? 'rgba(229,9,20,0.5)' : 'rgba(255,255,255,0.1)',
                            color: type === t.value ? '#fff' : '#a0a0b0',
                        }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Results */}
            {hasFilters ? (
                <>
                    <p style={{ color: '#606070', fontSize: '13px', marginBottom: '16px' }}>
                        {searchLoading
                            ? 'Đang tìm...'
                            : (() => {
                                  const total = searchResults?.pagination.total ?? 0;
                                  if (total === 0) return '0 kết quả';
                                  const from = (page - 1) * 24 + 1;
                                  const to = Math.min(page * 24, total);
                                  return `${from}–${to} / ${total.toLocaleString('vi-VN')} kết quả`;
                              })()}
                    </p>
                    <MovieGrid movies={searchResults?.items ?? []} isLoading={searchLoading} />
                    {!searchLoading && searchResults?.items.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: '#606070' }}>
                            <p style={{ fontSize: '40px', marginBottom: '12px' }}>🎬</p>
                            <p>Không tìm thấy phim phù hợp</p>
                        </div>
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
                    <p style={{ color: '#606070', fontSize: '13px', marginBottom: '16px' }}>Phim mới cập nhật</p>
                    <MovieGrid movies={latestMovies?.items ?? []} isLoading={latestLoading} />
                </>
            )}
        </div>
    );
}

export default function SearchClient() {
    return (
        <Suspense fallback={
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                <div style={{ height: '40px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', marginBottom: '16px' }} />
            </div>
        }>
            <SearchClientInner />
        </Suspense>
    );
}
