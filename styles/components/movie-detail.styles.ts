import styled from 'styled-components';
import Link from 'next/link';

export const DetailPage = styled.div`
    min-height: 100vh;
`;

export const BackdropSection = styled.div<{ $height: string }>`
    position: relative;
    height: ${({ $height }) => $height};
    overflow: hidden;
`;

export const BackdropGradient = styled.div`
    position: absolute;
    inset: 0;
    background: linear-gradient(
        to bottom,
        rgba(10, 10, 15, 0.2) 0%,
        rgba(10, 10, 15, 0.6) 50%,
        rgba(10, 10, 15, 1) 100%
    );
`;

export const DetailContainer = styled.div<{ $isMobile?: boolean }>`
    max-width: ${({ theme }) => theme.spacing.pageMaxWidth};
    margin: 0 auto;
    padding: ${({ $isMobile }) => ($isMobile ? '0 16px' : '0 24px')};
`;

export const HeroGrid = styled.div<{ $isSingleColumn?: boolean }>`
    display: grid;
    grid-template-columns: ${({ $isSingleColumn }) => ($isSingleColumn ? '1fr' : '200px 1fr')};
    gap: 32px;
    margin-top: ${({ $isSingleColumn }) => ($isSingleColumn ? '-80px' : '-180px')};
    position: relative;
    z-index: 10;
    align-items: start;
`;

export const PosterColumn = styled.div`
    width: 200px;
    flex-shrink: 0;
`;

export const PosterFrame = styled.div`
    border-radius: ${({ theme }) => theme.radii.xl};
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    border: 2px solid rgba(255, 255, 255, 0.1);
    aspect-ratio: 2/3;
    position: relative;
`;

export const InfoColumn = styled.div<{ $isSingleColumn?: boolean }>`
    padding-top: ${({ $isSingleColumn }) => ($isSingleColumn ? '0' : '120px')};
`;

export const GenreRow = styled.div`
    display: flex;
    gap: 6px;
    margin-bottom: 10px;
    flex-wrap: wrap;
`;

export const GenreLink = styled(Link)`
    background: rgba(229, 9, 20, 0.12);
    border: 1px solid rgba(229, 9, 20, 0.25);
    color: ${({ theme }) => theme.colors.error};
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    text-decoration: none;
`;

export const DetailTitle = styled.h1<{ $isMobile?: boolean; $isTablet?: boolean }>`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ $isMobile, $isTablet }) =>
        $isMobile ? '22px' : $isTablet ? '28px' : '36px'};
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 6px;
`;

export const OriginalTitle = styled.p<{ $isMobile?: boolean }>`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '15px')};
    margin-bottom: 12px;
`;

export const MetaRow = styled.div<{ $isMobile?: boolean }>`
    display: flex;
    gap: ${({ $isMobile }) => ($isMobile ? '12px' : '20px')};
    flex-wrap: wrap;
    margin-bottom: 16px;
`;

export const MetaItem = styled.span`
    display: flex;
    align-items: center;
    gap: 5px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 13px;
`;

export const MetaRating = styled(MetaItem)`
    color: ${({ theme }) => theme.colors.accentGold};
`;

export const QualityBadge = styled.span`
    background: ${({ theme }) => theme.colors.accentRed};
    color: ${({ theme }) => theme.colors.textPrimary};
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
`;

export const StatusBadge = styled.span<{ $completed?: boolean }>`
    background: ${({ $completed }) =>
        $completed ? 'rgba(34,197,94,0.15)' : 'rgba(249,115,22,0.15)'};
    color: ${({ $completed }) => ($completed ? '#22c55e' : '#f97316')};
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
`;

export const ActionRow = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    align-items: center;
`;

export const WatchLink = styled(Link)<{ $isMobile?: boolean }>`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: ${({ $isMobile }) => ($isMobile ? '10px 20px' : '12px 24px')};
    border-radius: ${({ theme }) => theme.radii.lg};
    background: ${({ theme }) => theme.gradients.accent};
    color: ${({ theme }) => theme.colors.textPrimary};
    text-decoration: none;
    font-weight: 700;
    font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
    box-shadow: 0 4px 20px rgba(229, 9, 20, 0.4);
`;

export const FavoriteButton = styled.button<{ $favorited?: boolean }>`
    width: 44px;
    height: 44px;
    border-radius: ${({ theme }) => theme.radii.lg};
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ $favorited }) =>
        $favorited ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.08)'};
    border: 1px solid
        ${({ $favorited }) =>
            $favorited ? 'rgba(229,9,20,0.5)' : 'rgba(255,255,255,0.15)'};
    color: ${({ $favorited, theme }) => ($favorited ? theme.colors.accentRed : theme.colors.textSecondary)};
    cursor: pointer;
    transition: all 0.2s;
`;

export const DescriptionBlock = styled.div`
    margin-bottom: 20px;
`;

export const DescriptionText = styled.p<{ $expanded?: boolean }>`
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 13px;
    line-height: 1.8;
    overflow: ${({ $expanded }) => ($expanded ? 'visible' : 'hidden')};
    display: ${({ $expanded }) => ($expanded ? 'block' : '-webkit-box')};
    -webkit-line-clamp: ${({ $expanded }) => ($expanded ? 'unset' : 3)};
    -webkit-box-orient: vertical;
`;

export const ToggleDescButton = styled.button`
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${({ theme }) => theme.colors.accentRed};
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13px;
    margin-top: 6px;
`;

export const CastRow = styled.div`
    margin-bottom: 10px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
`;

export const CastLabel = styled.span`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
`;

export const CastText = styled.p`
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 12px;
    margin: 0;
`;

export const DirectorRow = styled.div`
    margin-bottom: 10px;
`;

export const DirectorLabel = styled.span`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 600;
`;

export const DirectorText = styled.span`
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 12px;
`;

export const EpisodesSection = styled.div`
    margin-top: 40px;
`;

export const SectionTitle = styled.h2<{ $isMobile?: boolean }>`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const SectionAccentBar = styled.div`
    width: 4px;
    height: 22px;
    background: ${({ theme }) => theme.colors.accentRed};
    border-radius: 2px;
`;

export const EpisodeGroupBlock = styled.div`
    margin-bottom: 20px;
`;

export const EpisodeGroupTitle = styled.h3`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 13px;
    margin-bottom: 10px;
    font-weight: 600;
`;

export const EpisodeLinkRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
`;

export const EpisodeLink = styled(Link)<{ $isMobile?: boolean }>`
    padding: ${({ $isMobile }) => ($isMobile ? '7px 12px' : '8px 16px')};
    border-radius: 7px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.colors.textSoft};
    text-decoration: none;
    font-size: 12px;
    font-weight: 500;
    min-width: 52px;
    text-align: center;
    transition: all 0.15s;

    &:hover {
        background: rgba(229, 9, 20, 0.2);
        border-color: rgba(229, 9, 20, 0.4);
        color: ${({ theme }) => theme.colors.textPrimary};
    }
`;

export const ShowMoreEpButton = styled.button`
    padding: 8px 16px;
    border-radius: 7px;
    background: rgba(229, 9, 20, 0.15);
    border: 1px solid rgba(229, 9, 20, 0.3);
    color: ${({ theme }) => theme.colors.accentRed};
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
`;

export const RelatedSection = styled.div`
    margin-top: 40px;
`;
