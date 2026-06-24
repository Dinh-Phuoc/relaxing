'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, Menu, X, Heart, Clock, LogOut, Film, Shield } from 'lucide-react';
import { useAuthStore } from '~/stores/auth.store';
import { useUIStore } from '~/stores/ui.store';
import { useFavorites } from '~/hooks/useFavorites';
import apiClient from '~/lib/axios/client';

const NAV_ITEMS = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Phim lẻ', href: '/search?type=movie' },
    { label: 'Phim bộ', href: '/search?type=series' },
    { label: 'Anime', href: '/search?type=anime' },
    { label: 'TV Shows', href: '/search?type=tv-shows' },
];

function isNavItemActive(pathname: string | null, searchParams: URLSearchParams, href: string): boolean {
    if (href === '/') {
        return pathname === '/';
    }

    const [path, queryString] = href.split('?');
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
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
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
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Đóng user menu khi click ngoài
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Đóng mobile nav khi navigate
    useEffect(() => {
        closeMobileNav();
    }, [pathname]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            closeMobileNav();
        }
    };

    const handleLogout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            clearAuth();
            router.push('/');
            setShowUserMenu(false);
        }
    };

    const isAdmin = user?.role === 'admin';

    const userMenuItems = [
        { icon: Heart, label: 'Yêu thích', href: '/favorites' },
        { icon: Clock, label: 'Lịch sử xem', href: '/history' },
        ...(isAdmin ? [{ icon: Shield, label: 'Quản lý tài khoản', href: '/admin/users' }] : []),
    ];

    const showDesktopNav = !isMobile;
    const showDesktopSearch = !isMobile && !isTablet;
    const showHamburger = isMobile;

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                transition: 'background 0.3s ease, border-color 0.3s ease',
                background: scrolled
                    ? 'rgba(10, 10, 15, 0.97)'
                    : 'linear-gradient(to bottom, rgba(10, 10, 15, 0.85), transparent)',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
            }}
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', height: '64px', gap: '16px' }}>

                    {/* Logo — luôn hiển thị, không co */}
                    <Link
                        href="/"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}
                    >
                        <div style={{
                            width: 34, height: 34, borderRadius: '8px',
                            background: 'linear-gradient(135deg, #e50914, #b20710)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <Film size={18} color="white" />
                        </div>
                        <span style={{
                            fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px',
                            color: 'white', letterSpacing: '2px', whiteSpace: 'nowrap',
                        }}>
                            CINEHUB
                        </span>
                    </Link>

                    {/* Desktop Nav — ẩn trên mobile */}
                    {showDesktopNav && (
                        <nav style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                            {NAV_ITEMS.map((item) => {
                                const isActive = isNavItemActive(pathname, searchParams, item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        style={{
                                            padding: '6px 10px',
                                            borderRadius: '6px',
                                            textDecoration: 'none',
                                            color: isActive ? '#ffffff' : '#a0a0b0',
                                            background: isActive ? 'rgba(229,9,20,0.15)' : 'transparent',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            whiteSpace: 'nowrap',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.color = '#ffffff';
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.color = '#a0a0b0';
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    )}

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    {/* Desktop Search — chỉ hiện ở desktop rộng */}
                    {showDesktopSearch && (
                        <form onSubmit={handleSearch} style={{ width: '240px', flexShrink: 0 }}>
                            <div style={{ position: 'relative' }}>
                                <Search
                                    size={15}
                                    style={{
                                        position: 'absolute', left: '10px', top: '50%',
                                        transform: 'translateY(-50%)', color: '#606070', pointerEvents: 'none',
                                    }}
                                />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm kiếm phim..."
                                    style={{
                                        width: '100%', padding: '8px 10px 8px 32px',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none',
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                                />
                            </div>
                        </form>
                    )}

                    {/* Search icon trên tablet */}
                    {isTablet && (
                        <Link
                            href="/search"
                            style={{
                                width: 36, height: 36, borderRadius: '8px', flexShrink: 0,
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0a0b0',
                            }}
                        >
                            <Search size={16} />
                        </Link>
                    )}

                    {/* Favorites icon — desktop & tablet */}
                    {!isMobile && (
                        <Link
                            href="/favorites"
                            title={`Yêu thích${favorites.length > 0 ? ` (${favorites.length})` : ''}`}
                            style={{
                                position: 'relative', width: 36, height: 36, flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px', color: favorites.length > 0 ? '#e50914' : '#a0a0b0', textDecoration: 'none',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(229,9,20,0.12)'; e.currentTarget.style.borderColor = 'rgba(229,9,20,0.3)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        >
                            <Heart size={16} fill={favorites.length > 0 ? '#e50914' : 'none'} />
                            {favorites.length > 0 && (
                                <span style={{
                                    position: 'absolute', top: '-5px', right: '-5px',
                                    minWidth: '16px', height: '16px', borderRadius: '8px',
                                    background: '#e50914', color: 'white',
                                    fontSize: '9px', fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '0 3px', lineHeight: 1,
                                    border: '1.5px solid #0a0a0f',
                                }}>
                                    {favorites.length > 99 ? '99+' : favorites.length}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* Auth buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        {isAuthenticated && user ? (
                            !isMobile && (
                            <div ref={userMenuRef} style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '7px',
                                        padding: '6px 10px', borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white', cursor: 'pointer', fontSize: '13px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <div style={{
                                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                                        background: 'linear-gradient(135deg, #e50914, #b20710)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '11px', fontWeight: 700,
                                    }}>
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    {!isMobile && (
                                        <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {user.username}
                                        </span>
                                    )}
                                </button>

                                {showUserMenu && (
                                    <div style={{
                                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                        background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px', padding: '8px', minWidth: '180px',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.6)', zIndex: 200,
                                    }}>
                                        {userMenuItems.map(({ icon: Icon, label, href }) => (
                                            <Link
                                                key={href}
                                                href={href}
                                                onClick={() => setShowUserMenu(false)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '10px',
                                                    padding: '10px 12px', borderRadius: '8px', color: '#a0a0b0',
                                                    textDecoration: 'none', fontSize: '14px', transition: 'all 0.2s',
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a0a0b0'; }}
                                            >
                                                <Icon size={16} /> {label}
                                            </Link>
                                        ))}
                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '4px 0' }} />
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                padding: '10px 12px', borderRadius: '8px', color: '#e50914',
                                                background: 'transparent', border: 'none', cursor: 'pointer',
                                                fontSize: '14px', width: '100%', transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,9,20,0.1)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <LogOut size={16} /> Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                            )
                        ) : (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {!isMobile && (
                                    <Link
                                        href="/login"
                                        style={{
                                            padding: '7px 14px', borderRadius: '8px', textDecoration: 'none',
                                            color: '#a0a0b0', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap',
                                            border: '1px solid rgba(255,255,255,0.12)', transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = '#a0a0b0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                                    >
                                        Đăng nhập
                                    </Link>
                                )}
                                {!isMobile && (
                                    <Link
                                        href="/register"
                                        style={{
                                            padding: '7px 14px', borderRadius: '8px', textDecoration: 'none',
                                            color: 'white', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap',
                                            background: 'linear-gradient(135deg, #e50914, #b20710)',
                                            transition: 'opacity 0.2s',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                                    >
                                        Đăng ký
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Search icon — chỉ mobile */}
                        {isMobile && (
                            <Link
                                href="/search"
                                style={{
                                    width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px', color: '#a0a0b0', flexShrink: 0, textDecoration: 'none',
                                }}
                            >
                                <Search size={17} />
                            </Link>
                        )}

                        {/* Hamburger — chỉ mobile */}
                        {showHamburger && (
                            <button
                                onClick={toggleMobileNav}
                                style={{
                                    width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: isMobileNavOpen ? 'rgba(229,9,20,0.15)' : 'rgba(255,255,255,0.06)',
                                    border: `1px solid ${isMobileNavOpen ? 'rgba(229,9,20,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                    borderRadius: '8px', color: 'white', cursor: 'pointer', flexShrink: 0,
                                }}
                            >
                                {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Nav Dropdown */}
                {isMobileNavOpen && isMobile && (
                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        padding: '16px 16px 24px',
                        background: '#0d0d14', // Fully opaque — tránh nhìn xuyên thấu
                    }}>
                        {/* Mobile search */}
                        <form onSubmit={handleSearch} style={{ marginBottom: '8px' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#606070' }} />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm kiếm phim..."
                                    style={{
                                        width: '100%', padding: '11px 12px 11px 36px',
                                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none',
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                                />
                            </div>
                        </form>

                        {/* Mobile nav links — padding đủ rộng */}
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileNav}
                                style={{
                                    display: 'block',
                                    padding: '14px 4px',
                                    color: '#c0c0d0',
                                    textDecoration: 'none',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Mobile user links */}
                        {isAuthenticated && user && (
                            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                {userMenuItems.map(({ icon: Icon, label, href }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={closeMobileNav}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '14px 4px',
                                            color: '#c0c0d0',
                                            textDecoration: 'none',
                                            fontSize: '15px',
                                            fontWeight: 500,
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        }}
                                    >
                                        <Icon size={16} /> {label}
                                    </Link>
                                ))}
                                <button
                                    onClick={() => { handleLogout(); closeMobileNav(); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '14px 4px',
                                        color: '#e50914',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        fontWeight: 500,
                                        width: '100%',
                                        textAlign: 'left',
                                    }}
                                >
                                    <LogOut size={16} /> Đăng xuất
                                </button>
                            </div>
                        )}

                        {/* Mobile auth links nếu chưa login */}
                        {!isAuthenticated && (
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <Link
                                    href="/login"
                                    onClick={closeMobileNav}
                                    style={{ flex: 1, padding: '11px', textAlign: 'center', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', color: '#c0c0d0', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={closeMobileNav}
                                    style={{ flex: 1, padding: '11px', textAlign: 'center', borderRadius: '8px', background: 'linear-gradient(135deg, #e50914, #b20710)', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
