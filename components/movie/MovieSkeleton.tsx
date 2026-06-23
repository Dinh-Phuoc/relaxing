'use client';

import React from 'react';

export function MovieCardSkeleton() {
    return (
        <div style={{
            borderRadius: '10px', overflow: 'hidden',
            background: '#1a1a2e', aspectRatio: '2/3',
            position: 'relative',
        }}>
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, #1a1a2e 0%, #252535 50%, #1a1a2e 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
            }} />
            <style>{`@keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }`}</style>
        </div>
    );
}

export function MovieGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
            {Array.from({ length: count }).map((_, i) => (
                <MovieCardSkeleton key={i} />
            ))}
        </div>
    );
}
