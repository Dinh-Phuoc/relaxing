import styled from 'styled-components';
import Link from 'next/link';

export const HeroRoot = styled.div`
    position: relative;
    width: 100%;
    overflow: hidden;
    background: ${({ theme }) => theme.colors.background};
`;

export const HeroBackdrop = styled.div<{ $fading?: boolean }>`
    position: absolute;
    inset: 0;
    opacity: ${({ $fading }) => ($fading ? 0 : 1)};
    transition: opacity 0.3s ease;
    z-index: 0;
`;

export const HeroGradient = styled.div`
    position: absolute;
    inset: 0;
    background:
        linear-gradient(
            to right,
            rgba(10, 10, 15, 0.95) 0%,
            rgba(10, 10, 15, 0.7) 50%,
            rgba(10, 10, 15, 0.2) 100%
        ),
        linear-gradient(
            to top,
            rgba(10, 10, 15, 1) 0%,
            rgba(10, 10, 15, 0.3) 40%,
            transparent 70%
        );
`;

export const HeroContent = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: clamp(320px, 56vw, 620px);
    padding: clamp(60px, 8vw, 90px) clamp(16px, 3vw, 40px) 0;
    max-width: ${({ theme }) => theme.spacing.pageMaxWidth};
    margin: 0 auto;
`;

export const HeroInfo = styled.div<{ $fading?: boolean }>`
    max-width: min(540px, 90vw);
    opacity: ${({ $fading }) => ($fading ? 0 : 1)};
    transform: ${({ $fading }) => ($fading ? 'translateY(8px)' : 'translateY(0)')};
    transition: opacity 0.3s ease, transform 0.3s ease;
    padding-bottom: clamp(48px, 8vw, 72px);
`;

export const HeroBadgeRow = styled.div`
    display: flex;
    gap: 6px;
    margin-bottom: 10px;
    flex-wrap: wrap;
`;

export const HeroQualityBadge = styled.span`
    background: ${({ theme }) => theme.colors.accentRed};
    color: ${({ theme }) => theme.colors.textPrimary};
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 700;
`;

export const HeroGenreBadge = styled.span`
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.8);
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 11px;
    backdrop-filter: blur(4px);
`;

export const HeroYearBadge = styled.span`
    background: rgba(255, 255, 255, 0.08);
    color: ${({ theme }) => theme.colors.textSecondary};
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 11px;
`;

export const HeroTitle = styled.h1`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: clamp(18px, 4.5vw, 44px);
    font-weight: 800;
    line-height: 1.15;
    margin-bottom: 6px;
    text-shadow: 0 2px 16px rgba(0, 0, 0, 0.6);
`;

export const HeroOriginalTitle = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: clamp(12px, 1.8vw, 15px);
    margin-bottom: 10px;
`;

export const HeroDescription = styled.p`
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 13px;
    line-height: 1.7;
    margin-bottom: 20px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

export const HeroActions = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

export const HeroWatchLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 7px;
    padding: clamp(9px, 1.5vw, 13px) clamp(16px, 2.5vw, 24px);
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.gradients.accent};
    color: ${({ theme }) => theme.colors.textPrimary};
    text-decoration: none;
    font-weight: 700;
    font-size: clamp(13px, 1.8vw, 15px);
    box-shadow: 0 4px 16px rgba(229, 9, 20, 0.4);
    white-space: nowrap;
`;

export const HeroDetailLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 7px;
    padding: clamp(9px, 1.5vw, 13px) clamp(14px, 2vw, 20px);
    border-radius: ${({ theme }) => theme.radii.md};
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: ${({ theme }) => theme.colors.textPrimary};
    text-decoration: none;
    font-weight: 600;
    font-size: clamp(13px, 1.8vw, 15px);
    backdrop-filter: blur(8px);
    white-space: nowrap;
`;

export const HeroDots = styled.div`
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    padding: 12px 16px 16px;
    background: linear-gradient(to bottom, transparent, rgba(10, 10, 15, 0.8));
`;

export const HeroDot = styled.button<{ $active?: boolean }>`
    width: ${({ $active }) => ($active ? '20px' : '6px')};
    height: 6px;
    border-radius: 3px;
    border: none;
    cursor: pointer;
    padding: 0;
    background: ${({ $active, theme }) =>
        $active ? theme.colors.accentRed : 'rgba(255, 255, 255, 0.3)'};
    transition: all 0.3s ease;
`;

export const HeroNavButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-60%);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.55);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    transition: background 0.2s;

    &:hover {
        background: rgba(229, 9, 20, 0.6);
    }
`;

export const HeroNavButtonLeft = styled(HeroNavButton)`
    left: 10px;
`;

export const HeroNavButtonRight = styled(HeroNavButton)`
    right: 10px;
`;

export const HeroLoadingPlaceholder = styled.div`
    height: clamp(280px, 55vw, 600px);
    background: linear-gradient(135deg, #0a0a0f, #1a1a2e);
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const HomeSectionsContainer = styled.div`
    max-width: ${({ theme }) => theme.spacing.pageMaxWidth};
    margin: 0 auto;
    padding: clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px) 0;
`;
