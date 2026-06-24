import styled, { css, keyframes } from 'styled-components';
import Link from 'next/link';

const shimmer = keyframes`
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
`;

export const MediaGrid = styled.div<{ $minWidth?: string; $gap?: string }>`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(${({ $minWidth }) => $minWidth ?? '240px'}, 1fr));
    gap: ${({ $gap }) => $gap ?? '16px'};
`;

export const PosterCard = styled.div<{ $hovered?: boolean }>`
    background: ${({ theme }) => theme.colors.surface};
    border-radius: ${({ theme }) => theme.radii.xl};
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.colors.border};
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    transform: ${({ $hovered }) => ($hovered ? 'translateY(-4px)' : 'translateY(0)')};
    box-shadow: ${({ $hovered, theme }) => ($hovered ? theme.shadows.cardHover : 'none')};
`;

export const PosterImageWrap = styled.div<{ $aspectRatio?: string }>`
    position: relative;
    aspect-ratio: ${({ $aspectRatio }) => $aspectRatio ?? '16/9'};
`;

export const PosterOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.colors.overlay};
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const PlayButton = styled.div<{ $size?: number }>`
    width: ${({ $size }) => $size ?? 40}px;
    height: ${({ $size }) => $size ?? 40}px;
    border-radius: 50%;
    background: rgba(229, 9, 20, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ProgressTrack = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.2);
`;

export const ProgressBar = styled.div<{ $percent: number }>`
    height: 100%;
    background: ${({ theme }) => theme.colors.accentRed};
    width: ${({ $percent }) => Math.min($percent, 100)}%;
`;

export const CardBody = styled.div`
    padding: 12px;
`;

export const CardTitle = styled.p`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const CardMeta = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    margin-bottom: 4px;
`;

export const CardDate = styled.p`
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 11px;
`;

export const CardLink = styled(Link)`
    text-decoration: none;
    display: block;
`;

export const CardItemWrap = styled.div`
    position: relative;
`;

export const IconRemoveButton = styled.button`
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.65);
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;

    &:hover {
        background: rgba(229, 9, 20, 0.85);
    }
`;

export const MoviePosterLink = styled(Link)`
    display: block;
    text-decoration: none;
    flex-shrink: 0;
    width: 100%;
`;

export const MoviePosterCard = styled.div<{ $hovered?: boolean }>`
    position: relative;
    aspect-ratio: 2/3;
    border-radius: ${({ theme }) => theme.radii.md};
    overflow: hidden;
    background: ${({ theme }) => theme.colors.card};
    transform: ${({ $hovered }) => ($hovered ? 'scale(1.03)' : 'scale(1)')};
    box-shadow: ${({ $hovered, theme }) =>
        $hovered ? theme.shadows.posterHover : '0 2px 8px rgba(0,0,0,0.3)'};
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    margin-bottom: 8px;
    cursor: pointer;
`;

export const MoviePosterOverlay = styled.div<{ $hovered?: boolean }>`
    position: absolute;
    inset: 0;
    background: ${({ $hovered }) => ($hovered ? 'rgba(0,0,0,0.3)' : 'transparent')};
    transition: background 0.25s ease;
`;

export const MoviePosterPlay = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(229, 9, 20, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px rgba(229, 9, 20, 0.5);
`;

export const MovieBadgeRow = styled.div`
    position: absolute;
    top: 6px;
    left: 6px;
    display: flex;
    gap: 3px;
`;

export const MovieTitle = styled.p<{ $hovered?: boolean }>`
    color: ${({ $hovered, theme }) => ($hovered ? theme.colors.textPrimary : theme.colors.textSoft)};
    font-size: 12px;
    font-weight: 500;
    line-height: 1.4;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    transition: color 0.2s;
    min-height: 32px;
`;

export const PosterPlaceholder = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #111;
`;

export const PosterGradient = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.gradients.posterBottom};
    padding: 20px 8px 6px;
`;

export const ToolbarRow = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
    flex-wrap: wrap;
    align-items: center;
`;

export const SearchFieldWrap = styled.div`
    position: relative;
    flex: 1;
    min-width: 180px;
    max-width: 360px;
`;

export const SearchIcon = styled.div`
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textMuted};
    pointer-events: none;
    display: flex;
`;

export const ClearSearchButton = styled.button`
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: pointer;
    padding: 2px;
    display: flex;
`;

export const SortButtonGroup = styled.div`
    display: flex;
    gap: 6px;
`;

export const sortButtonStyles = css<{ $active?: boolean }>`
    padding: 8px 12px;
    border-radius: 7px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid;
    transition: all 0.15s;
    background: ${({ $active }) => ($active ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.05)')};
    border-color: ${({ $active }) => ($active ? 'rgba(229,9,20,0.4)' : 'rgba(255,255,255,0.1)')};
    color: ${({ $active, theme }) => ($active ? theme.colors.textPrimary : theme.colors.textSecondary)};
`;

export const SortButton = styled.button<{ $active?: boolean }>`
    ${sortButtonStyles}
`;

export const HoverPosterOverlay = styled.div<{ $hovered?: boolean }>`
    position: absolute;
    inset: 0;
    background: ${({ $hovered }) => ($hovered ? 'rgba(0,0,0,0.4)' : 'transparent')};
    transition: background 0.25s;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const YearBadgeBottom = styled.div`
    position: absolute;
    bottom: 6px;
    left: 6px;
`;

export const MovieGridWrap = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
`;

export const MovieGridSkeletonWrap = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
`;

export const MovieCardSkeletonRoot = styled.div`
    border-radius: ${({ theme }) => theme.radii.lg};
    overflow: hidden;
    background: ${({ theme }) => theme.colors.card};
    aspect-ratio: 2/3;
    position: relative;
`;

export const MovieCardSkeletonShimmer = styled.div`
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, #1a1a2e 0%, #252535 50%, #1a1a2e 100%);
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
`;

export const PlayIconOffset = styled.span`
    margin-left: 2px;
`;

export const FavoriteRemoveButton = styled.button<{ $visible?: boolean }>`
    position: absolute;
    top: 6px;
    right: 6px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: rgba(10, 10, 15, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: ${({ theme }) => theme.colors.accentRed};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transition: opacity 0.2s, background 0.2s;

    &:hover {
        background: rgba(229, 9, 20, 0.85);
    }
`;
