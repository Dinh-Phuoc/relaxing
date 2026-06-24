'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

    const btnBase: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '36px',
        height: '36px',
        padding: '0 8px',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.04)',
        color: '#a0a0b0',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s',
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '32px', flexWrap: 'wrap' }}>
            <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => onPageChange(page - 1)}
                style={{ ...btnBase, opacity: page <= 1 || isLoading ? 0.4 : 1, cursor: page <= 1 || isLoading ? 'not-allowed' : 'pointer' }}
                aria-label="Trang trước"
            >
                <ChevronLeft size={16} />
            </button>

            {pages.map((p, idx) =>
                p === '...' ? (
                    <span key={`ellipsis-${idx}`} style={{ color: '#606070', padding: '0 4px', fontSize: '13px' }}>...</span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        disabled={isLoading}
                        onClick={() => onPageChange(p)}
                        style={{
                            ...btnBase,
                            background: p === page ? 'rgba(229,9,20,0.25)' : btnBase.background,
                            borderColor: p === page ? 'rgba(229,9,20,0.5)' : 'rgba(255,255,255,0.1)',
                            color: p === page ? '#fff' : '#a0a0b0',
                            fontWeight: p === page ? 600 : 500,
                        }}
                    >
                        {p}
                    </button>
                ),
            )}

            <button
                type="button"
                disabled={page >= totalPages || isLoading}
                onClick={() => onPageChange(page + 1)}
                style={{ ...btnBase, opacity: page >= totalPages || isLoading ? 0.4 : 1, cursor: page >= totalPages || isLoading ? 'not-allowed' : 'pointer' }}
                aria-label="Trang sau"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
