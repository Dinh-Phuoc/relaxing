'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Play, Trash2 } from 'lucide-react';
import { useWatchHistory } from '~/hooks/useWatchHistory';

export default function HistoryPage() {
    const { history, removeHistory, clearHistory } = useWatchHistory();

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 24px' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '32px',
                    flexWrap: 'wrap',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Clock size={24} color="#e50914" />
                    <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>Lịch sử xem</h1>
                </div>
                {history.length > 0 && (
                    <button
                        type="button"
                        onClick={clearHistory}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'transparent',
                            color: '#e57080',
                            fontSize: '13px',
                            cursor: 'pointer',
                        }}
                    >
                        <Trash2 size={14} />
                        Xóa tất cả
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <Clock size={48} color="#3a3a4a" style={{ margin: '0 auto 16px' }} />
                    <p style={{ color: '#606070', fontSize: '16px', marginBottom: '16px' }}>Chưa có lịch sử xem</p>
                    <Link href="/" style={{ color: '#e50914', textDecoration: 'none' }}>
                        Xem phim ngay →
                    </Link>
                </div>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '16px',
                    }}
                >
                    {history.map((item) => {
                        const progress = item.durationSeconds
                            ? (item.progressSeconds / item.durationSeconds) * 100
                            : 0;
                        const watchHref = item.episodeSlug
                            ? `/watch/${item.slug}?source=${item.source}&ep=${item.episodeSlug}&server=${item.serverIndex ?? 0}`
                            : `/watch/${item.slug}?source=${item.source}`;

                        return (
                            <div key={item.id} style={{ position: 'relative' }}>
                                <Link
                                    href={watchHref}
                                    style={{ textDecoration: 'none', display: 'block' }}
                                >
                                    <div
                                        style={{
                                            background: '#111118',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                                            <Image
                                                src={item.poster}
                                                alt={item.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                sizes="240px"
                                            />
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'rgba(0,0,0,0.4)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        background: 'rgba(229,9,20,0.9)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Play size={18} color="white" fill="white" />
                                                </div>
                                            </div>
                                            {progress > 0 && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: '3px',
                                                        background: 'rgba(255,255,255,0.2)',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            height: '100%',
                                                            background: '#e50914',
                                                            width: `${Math.min(progress, 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ padding: '12px' }}>
                                            <p
                                                style={{
                                                    color: 'white',
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    marginBottom: '4px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {item.title}
                                            </p>
                                            {item.episodeName && (
                                                <p
                                                    style={{
                                                        color: '#a0a0b0',
                                                        fontSize: '12px',
                                                        marginBottom: '4px',
                                                    }}
                                                >
                                                    {item.episodeName}
                                                </p>
                                            )}
                                            <p style={{ color: '#606070', fontSize: '11px' }}>
                                                {new Date(item.lastWatchedAt).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => removeHistory(item.id)}
                                    title="Xóa khỏi lịch sử"
                                    style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        border: 'none',
                                        background: 'rgba(0,0,0,0.65)',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
