import React, { Suspense } from 'react';
import SearchClient from '~/features/search/components/SearchClient';

export const metadata = { title: 'Tìm kiếm phim | CineHub' };

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <SearchClient />
        </Suspense>
    );
}
