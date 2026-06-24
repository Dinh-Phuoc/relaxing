import styled from 'styled-components';

export const SearchPageContainer = styled.div<{ $isMobile?: boolean }>`
    max-width: ${({ theme }) => theme.spacing.pageMaxWidth};
    margin: 0 auto;
    padding: ${({ $isMobile }) => ($isMobile ? '16px' : '24px')};
`;

export const SearchPageTitle = styled.h1<{ $isMobile?: boolean }>`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ $isMobile }) => ($isMobile ? '22px' : '28px')};
    font-weight: 700;
    margin-bottom: 20px;
`;

export const SearchBarRow = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    align-items: center;
`;

export const SearchInputWrap = styled.div`
    flex: 1;
    position: relative;
`;

export const SearchInputIcon = styled.div`
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textMuted};
    pointer-events: none;
    display: flex;
`;

export const SearchInput = styled.input`
    width: 100%;
    padding: 12px 16px 12px 44px;
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.borderLight};
    border-radius: ${({ theme }) => theme.radii.lg};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 15px;
    outline: none;

    &:focus {
        border-color: rgba(229, 9, 20, 0.5);
    }
`;

export const FilterToggleButton = styled.button<{ $active?: boolean }>`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px 16px;
    border-radius: ${({ theme }) => theme.radii.lg};
    cursor: pointer;
    background: ${({ $active }) => ($active ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.06)')};
    border: 1px solid
        ${({ $active }) => ($active ? 'rgba(229,9,20,0.4)' : 'rgba(255,255,255,0.1)')};
    color: ${({ $active, theme }) => ($active ? theme.colors.accentRed : theme.colors.textSecondary)};
    font-weight: 500;
    font-size: 13px;
    white-space: nowrap;
    flex-shrink: 0;
`;

export const FilterDot = styled.span`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accentRed};
    flex-shrink: 0;
`;

export const FilterPanel = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.xl};
    padding: 16px;
    margin-bottom: 20px;
`;

export const FilterGrid = styled.div<{ $isMobile?: boolean }>`
    display: grid;
    grid-template-columns: ${({ $isMobile }) => ($isMobile ? '1fr 1fr' : 'repeat(4, 1fr)')};
    gap: 12px;
`;

export const FilterField = styled.div``;

export const FilterLabel = styled.label`
    display: block;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 6px;
    letter-spacing: 0.5px;
`;

export const FilterSelect = styled.select`
    width: 100%;
    padding: 9px 12px;
    background: ${({ theme }) => theme.colors.inputBg};
    border: 1px solid ${({ theme }) => theme.colors.borderLight};
    border-radius: ${({ theme }) => theme.radii.md};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 13px;
    cursor: pointer;
    outline: none;
    appearance: none;
`;

export const ClearFiltersButton = styled.button`
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 12px;
    color: ${({ theme }) => theme.colors.accentRed};
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
`;

export const TypePillRow = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 20px;
`;

export const TypePill = styled.button<{ $active?: boolean }>`
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.15s;
    background: ${({ $active }) => ($active ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.04)')};
    border-color: ${({ $active }) => ($active ? 'rgba(229,9,20,0.5)' : 'rgba(255,255,255,0.1)')};
    color: ${({ $active, theme }) => ($active ? theme.colors.textPrimary : theme.colors.textSecondary)};
`;

export const ResultsMeta = styled.p`
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 13px;
    margin-bottom: 16px;
`;

export const NoResultsBox = styled.div`
    text-align: center;
    padding: 60px 0;
    color: ${({ theme }) => theme.colors.textMuted};
`;

export const NoResultsEmoji = styled.p`
    font-size: 40px;
    margin-bottom: 12px;
`;

export const SearchFallback = styled.div`
    max-width: ${({ theme }) => theme.spacing.pageMaxWidth};
    margin: 0 auto;
    padding: 24px;
`;

export const SearchFallbackBar = styled.div`
    height: 40px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: ${({ theme }) => theme.radii.md};
    margin-bottom: 16px;
`;
