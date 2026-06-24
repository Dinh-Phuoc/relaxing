import styled, { keyframes } from 'styled-components';
import Link from 'next/link';

const spin = keyframes`
    to {
        transform: rotate(360deg);
    }
`;

export const FullPageCenter = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const FullPageCenterColumn = styled(FullPageCenter)`
    flex-direction: column;
    gap: 16px;
`;

export const LoadingSpinner = styled.div<{ $size?: number }>`
    width: ${({ $size }) => $size ?? 48}px;
    height: ${({ $size }) => $size ?? 48}px;
    border: 3px solid rgba(229, 9, 20, 0.3);
    border-top-color: ${({ theme }) => theme.colors.accentRed};
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
`;

export const NotFoundText = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 18px;
`;

export const PageMinHeight = styled.div`
    min-height: 100vh;
`;

export const PageContainer = styled.div`
    max-width: ${({ theme }) => theme.spacing.pageMaxWidth};
    margin: 0 auto;
    padding: clamp(24px, 4vw, 48px) clamp(16px, 3vw, 28px);
`;

export const PageHeaderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 32px;
    flex-wrap: wrap;
`;

export const PageTitleGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const PageTitle = styled.h1`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: clamp(20px, 3vw, 28px);
    font-weight: 700;
`;

export const PageSubtitle = styled.p`
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 13px;
`;

export const PageHeaderBlock = styled.div`
    margin-bottom: 28px;
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const NoResultsWrapper = styled.div`
    text-align: center;
    padding: 60px 0;
    color: ${({ theme }) => theme.colors.textMuted};
`;

export const EmptyStateWrapper = styled.div`
    text-align: center;
    padding: 80px 0;
`;

export const EmptyStateIcon = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(229, 9, 20, 0.08);
    border: 2px solid rgba(229, 9, 20, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
`;

export const EmptyStateTitle = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
`;

export const EmptyStateDescription = styled.p`
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
    margin-bottom: 24px;
`;

export const AccentLink = styled(Link)`
    color: ${({ theme }) => theme.colors.accentRed};
    text-decoration: none;
    font-weight: 600;

    &:hover {
        text-decoration: underline;
    }
`;

export const MainContent = styled.main`
    padding-top: ${({ theme }) => theme.spacing.headerHeight};
    min-height: 100vh;
    overflow-x: hidden;
    width: 100%;
`;

export const HeaderFallback = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: ${({ theme }) => theme.spacing.headerHeight};
    background: ${({ theme }) => theme.colors.background};
    z-index: 50;
`;
