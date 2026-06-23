import React, { Suspense } from 'react';
import SearchClient from '~/features/search/components/SearchClient';

export const metadata = { title: 'Tìm kiếm phim | CineHub' };

export default function SearchPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0f' }} />}>
            <SearchClient />
        </Suspense>
    );
}
