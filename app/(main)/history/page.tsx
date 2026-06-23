'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Clock, Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '~/stores/auth.store';
import apiClient from '~/lib/axios/client';

interface HistoryItem {
    _id: string;
    slug: string;
    source: string;
    title: string;
    poster: string;
    episodeName?: string;
    progressSeconds: number;
    durationSeconds?: number;
    lastWatchedAt: string;
    completed: boolean;
}

export default function HistoryPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => { if (!isAuthenticated) router.push('/login'); }, [isAuthenticated, router]);

    const { data, isLoading } = useQuery({
        queryKey: ['watch-history'],
        queryFn: async () => {
            const { data } = await apiClient.get('/watch-history?limit=50');
            return data.data.items as HistoryItem[];
        },
        enabled: isAuthenticated,
    });

    if (!isAuthenticated) return null;

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <Clock size={24} color="#e50914" />
                <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>Lịch sử xem</h1>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(229,9,20,0.3)', borderTopColor: '#e50914', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
            ) : !data?.length ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <Clock size={48} color="#3a3a4a" style={{ margin: '0 auto 16px' }} />
                    <p style={{ color: '#606070', fontSize: '16px', marginBottom: '16px' }}>Chưa có lịch sử xem</p>
                    <Link href="/" style={{ color: '#e50914', textDecoration: 'none' }}>Xem phim ngay →</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                    {data.map((item) => {
                        const progress = item.durationSeconds ? (item.progressSeconds / item.durationSeconds) * 100 : 0;
                        return (
                            <Link key={item._id} href={`/watch/${item.slug}?source=${item.source}`} style={{ textDecoration: 'none', display: 'block' }}>
                                <div
                                    style={{ background: '#111118', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.4)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                                        <Image src={item.poster} alt={item.title} fill style={{ objectFit: 'cover' }} sizes="240px" />
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(229,9,20,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Play size={18} color="white" fill="white" />
                                            </div>
                                        </div>
                                        {progress > 0 && (
                                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.2)' }}>
                                                <div style={{ height: '100%', background: '#e50914', width: `${Math.min(progress, 100)}%` }} />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '12px' }}>
                                        <p style={{ color: 'white', fontSize: '14px', fontWeight: 600, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                                        {item.episodeName && <p style={{ color: '#a0a0b0', fontSize: '12px', marginBottom: '4px' }}>{item.episodeName}</p>}
                                        <p style={{ color: '#606070', fontSize: '11px' }}>{new Date(item.lastWatchedAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
