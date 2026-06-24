'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Play, Trash2 } from 'lucide-react';
import { useWatchHistory } from '~/hooks/useWatchHistory';
import { Button } from '~/components/ui/button';
import {
    PageContainer,
    PageHeaderRow,
    PageTitleGroup,
    PageTitle,
    EmptyStateWrapper,
    EmptyStateIcon,
    AccentLink,
} from '~/styles/components/layout.styles';
import {
    MediaGrid,
    PosterCard,
    PosterImageWrap,
    PosterOverlay,
    PlayButton,
    ProgressTrack,
    ProgressBar,
    CardBody,
    CardTitle,
    CardMeta,
    CardDate,
    CardLink,
    CardItemWrap,
    IconRemoveButton,
} from '~/styles/components/movie.styles';

export default function HistoryPage() {
    const { history, removeHistory, clearHistory } = useWatchHistory();

    return (
        <PageContainer>
            <PageHeaderRow>
                <PageTitleGroup>
                    <Clock size={24} color="#e50914" />
                    <PageTitle>Lịch sử xem</PageTitle>
                </PageTitleGroup>
                {history.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearHistory} className="text-error">
                        <Trash2 size={14} />
                        Xóa tất cả
                    </Button>
                )}
            </PageHeaderRow>

            {history.length === 0 ? (
                <EmptyStateWrapper>
                    <EmptyStateIcon>
                        <Clock size={48} color="#3a3a4a" />
                    </EmptyStateIcon>
                    <p className="text-text-muted text-base mb-4">Chưa có lịch sử xem</p>
                    <AccentLink href="/">Xem phim ngay →</AccentLink>
                </EmptyStateWrapper>
            ) : (
                <MediaGrid>
                    {history.map((item) => {
                        const progress = item.durationSeconds
                            ? (item.progressSeconds / item.durationSeconds) * 100
                            : 0;
                        const watchHref = item.episodeSlug
                            ? `/watch/${item.slug}?source=${item.source}&ep=${item.episodeSlug}&server=${item.serverIndex ?? 0}`
                            : `/watch/${item.slug}?source=${item.source}`;

                        return (
                            <CardItemWrap key={item.id}>
                                <CardLink href={watchHref}>
                                    <PosterCard>
                                        <PosterImageWrap>
                                            <Image
                                                src={item.poster}
                                                alt={item.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                sizes="240px"
                                            />
                                            <PosterOverlay>
                                                <PlayButton>
                                                    <Play size={18} color="white" fill="white" />
                                                </PlayButton>
                                            </PosterOverlay>
                                            {progress > 0 && (
                                                <ProgressTrack>
                                                    <ProgressBar $percent={progress} />
                                                </ProgressTrack>
                                            )}
                                        </PosterImageWrap>
                                        <CardBody>
                                            <CardTitle>{item.title}</CardTitle>
                                            {item.episodeName && <CardMeta>{item.episodeName}</CardMeta>}
                                            <CardDate>
                                                {new Date(item.lastWatchedAt).toLocaleDateString('vi-VN')}
                                            </CardDate>
                                        </CardBody>
                                    </PosterCard>
                                </CardLink>
                                <IconRemoveButton
                                    type="button"
                                    onClick={() => removeHistory(item.id)}
                                    title="Xóa khỏi lịch sử"
                                >
                                    <Trash2 size={13} />
                                </IconRemoveButton>
                            </CardItemWrap>
                        );
                    })}
                </MediaGrid>
            )}
        </PageContainer>
    );
}
