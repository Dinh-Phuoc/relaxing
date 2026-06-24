import styled from 'styled-components';
import Link from 'next/link';

export const FooterRoot = styled.footer`
    background: #0d0d15;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    margin-top: 80px;
    padding: 48px 0 24px;
`;

export const FooterInner = styled.div`
    max-width: ${({ theme }) => theme.spacing.pageMaxWidth};
    margin: 0 auto;
    padding: 0 24px;
`;

export const FooterGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 28px;
    margin-bottom: 40px;
`;

export const FooterBrand = styled.div``;

export const FooterBrandRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
`;

export const FooterLogoIcon = styled.div`
    width: 32px;
    height: 32px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.gradients.accent};
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const FooterLogoText = styled.span`
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 20px;
    color: ${({ theme }) => theme.colors.textPrimary};
    letter-spacing: 2px;
`;

export const FooterDescription = styled.p`
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 13px;
    line-height: 1.6;
`;

export const FooterColumnTitle = styled.h4`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
`;

export const FooterLink = styled(Link)`
    display: block;
    color: ${({ theme }) => theme.colors.textMuted};
    text-decoration: none;
    font-size: 13px;
    margin-bottom: 8px;
    transition: color 0.2s;

    &:hover {
        color: ${({ theme }) => theme.colors.textSecondary};
    }
`;

export const FooterDivider = styled.div`
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    padding-top: 24px;
`;

export const FooterDisclaimer = styled.p`
    color: #3a3a4a;
    font-size: 12px;
    text-align: center;
    line-height: 1.6;

    strong {
        color: #4a4a5a;
    }
`;

export const FooterCopyright = styled.p`
    color: #3a3a4a;
    font-size: 12px;
    text-align: center;
    margin-top: 8px;
`;
