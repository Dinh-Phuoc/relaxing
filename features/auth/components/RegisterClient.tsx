'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Film, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '~/stores/auth.store';
import apiClient from '~/lib/axios/client';

export default function RegisterClient() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [form, setForm] = useState({ username: '', password: '', confirm: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) { setError('Mật khẩu không khớp'); return; }
        if (form.password.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự'); return; }
        setLoading(true);
        try {
            const { data } = await apiClient.post('/auth/register', { username: form.username, password: form.password });
            if (data.success) {
                setAuth(data.data.user, data.data.accessToken);
                router.push('/');
            }
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
            setError(msg ?? 'Đăng ký thất bại');
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
                <p style={{ color: '#a0a0b0', fontSize: '14px', marginTop: '4px' }}>Tạo tài khoản mới</p>
            </div>

            <div style={{ background: '#111118', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                        { name: 'username', label: 'TÊN NGƯỜI DÙNG', type: 'text', placeholder: 'username' },
                    ].map(({ name, label, type, placeholder }) => (
                        <div key={name}>
                            <label style={{ display: 'block', color: '#a0a0b0', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{label}</label>
                            <input type={type} name={name} value={form[name as keyof typeof form]} onChange={handleChange} placeholder={placeholder} required style={inputStyle}
                                onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                            />
                        </div>
                    ))}

                    <div>
                        <label style={{ display: 'block', color: '#a0a0b0', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>MẬT KHẨU</label>
                        <div style={{ position: 'relative' }}>
                            <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Tối thiểu 6 ký tự" required style={{ ...inputStyle, paddingRight: '44px' }}
                                onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                            />
                            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#606070', cursor: 'pointer' }}>
                                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#a0a0b0', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>XÁC NHẬN MẬT KHẨU</label>
                        <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Nhập lại mật khẩu" required style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                        />
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.3)', borderRadius: '8px', padding: '12px', color: '#e57080', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={{ padding: '14px', borderRadius: '10px', background: loading ? 'rgba(229,9,20,0.5)' : 'linear-gradient(135deg, #e50914, #b20710)', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#606070', fontSize: '14px', marginTop: '20px' }}>
                    Đã có tài khoản?{' '}
                    <Link href="/login" style={{ color: '#e50914', textDecoration: 'none', fontWeight: 600 }}>Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}
