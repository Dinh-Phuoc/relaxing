import styled from 'styled-components';
import Link from 'next/link';

export const HeaderRoot = styled.header<{ $scrolled: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: background 0.3s ease, border-color 0.3s ease;
    background: ${({ $scrolled, theme }) =>
        $scrolled ? theme.gradients.headerScrolled : theme.gradients.headerTop};
    backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(20px)' : 'none')};
    border-bottom: 1px solid
        ${({ $scrolled }) => ($scrolled ? 'rgba(255,255,255,0.06)' : 'transparent')};
`;

export const HeaderInner = styled.div`
    max-width: ${({ theme }) => theme.spacing.pageMaxWidth};
    margin: 0 auto;
    padding: 0 20px;
`;

export const HeaderBar = styled.div`
    display: flex;
    align-items: center;
    height: ${({ theme }) => theme.spacing.headerHeight};
    gap: 16px;
`;

export const LogoLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    flex-shrink: 0;
`;

export const LogoIcon = styled.div`
    width: 34px;
    height: 34px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.gradients.accent};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

export const LogoText = styled.span`
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 22px;
    color: ${({ theme }) => theme.colors.textPrimary};
    letter-spacing: 2px;
    white-space: nowrap;
`;

export const DesktopNav = styled.nav`
    display: flex;
    gap: 2px;
    flex-shrink: 0;
`;

export const NavLink = styled(Link)<{ $active?: boolean }>`
    padding: 6px 10px;
    border-radius: ${({ theme }) => theme.radii.sm};
    text-decoration: none;
    color: ${({ $active, theme }) => ($active ? theme.colors.textPrimary : theme.colors.textSecondary)};
    background: ${({ $active }) => ($active ? 'rgba(229,9,20,0.15)' : 'transparent')};
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    transition: all 0.2s;

    &:hover {
        color: ${({ theme }) => theme.colors.textPrimary};
        background: ${({ $active }) => ($active ? 'rgba(229,9,20,0.15)' : 'rgba(255,255,255,0.06)')};
    }
`;

export const Spacer = styled.div`
    flex: 1;
`;

export const SearchForm = styled.form<{ $width?: string }>`
    width: ${({ $width }) => $width ?? '240px'};
    flex-shrink: 0;
`;

export const SearchInputWrap = styled.div`
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

export const IconButtonLink = styled(Link)<{ $active?: boolean }>`
    width: 36px;
    height: 36px;
    border-radius: ${({ theme }) => theme.radii.md};
    flex-shrink: 0;
    background: ${({ $active }) => ($active ? 'rgba(229,9,20,0.12)' : 'rgba(255,255,255,0.06)')};
    border: 1px solid
        ${({ $active }) => ($active ? 'rgba(229,9,20,0.3)' : 'rgba(255,255,255,0.1)')};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ $active, theme }) => ($active ? theme.colors.accentRed : theme.colors.textSecondary)};
    text-decoration: none;
    transition: all 0.2s;
    position: relative;

    &:hover {
        background: rgba(229, 9, 20, 0.12);
        border-color: rgba(229, 9, 20, 0.3);
    }
`;

export const FavoriteBadge = styled.span`
    position: absolute;
    top: -5px;
    right: -5px;
    min-width: 16px;
    height: 16px;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.accentRed};
    color: white;
    font-size: 9px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
    line-height: 1;
    border: 1.5px solid ${({ theme }) => theme.colors.background};
`;

export const AuthActions = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
`;

export const UserMenuWrap = styled.div`
    position: relative;
`;

export const UserMenuButton = styled.button`
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 6px 10px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    font-size: 13px;
    white-space: nowrap;
`;

export const UserAvatar = styled.div`
    width: 26px;
    height: 26px;
    border-radius: 50%;
    flex-shrink: 0;
    background: ${({ theme }) => theme.gradients.accent};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
`;

export const UserName = styled.span`
    max-width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const UserDropdown = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: ${({ theme }) => theme.colors.card};
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: ${({ theme }) => theme.radii.xl};
    padding: 8px;
    min-width: 180px;
    box-shadow: ${({ theme }) => theme.shadows.dropdown};
    z-index: 200;
`;

export const UserDropdownLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: ${({ theme }) => theme.radii.md};
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    font-size: 14px;
    transition: all 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.06);
        color: ${({ theme }) => theme.colors.textPrimary};
    }
`;

export const UserDropdownDivider = styled.div`
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    margin: 4px 0;
`;

export const UserDropdownLogout = styled.button`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: ${({ theme }) => theme.radii.md};
    color: ${({ theme }) => theme.colors.accentRed};
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
    transition: all 0.2s;

    &:hover {
        background: rgba(229, 9, 20, 0.1);
    }
`;

export const AuthLinkGroup = styled.div`
    display: flex;
    gap: 8px;
`;

export const LoginLink = styled(Link)`
    padding: 7px 14px;
    border-radius: ${({ theme }) => theme.radii.md};
    text-decoration: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    border: 1px solid rgba(255, 255, 255, 0.12);
    transition: all 0.2s;

    &:hover {
        color: ${({ theme }) => theme.colors.textPrimary};
        border-color: rgba(255, 255, 255, 0.3);
    }
`;

export const MenuToggle = styled.button<{ $open?: boolean }>`
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ $open }) => ($open ? 'rgba(229,9,20,0.15)' : 'rgba(255,255,255,0.06)')};
    border: 1px solid ${({ $open }) => ($open ? 'rgba(229,9,20,0.3)' : 'rgba(255,255,255,0.1)')};
    border-radius: ${({ theme }) => theme.radii.md};
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    flex-shrink: 0;
`;

export const MobileNavPanel = styled.div`
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    padding: 16px 16px 24px;
    background: #0d0d14;
`;

export const MobileNavLink = styled(Link)`
    display: block;
    padding: 14px 4px;
    color: ${({ theme }) => theme.colors.textSoft};
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

export const MobileUserSection = styled.div`
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const MobileUserLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 4px;
    color: ${({ theme }) => theme.colors.textSoft};
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

export const MobileLogoutButton = styled.button`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 4px;
    color: ${({ theme }) => theme.colors.accentRed};
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    width: 100%;
    text-align: left;
`;

export const MobileAuthRow = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;
`;

export const MobileLoginLink = styled(Link)`
    flex: 1;
    padding: 11px;
    text-align: center;
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: ${({ theme }) => theme.colors.textSoft};
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
`;
