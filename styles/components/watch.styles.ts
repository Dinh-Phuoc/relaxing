import styled from 'styled-components';
import Link from 'next/link';

export const WatchPageContainer = styled.div<{ $isMobile?: boolean }>`
    max-width: ${({ theme }) => theme.spacing.pageMaxWidth};
    margin: 0 auto;
    padding: ${({ $isMobile }) => ($isMobile ? '12px' : '20px 24px')};
    overflow-x: hidden;
`;

export const WatchBackLink = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    font-size: 13px;
    margin-bottom: 14px;
`;

export const WatchBackTitle = styled.span<{ $isMobile?: boolean }>`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: ${({ $isMobile }) => ($isMobile ? '180px' : '500px')};
`;

export const WatchLayout = styled.div<{ $isMobile?: boolean }>`
    display: grid;
    grid-template-columns: ${({ $isMobile }) => ($isMobile ? '1fr' : 'minmax(0, 1fr) 280px')};
    gap: 16px;
    align-items: start;
    min-width: 0;
`;

export const WatchMainColumn = styled.div`
    min-width: 0;
`;

export const PlayerWrapper = styled.div`
    position: relative;
    padding-top: 56.25%;
    border-radius: ${({ theme }) => theme.radii.lg};
    overflow: hidden;
    background: #000;
    margin-bottom: 14px;
`;

export const PlayerIframe = styled.iframe`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
`;

export const PlayerPlaceholder = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #111;
    flex-direction: column;
    gap: 10px;
    color: ${({ theme }) => theme.colors.textMuted};
`;

export const PlayerPlaceholderIcon = styled.span`
    font-size: 36px;
`;

export const PlayerPlaceholderText = styled.p`
    font-size: 13px;
`;

export const WatchTitleBlock = styled.div`
    margin-bottom: 14px;
`;

export const WatchTitle = styled.h1<{ $isMobile?: boolean }>`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ $isMobile }) => ($isMobile ? '15px' : '18px')};
    font-weight: 700;
    margin-bottom: 4px;
    line-height: 1.3;
`;

export const WatchEpisodeLabel = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
`;

export const WatchEpisodeName = styled.span`
    color: ${({ theme }) => theme.colors.accentRed};
    font-weight: 600;
`;

export const ServerSection = styled.div`
    margin-bottom: 14px;
`;

export const ServerLabelRow = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
`;

export const ServerLabel = styled.span`
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 12px;
    font-weight: 600;
`;

export const ServerButtonRow = styled.div`
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
`;

export const ServerButton = styled.button<{ $active?: boolean }>`
    padding: 5px 12px;
    border-radius: ${({ theme }) => theme.radii.sm};
    border: 1px solid;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    background: ${({ $active }) => ($active ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.06)')};
    border-color: ${({ $active }) => ($active ? 'rgba(229,9,20,0.5)' : 'rgba(255,255,255,0.1)')};
    color: ${({ $active, theme }) => ($active ? theme.colors.textPrimary : theme.colors.textSecondary)};
`;

export const MobileEpSection = styled.div`
    margin-bottom: 20px;
`;

export const MobileEpToggle = styled.button<{ $expanded?: boolean }>`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: ${({ theme }) => theme.colors.surface};
    border-radius: ${({ $expanded, theme }) => ($expanded ? `${theme.radii.md} ${theme.radii.md} 0 0` : theme.radii.md)};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
`;

export const MobileEpPanel = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 0 0 ${({ theme }) => theme.radii.md} ${({ theme }) => theme.radii.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-top: none;
    padding: 12px;
    max-height: 220px;
    overflow-y: auto;
    overflow-x: hidden;
`;

export const RelatedSection = styled.div`
    margin-top: 24px;
`;

export const SidebarSticky = styled.div`
    position: sticky;
    top: 76px;
    min-width: 0;
    overflow: hidden;
`;

export const SidebarCard = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border-radius: ${({ theme }) => theme.radii.lg};
    border: 1px solid ${({ theme }) => theme.colors.border};
    overflow: hidden;
`;

export const SidebarHeader = styled.div`
    padding: 12px 14px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const SidebarTitle = styled.h3`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 13px;
    font-weight: 700;
`;

export const SidebarCount = styled.span`
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 11px;
`;

export const SidebarEpList = styled.div`
    max-height: 62vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
`;

export const EpisodeGrid = styled.div<{ $compact?: boolean }>`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(${({ $compact }) => ($compact ? '52px' : '62px')}, 1fr));
    gap: 6px;
`;

export const EpisodeButton = styled.button<{ $active?: boolean }>`
    padding: 7px 4px;
    border-radius: ${({ theme }) => theme.radii.sm};
    border: 1px solid;
    cursor: pointer;
    font-size: 11px;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.15s;
    background: ${({ $active }) => ($active ? 'rgba(229,9,20,0.25)' : 'rgba(255,255,255,0.04)')};
    border-color: ${({ $active }) => ($active ? 'rgba(229,9,20,0.6)' : 'rgba(255,255,255,0.08)')};
    color: ${({ $active, theme }) => ($active ? theme.colors.textPrimary : theme.colors.textSecondary)};
`;
