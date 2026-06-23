'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, User, Heart, Clock, LogOut, Film } from 'lucide-react';
import { useAuthStore } from '~/stores/auth.store';
import { useUIStore } from '~/stores/ui.store';
import apiClient from '~/lib/axios/client';

const NAV_ITEMS = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Phim lẻ', href: '/search?type=movie' },
    { label: 'Phim bộ', href: '/search?type=series' },
    { label: 'Anime', href: '/search?type=anime' },
    { label: 'TV Shows', href: '/search?type=tv-shows' },
];

export default function Header() {
    const router = useRouter();
    const { user, isAuthenticated, clearAuth } = useAuthStore();
    const { isMobileNavOpen, toggleMobileNav, closeMobileNav } = useUIStore();
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
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

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                transition: 'all 0.3s ease',
                background: scrolled
                    ? 'rgba(10, 10, 15, 0.97)'
                    : 'linear-gradient(to bottom, rgba(10, 10, 15, 0.9), transparent)',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', height: '64px', gap: '24px' }}>
                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '8px',
                            background: 'linear-gradient(135deg, #e50914, #b20710)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Film size={20} color="white" />
                        </div>
                        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: 'white', letterSpacing: '2px' }}>
                            CINEHUB
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav style={{ display: 'flex', gap: '4px', flex: 1 }}>
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    padding: '6px 12px', borderRadius: '6px', textDecoration: 'none',
                                    color: '#a0a0b0', fontSize: '14px', fontWeight: 500,
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#ffffff';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#a0a0b0';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Search */}
                    <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '320px', display: 'flex' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#606070', pointerEvents: 'none' }} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm phim..."
                                style={{
                                    width: '100%', padding: '8px 12px 8px 38px',
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none',
                                }}
                                onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                            />
                        </div>
                    </form>

                    {/* Auth */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        {isAuthenticated && user ? (
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '6px 12px', borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white', cursor: 'pointer', fontSize: '14px',
                                    }}
                                >
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #e50914, #b20710)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '12px', fontWeight: 600,
                                    }}>
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {user.username}
                                    </span>
                                </button>

                                {showUserMenu && (
                                    <div style={{
                                        position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                                        background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px', padding: '8px', minWidth: '180px',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 100,
                                    }}>
                                        {[
                                            { icon: User, label: 'Tài khoản', href: '/profile' },
                                            { icon: Heart, label: 'Yêu thích', href: '/favorites' },
                                            { icon: Clock, label: 'Lịch sử xem', href: '/history' },
                                        ].map(({ icon: Icon, label, href }) => (
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
                        ) : (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Link
                                    href="/login"
                                    style={{
                                        padding: '8px 16px', borderRadius: '8px', textDecoration: 'none',
                                        color: '#a0a0b0', fontSize: '14px', fontWeight: 500,
                                        border: '1px solid rgba(255,255,255,0.12)', transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#a0a0b0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    style={{
                                        padding: '8px 16px', borderRadius: '8px', textDecoration: 'none',
                                        color: 'white', fontSize: '14px', fontWeight: 600,
                                        background: 'linear-gradient(135deg, #e50914, #b20710)',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}

                        <button
                            onClick={toggleMobileNav}
                            style={{ padding: '8px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                        >
                            {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {isMobileNavOpen && (
                    <div style={{ padding: '16px 0 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <form onSubmit={handleSearch} style={{ marginBottom: '16px' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#606070' }} />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm kiếm phim..."
                                    style={{
                                        width: '100%', padding: '10px 12px 10px 38px',
                                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none',
                                    }}
                                />
                            </div>
                        </form>
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileNav}
                                style={{
                                    display: 'block', padding: '12px 0',
                                    color: '#a0a0b0', textDecoration: 'none', fontSize: '15px',
                                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
}
