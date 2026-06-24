'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Play, Search, X } from 'lucide-react';
import { useFavorites } from '~/hooks/useFavorites';
import FavoriteCard from '~/components/movie/FavoriteCard';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Badge } from '~/components/ui/badge';
import {
    PageContainer,
    PageHeaderBlock,
    PageTitleGroup,
    PageTitle,
    PageSubtitle,
    EmptyStateWrapper,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateDescription,
    NoResultsWrapper,
} from '~/styles/components/layout.styles';
import {
    MediaGrid,
    ToolbarRow,
    SearchFieldWrap,
    SearchIcon,
    ClearSearchButton,
    SortButtonGroup,
    SortButton,
} from '~/styles/components/movie.styles';

type SortOption = 'newest' | 'oldest' | 'title';

export default function FavoritesPage() {
    const { favorites, removeFavorite } = useFavorites();
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<SortOption>('newest');

    const filtered = favorites
        .filter((f) => f.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sort === 'newest') return b.addedAt - a.addedAt;
            if (sort === 'oldest') return a.addedAt - b.addedAt;
            return a.title.localeCompare(b.title, 'vi');
        });

    return (
        <PageContainer>
            <PageHeaderBlock>
                <PageTitleGroup>
                    <Heart size={24} color="#e50914" fill="#e50914" />
                    <PageTitle>Phim yêu thích</PageTitle>
                    <Badge variant="default" className="text-[13px] font-bold px-2.5 py-0.5">
                        {favorites.length}
                    </Badge>
                </PageTitleGroup>
                <PageSubtitle>Danh sách phim bạn đã lưu · Lưu trên thiết bị này</PageSubtitle>
            </PageHeaderBlock>

            {favorites.length > 0 && (
                <ToolbarRow>
                    <SearchFieldWrap>
                        <SearchIcon>
                            <Search size={14} />
                        </SearchIcon>
                        <Input
                            hasLeftIcon
                            hasRightIcon={!!search}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Lọc theo tên..."
                            className="h-9 text-[13px]"
                        />
                        {search && (
                            <ClearSearchButton type="button" onClick={() => setSearch('')}>
                                <X size={13} />
                            </ClearSearchButton>
                        )}
                    </SearchFieldWrap>

                    <SortButtonGroup>
                        {(
                            [
                                { key: 'newest', label: 'Mới nhất' },
                                { key: 'oldest', label: 'Cũ nhất' },
                                { key: 'title', label: 'Tên A-Z' },
                            ] as { key: SortOption; label: string }[]
                        ).map(({ key, label }) => (
                            <SortButton
                                key={key}
                                type="button"
                                $active={sort === key}
                                onClick={() => setSort(key)}
                            >
                                {label}
                            </SortButton>
                        ))}
                    </SortButtonGroup>
                </ToolbarRow>
            )}

            {favorites.length === 0 && (
                <EmptyStateWrapper className="py-[100px]">
                    <EmptyStateIcon>
                        <Heart size={36} color="#e50914" />
                    </EmptyStateIcon>
                    <EmptyStateTitle>Chưa có phim yêu thích</EmptyStateTitle>
                    <EmptyStateDescription>
                        Nhấn nút ❤ trên trang phim để lưu vào đây
                    </EmptyStateDescription>
                    <Button variant="gradient" asChild>
                        <Link href="/">
                            <Play size={16} fill="white" /> Khám phá phim
                        </Link>
                    </Button>
                </EmptyStateWrapper>
            )}

            {favorites.length > 0 && filtered.length === 0 && (
                <NoResultsWrapper>
                    <p className="mb-2">Không tìm thấy &ldquo;{search}&rdquo;</p>
                    <Button variant="link" size="sm" onClick={() => setSearch('')} className="text-[13px]">
                        Xóa bộ lọc
                    </Button>
                </NoResultsWrapper>
            )}

            {filtered.length > 0 && (
                <MediaGrid $minWidth="140px" $gap="14px">
                    {filtered.map((item) => (
                        <FavoriteCard key={item.id} item={item} onRemove={removeFavorite} />
                    ))}
                </MediaGrid>
            )}
        </PageContainer>
    );
}
