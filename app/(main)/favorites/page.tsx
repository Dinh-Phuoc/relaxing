'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, Play, Search, SortAsc, SortDesc, X } from 'lucide-react';
import { useFavorites, FavoriteItem } from '~/hooks/useFavorites';

type SortOption = 'newest' | 'oldest' | 'title';

export default function FavoritesPage() {
    const { favorites, removeFavorite } = useFavorites();
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<SortOption>('newest');
    const [hovered, setHovered] = useState<string | null>(null);

    const filtered = favorites
        .filter((f) => f.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sort === 'newest') return b.addedAt - a.addedAt;
            if (sort === 'oldest') return a.addedAt - b.addedAt;
            return a.title.localeCompare(b.title, 'vi');
        });

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(24px, 4vw, 48px) clamp(16px, 3vw, 28px)' }}>

            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <Heart size={24} color="#e50914" fill="#e50914" />
                    <h1 style={{ color: 'white', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700 }}>
                        Phim yêu thích
                    </h1>
                    <span style={{
                        background: 'rgba(229,9,20,0.15)', color: '#e50914',
                        padding: '3px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: 700,
                    }}>
                        {favorites.length}
                    </span>
                </div>
                <p style={{ color: '#606070', fontSize: '13px' }}>
                    Danh sách phim bạn đã lưu · Lưu trên thiết bị này
                </p>
            </div>

            {/* Toolbar */}
            {favorites.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Search */}
                    <div style={{ position: 'relative', flex: 1, minWidth: '180px', maxWidth: '360px' }}>
                        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#606070' }} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Lọc theo tên..."
                            style={{
                                width: '100%', padding: '9px 32px 9px 32px',
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none',
                            }}
                            onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#606070', cursor: 'pointer', padding: '2px' }}>
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {([
                            { key: 'newest', label: 'Mới nhất' },
                            { key: 'oldest', label: 'Cũ nhất' },
                            { key: 'title', label: 'Tên A-Z' },
                        ] as { key: SortOption; label: string }[]).map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setSort(key)}
                                style={{
                                    padding: '8px 12px', borderRadius: '7px', cursor: 'pointer',
                                    fontSize: '12px', fontWeight: 500, border: '1px solid', transition: 'all 0.15s',
                                    background: sort === key ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.05)',
                                    borderColor: sort === key ? 'rgba(229,9,20,0.4)' : 'rgba(255,255,255,0.1)',
                                    color: sort === key ? '#fff' : '#a0a0b0',
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {favorites.length === 0 && (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(229,9,20,0.08)', border: '2px solid rgba(229,9,20,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <Heart size={36} color="#e50914" />
                    </div>
                    <p style={{ color: '#a0a0b0', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                        Chưa có phim yêu thích
                    </p>
                    <p style={{ color: '#606070', fontSize: '14px', marginBottom: '24px' }}>
                        Nhấn nút ❤ trên trang phim để lưu vào đây
                    </p>
                    <Link
                        href="/"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 24px', borderRadius: '8px', background: 'linear-gradient(135deg, #e50914, #b20710)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}
                    >
                        <Play size={16} fill="white" /> Khám phá phim
                    </Link>
                </div>
            )}

            {/* No search results */}
            {favorites.length > 0 && filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#606070' }}>
                    <p style={{ marginBottom: '8px' }}>Không tìm thấy &ldquo;{search}&rdquo;</p>
                    <button onClick={() => setSearch('')} style={{ color: '#e50914', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Xóa bộ lọc</button>
                </div>
            )}

            {/* Grid */}
            {filtered.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '14px',
                }}>
                    {filtered.map((item) => (
                        <FavoriteCard
                            key={item.id}
                            item={item}
                            isHovered={hovered === item.id}
                            onHover={(id) => setHovered(id)}
                            onRemove={removeFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function FavoriteCard({
    item, isHovered, onHover, onRemove,
}: {
    item: FavoriteItem;
    isHovered: boolean;
    onHover: (id: string | null) => void;
    onRemove: (id: string) => void;
}) {
    return (
        <div
            style={{ position: 'relative' }}
            onMouseEnter={() => onHover(item.id)}
            onMouseLeave={() => onHover(null)}
        >
            {/* Poster */}
            <Link href={`/movie/${item.slug}?source=${item.source}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{
                    aspectRatio: '2/3', borderRadius: '8px', overflow: 'hidden',
                    background: '#1a1a2e', marginBottom: '8px', position: 'relative',
                    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                    boxShadow: isHovered ? '0 10px 28px rgba(0,0,0,0.6)' : '0 3px 10px rgba(0,0,0,0.3)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}>
                    <Image
                        src={item.poster}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 140px, 170px"
                    />

                    {/* Overlay on hover */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: isHovered ? 'rgba(0,0,0,0.4)' : 'transparent',
                        transition: 'background 0.25s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {isHovered && (
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: 'rgba(229,9,20,0.9)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Play size={17} color="white" fill="white" style={{ marginLeft: '2px' }} />
                            </div>
                        )}
                    </div>

                    {/* Year badge */}
                    {item.year && (
                        <div style={{ position: 'absolute', bottom: '6px', left: '6px' }}>
                            <span style={{ background: 'rgba(0,0,0,0.7)', color: '#a0a0b0', fontSize: '9px', padding: '2px 5px', borderRadius: '3px' }}>
                                {item.year}
                            </span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <p style={{
                    color: isHovered ? '#ffffff' : '#c0c0d0',
                    fontSize: '12px', fontWeight: 500, lineHeight: '1.4',
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                    transition: 'color 0.2s', minHeight: '32px',
                }}>
                    {item.title}
                </p>
            </Link>

            {/* Remove button — chỉ hiện khi hover */}
            <button
                onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                title="Bỏ yêu thích"
                style={{
                    position: 'absolute', top: '6px', right: '6px',
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: 'rgba(10,10,15,0.85)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#e50914', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,9,20,0.85)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(10,10,15,0.85)')}
            >
                <Trash2 size={12} />
            </button>
        </div>
    );
}
