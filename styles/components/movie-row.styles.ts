import styled, { keyframes } from 'styled-components';
import Link from 'next/link';

const shimmer = keyframes`
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
`;

export const RowSection = styled.section`
    margin-bottom: 32px;
`;

export const RowHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-right: 4px;
`;

export const RowTitleGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const RowAccentBar = styled.div<{ $color: string }>`
    width: 3px;
    height: 18px;
    background: ${({ $color }) => $color};
    border-radius: 2px;
    flex-shrink: 0;
`;

export const RowTitle = styled.h2`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: clamp(14px, 2vw, 18px);
    font-weight: 700;
    line-height: 1;
`;

export const RowViewAllLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 2px;
    color: ${({ theme }) => theme.colors.textMuted};
    text-decoration: none;
    font-size: 12px;
    flex-shrink: 0;
    transition: color 0.2s;
    white-space: nowrap;

    &:hover {
        color: ${({ theme }) => theme.colors.accentRed};
    }
`;

export const RowScrollWrap = styled.div`
    position: relative;
`;

export const RowScrollButton = styled.button`
    position: absolute;
    top: 35%;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    z-index: 10;
    background: rgba(20, 20, 30, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;

    &:hover {
        background: rgba(229, 9, 20, 0.8);
    }
`;

export const RowScrollButtonLeft = styled(RowScrollButton)`
    left: -12px;
`;

export const RowScrollButtonRight = styled(RowScrollButton)`
    right: -12px;
`;

export const RowScrollTrack = styled.div`
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 8px;
    padding-left: 2px;
    padding-right: 2px;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }
`;

export const RowCardSlot = styled.div`
    flex-shrink: 0;
    width: clamp(120px, 13vw, 170px);
`;

export const SkeletonPoster = styled.div`
    aspect-ratio: 2/3;
    border-radius: ${({ theme }) => theme.radii.md};
    background: linear-gradient(90deg, #1a1a2e 0%, #252535 50%, #1a1a2e 100%);
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
    margin-bottom: 8px;
`;

export const SkeletonTitle = styled.div<{ $width?: string }>`
    height: 10px;
    border-radius: 3px;
    background: ${({ theme }) => theme.colors.card};
    width: ${({ $width }) => $width ?? '70%'};
`;
