'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import { useMovieSearch, useLatestMovies } from '~/hooks/useMovies';
import MovieGrid from '~/components/movie/MovieGrid';
import { MovieType, SearchParams } from '~/types/movie';

const GENRES = ['Hành động', 'Tình cảm', 'Hài hước', 'Kinh dị', 'Khoa học viễn tưởng', 'Hoạt hình', 'Tâm lý', 'Chiến tranh', 'Thể thao', 'Âm nhạc'];
const COUNTRIES = ['Việt Nam', 'Hàn Quốc', 'Nhật Bản', 'Trung Quốc', 'Mỹ', 'Thái Lan', 'Ấn Độ', 'Pháp', 'Anh', 'Đức'];
const YEARS = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

export default function SearchClient() {
    const searchParamsHook = useSearchParams();

    const [query, setQuery] = useState(searchParamsHook.get('q') ?? '');
    const [genre, setGenre] = useState(searchParamsHook.get('genre') ?? '');
    const [country, setCountry] = useState(searchParamsHook.get('country') ?? '');
    const [year, setYear] = useState(searchParamsHook.get('year') ?? '');
    const [type, setType] = useState<MovieType | ''>((searchParamsHook.get('type') as MovieType | null) ?? '');
    const [showFilters, setShowFilters] = useState(false);

    const debouncedQuery = useDebounce(query, 400);

    const searchParams: SearchParams = {
        q: debouncedQuery || undefined,
        genre: genre || undefined,
        country: country || undefined,
        year: year || undefined,
        type: (type || undefined) as MovieType | undefined,
        page: 1,
        limit: 24,
    };

    const hasFilters = !!(debouncedQuery || genre || country || year || type);
    const { data: searchResults, isLoading: searchLoading } = useMovieSearch(searchParams);
    const { data: latestMovies, isLoading: latestLoading } = useLatestMovies(1);

    const clearFilters = () => { setQuery(''); setGenre(''); setCountry(''); setYear(''); setType(''); };

    const selectStyle: React.CSSProperties = {
        width: '100%', padding: '10px 12px',
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer', outline: 'none',
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
            <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>
                {debouncedQuery ? `Kết quả tìm kiếm: "${debouncedQuery}"` : 'Tìm kiếm phim'}
            </h1>

            {/* Search bar */}
            <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#606070' }} />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm kiếm tên phim..."
                    style={{ width: '100%', padding: '14px 56px 14px 48px', background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '16px', outline: 'none' }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', padding: '6px 12px', background: showFilters ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: showFilters ? '#e50914' : '#a0a0b0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                >
                    <Filter size={14} /> Bộ lọc
                </button>
            </div>

            {/* Filters */}
            {showFilters && (
                <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#a0a0b0', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>THỂ LOẠI</label>
                            <select value={genre} onChange={(e) => setGenre(e.target.value)} style={selectStyle}>
                                <option value="">Tất cả</option>
                                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#a0a0b0', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>QUỐC GIA</label>
                            <select value={country} onChange={(e) => setCountry(e.target.value)} style={selectStyle}>
                                <option value="">Tất cả</option>
                                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#a0a0b0', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>NĂM</label>
                            <select value={year} onChange={(e) => setYear(e.target.value)} style={selectStyle}>
                                <option value="">Tất cả</option>
                                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#a0a0b0', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>LOẠI PHIM</label>
                            <select value={type} onChange={(e) => setType(e.target.value as MovieType | '')} style={selectStyle}>
                                <option value="">Tất cả</option>
                                <option value="movie">Phim lẻ</option>
                                <option value="series">Phim bộ</option>
                                <option value="anime">Anime</option>
                                <option value="tv-shows">TV Shows</option>
                            </select>
                        </div>
                    </div>
                    {(genre || country || year || type) && (
                        <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', color: '#e50914', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                            <X size={14} /> Xóa bộ lọc
                        </button>
                    )}
                </div>
            )}

            {/* Results */}
            {hasFilters ? (
                <>
                    <p style={{ color: '#a0a0b0', fontSize: '14px', marginBottom: '20px' }}>
                        {searchLoading ? 'Đang tìm kiếm...' : `Tìm thấy ${searchResults?.pagination.total ?? 0} kết quả`}
                    </p>
                    <MovieGrid movies={searchResults?.items ?? []} isLoading={searchLoading} />
                </>
            ) : (
                <>
                    <p style={{ color: '#a0a0b0', fontSize: '14px', marginBottom: '20px' }}>Phim mới cập nhật</p>
                    <MovieGrid movies={latestMovies?.items ?? []} isLoading={latestLoading} />
                </>
            )}
        </div>
    );
}
