'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | '...')[] = [1];

    if (current > 3) pages.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - 2) pages.push('...');
    pages.push(total);

    return pages;
}

export default function Pagination({ page, totalPages, onPageChange, isLoading }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = getPageNumbers(page, totalPages);

    return (
        <div className="flex justify-center items-center gap-1.5 mt-8 flex-wrap">
            <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={page <= 1 || isLoading}
                onClick={() => onPageChange(page - 1)}
                aria-label="Trang trước"
            >
                <ChevronLeft size={16} />
            </Button>

            {pages.map((p, idx) =>
                p === '...' ? (
                    <span key={`ellipsis-${idx}`} className="text-text-muted px-1 text-sm">
                        ...
                    </span>
                ) : (
                    <Button
                        key={p}
                        type="button"
                        variant={p === page ? 'default' : 'outline'}
                        size="icon"
                        disabled={isLoading}
                        onClick={() => onPageChange(p)}
                        className={cn(p === page && 'font-semibold')}
                    >
                        {p}
                    </Button>
                ),
            )}

            <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={page >= totalPages || isLoading}
                onClick={() => onPageChange(page + 1)}
                aria-label="Trang sau"
            >
                <ChevronRight size={16} />
            </Button>
        </div>
    );
}
