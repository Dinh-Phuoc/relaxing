import React from 'react';
import WatchClient from '~/features/movie/components/WatchClient';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ source?: string; ep?: string; server?: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    return { title: `Xem ${slug} | CineHub` };
}

export default async function WatchPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { source, ep, server } = await searchParams;
    return <WatchClient slug={slug} source={source} initialEp={ep} initialServer={server ? parseInt(server) : 0} />;
}
