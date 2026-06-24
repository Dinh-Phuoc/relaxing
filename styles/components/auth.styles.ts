import styled from 'styled-components';
import Link from 'next/link';

export const AuthWrapper = styled.div`
    width: 100%;
    max-width: 420px;
`;

export const AuthBrand = styled.div`
    text-align: center;
    margin-bottom: 32px;
`;

export const AuthLogo = styled.div`
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: ${({ theme }) => theme.gradients.accent};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
`;

export const AuthTitle = styled.h1`
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 32px;
    color: ${({ theme }) => theme.colors.textPrimary};
    letter-spacing: 3px;
`;

export const AuthSubtitle = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    margin-top: 4px;
`;

export const AuthCard = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border-radius: ${({ theme }) => theme.radii['2xl']};
    padding: 28px;
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const AuthForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const AuthField = styled.div``;

export const PasswordWrapper = styled.div`
    position: relative;
`;

export const PasswordToggle = styled.button`
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
`;

export const AuthFooter = styled.p`
    text-align: center;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
    margin-top: 20px;
`;

export const AuthLink = styled(Link)`
    color: ${({ theme }) => theme.colors.accentRed};
    text-decoration: none;
    font-weight: 600;

    &:hover {
        text-decoration: underline;
    }
`;

export const AuthLayoutWrapper = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
`;
