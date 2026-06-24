"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    Search,
    Menu,
    X,
    Heart,
    Clock,
    LogOut,
    Film,
    Shield,
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { useAuthStore } from "~/stores/auth.store";
import { useUIStore } from "~/stores/ui.store";
import { useFavorites } from "~/hooks/useFavorites";
import apiClient from "~/lib/axios/client";
import { markLoggedOut } from "~/lib/auth/session-flags";
import { dispatchAuthChanged } from "~/lib/storage/user-local-storage";
import { AuthLoadingOverlay } from "~/components/shared/AuthLoadingOverlay";
import {
    HeaderRoot,
    HeaderInner,
    HeaderBar,
    LogoLink,
    LogoIcon,
    LogoText,
    DesktopNav,
    NavLink,
    Spacer,
    SearchForm,
    SearchInputWrap,
    SearchInputIcon,
    IconButtonLink,
    FavoriteBadge,
    AuthActions,
    UserMenuWrap,
    UserMenuButton,
    UserAvatar,
    UserName,
    UserDropdown,
    UserDropdownLink,
    UserDropdownDivider,
    UserDropdownLogout,
    AuthLinkGroup,
    LoginLink,
    MenuToggle,
    MobileNavPanel,
    MobileNavLink,
    MobileUserSection,
    MobileUserLink,
    MobileLogoutButton,
    MobileAuthRow,
    MobileLoginLink,
} from "~/styles/components/header.styles";

const NAV_ITEMS = [
    { label: "Trang chủ", href: "/" },
    { label: "Phim lẻ", href: "/search?type=movie" },
    { label: "Phim bộ", href: "/search?type=series" },
    { label: "Anime", href: "/search?type=anime" },
    { label: "TV Shows", href: "/search?type=tv-shows" },
];

function isNavItemActive(
    pathname: string | null,
    searchParams: URLSearchParams,
    href: string,
): boolean {
    if (href === "/") {
        return pathname === "/";
    }

    const [path, queryString] = href.split("?");
    if (pathname !== path) {
        return false;
    }

    if (!queryString) {
        return true;
    }

    const expected = new URLSearchParams(queryString);
    for (const [key, value] of expected.entries()) {
        if (searchParams.get(key) !== value) {
            return false;
        }
    }

    return true;
}

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, isAuthenticated, clearAuth } = useAuthStore();
    const { isMobileNavOpen, toggleMobileNav, closeMobileNav } = useUIStore();
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const { favorites } = useFavorites();

    useEffect(() => {
        const checkSize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1100);
        };
        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Đóng user menu khi click ngoài
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(e.target as Node)
            ) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Đóng mobile nav khi navigate
    useEffect(() => {
        closeMobileNav();
    }, [pathname]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            closeMobileNav();
        }
    };

    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        setShowUserMenu(false);
        closeMobileNav();

        try {
            await apiClient.post("/auth/logout");
        } catch {
            // Vẫn đăng xuất phía client nếu API lỗi
        } finally {
            markLoggedOut();
            clearAuth();
            dispatchAuthChanged();
            window.location.assign("/login");
        }
    };

    const isAccountManager = user?.role === "admin" || user?.role === "super-admin";

    const userMenuItems = [
        { icon: Heart, label: "Yêu thích", href: "/favorites" },
        { icon: Clock, label: "Lịch sử xem", href: "/history" },
        ...(isAccountManager
            ? [{ icon: Shield, label: "Quản lý tài khoản", href: "/admin/users" }]
            : []),
    ];

    const showDesktopNav = !isMobile;
    const showDesktopSearch = !isMobile && !isTablet;
    const showHamburger = isMobile;

    return (
        <>
            {isLoggingOut && <AuthLoadingOverlay message="Đang đăng xuất..." />}
            <HeaderRoot $scrolled={scrolled}>
            <HeaderInner>
                <HeaderBar>
                    {/* Logo — luôn hiển thị, không co */}
                    <LogoLink href="/">
                        <LogoIcon>
                            <Film size={18} color="white" />
                        </LogoIcon>
                        <LogoText>Relaxing</LogoText>
                    </LogoLink>

                    {/* Desktop Nav — ẩn trên mobile */}
                    {showDesktopNav && (
                        <DesktopNav>
                            {NAV_ITEMS.map((item) => {
                                const isActive = isNavItemActive(
                                    pathname,
                                    searchParams,
                                    item.href,
                                );
                                return (
                                    <NavLink
                                        key={item.href}
                                        href={item.href}
                                        $active={isActive}
                                    >
                                        {item.label}
                                    </NavLink>
                                );
                            })}
                        </DesktopNav>
                    )}

                    {/* Spacer */}
                    <Spacer />

                    {/* Desktop Search — chỉ hiện ở desktop rộng */}
                    {showDesktopSearch && (
                        <SearchForm onSubmit={handleSearch}>
                            <SearchInputWrap>
                                <SearchInputIcon>
                                    <Search size={15} />
                                </SearchInputIcon>
                                <Input
                                    hasLeftIcon
                                    className="h-9 text-[13px]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm kiếm phim..."
                                />
                            </SearchInputWrap>
                        </SearchForm>
                    )}

                    {/* Search icon trên tablet */}
                    {isTablet && (
                        <IconButtonLink href="/search">
                            <Search size={16} />
                        </IconButtonLink>
                    )}

                    {/* Favorites icon — desktop & tablet */}
                    {!isMobile && (
                        <IconButtonLink
                            href="/favorites"
                            title={`Yêu thích${favorites.length > 0 ? ` (${favorites.length})` : ""}`}
                            $active={favorites.length > 0}
                        >
                            <Heart
                                size={16}
                                fill={favorites.length > 0 ? "#e50914" : "none"}
                            />
                            {favorites.length > 0 && (
                                <FavoriteBadge>
                                    {favorites.length > 99 ? "99+" : favorites.length}
                                </FavoriteBadge>
                            )}
                        </IconButtonLink>
                    )}

                    {/* Auth buttons */}
                    <AuthActions>
                        {isAuthenticated && user ? (
                            !isMobile && (
                                <UserMenuWrap ref={userMenuRef}>
                                    <UserMenuButton
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                    >
                                        <UserAvatar>
                                            {user.username[0].toUpperCase()}
                                        </UserAvatar>
                                        {!isMobile && (
                                            <UserName>{user.username}</UserName>
                                        )}
                                    </UserMenuButton>

                                    {showUserMenu && (
                                        <UserDropdown>
                                            {userMenuItems.map(({ icon: Icon, label, href }) => (
                                                <UserDropdownLink
                                                    key={href}
                                                    href={href}
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <Icon size={16} /> {label}
                                                </UserDropdownLink>
                                            ))}
                                            <UserDropdownDivider />
                                            <UserDropdownLogout
                                                onClick={handleLogout}
                                                disabled={isLoggingOut}
                                            >
                                                <LogOut size={16} /> Đăng xuất
                                            </UserDropdownLogout>
                                        </UserDropdown>
                                    )}
                                </UserMenuWrap>
                            )
                        ) : (
                            <AuthLinkGroup>
                                {!isMobile && (
                                    <LoginLink href="/login">Đăng nhập</LoginLink>
                                )}
                            </AuthLinkGroup>
                        )}

                        {/* Search icon — chỉ mobile */}
                        {isMobile && (
                            <IconButtonLink href="/search">
                                <Search size={17} />
                            </IconButtonLink>
                        )}

                        {/* Hamburger — chỉ mobile */}
                        {showHamburger && (
                            <MenuToggle
                                type="button"
                                onClick={toggleMobileNav}
                                $open={isMobileNavOpen}
                            >
                                {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
                            </MenuToggle>
                        )}
                    </AuthActions>
                </HeaderBar>

                {/* Mobile Nav Dropdown */}
                {isMobileNavOpen && isMobile && (
                    <MobileNavPanel>
                        {/* Mobile search */}
                        <SearchForm onSubmit={handleSearch} className="mb-2">
                            <SearchInputWrap>
                                <SearchInputIcon>
                                    <Search size={15} />
                                </SearchInputIcon>
                                <Input
                                    hasLeftIcon
                                    className="h-10 text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm kiếm phim..."
                                />
                            </SearchInputWrap>
                        </SearchForm>

                        {/* Mobile nav links — padding đủ rộng */}
                        {NAV_ITEMS.map((item) => (
                            <MobileNavLink
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileNav}
                            >
                                {item.label}
                            </MobileNavLink>
                        ))}

                        {/* Mobile user links */}
                        {isAuthenticated && user && (
                            <MobileUserSection>
                                {userMenuItems.map(({ icon: Icon, label, href }) => (
                                    <MobileUserLink
                                        key={href}
                                        href={href}
                                        onClick={closeMobileNav}
                                    >
                                        <Icon size={16} /> {label}
                                    </MobileUserLink>
                                ))}
                                <MobileLogoutButton
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                >
                                    <LogOut size={16} /> Đăng xuất
                                </MobileLogoutButton>
                            </MobileUserSection>
                        )}

                        {/* Mobile auth links nếu chưa login */}
                        {!isAuthenticated && (
                            <MobileAuthRow>
                                <MobileLoginLink href="/login" onClick={closeMobileNav}>
                                    Đăng nhập
                                </MobileLoginLink>
                            </MobileAuthRow>
                        )}
                    </MobileNavPanel>
                )}
            </HeaderInner>
        </HeaderRoot>
        </>
    );
}
