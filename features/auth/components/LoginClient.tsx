'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Film, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '~/stores/auth.store';
import apiClient from '~/lib/axios/client';

export default function LoginClient() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await apiClient.post('/auth/login', { email, password });
            if (data.success) {
                setAuth(data.data.user, data.data.accessToken);
                router.push('/');
            }
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
            setError(msg ?? 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px 16px',
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px', color: '#fff', fontSize: '15px', outline: 'none',
    };

    return (
        <div style={{ width: '100%', maxWidth: '420px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: 56, height: 56, borderRadius: '14px', background: 'linear-gradient(135deg, #e50914, #b20710)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Film size={28} color="white" />
                </div>
                <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: 'white', letterSpacing: '3px' }}>CINEHUB</h1>
                <p style={{ color: '#a0a0b0', fontSize: '14px', marginTop: '4px' }}>Đăng nhập để tiếp tục</p>
            </div>

            <div style={{ background: '#111118', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', color: '#a0a0b0', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>EMAIL</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#a0a0b0', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>MẬT KHẨU</label>
                        <div style={{ position: 'relative' }}>
                            <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ ...inputStyle, paddingRight: '44px' }}
                                onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                            />
                            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#606070', cursor: 'pointer', padding: '4px' }}>
                                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.3)', borderRadius: '8px', padding: '12px', color: '#e57080', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={{ padding: '14px', borderRadius: '10px', background: loading ? 'rgba(229,9,20,0.5)' : 'linear-gradient(135deg, #e50914, #b20710)', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#606070', fontSize: '14px', marginTop: '20px' }}>
                    Chưa có tài khoản?{' '}
                    <Link href="/register" style={{ color: '#e50914', textDecoration: 'none', fontWeight: 600 }}>Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    );
}
