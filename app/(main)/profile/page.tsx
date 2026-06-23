'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera } from 'lucide-react';
import { useAuthStore } from '~/stores/auth.store';
import apiClient from '~/lib/axios/client';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, updateUser } = useAuthStore();
    const [username, setUsername] = useState(user?.username ?? '');
    const [avatar, setAvatar] = useState(user?.avatar ?? '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isAuthenticated) {
        if (typeof window !== 'undefined') router.push('/login');
        return null;
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess(false); setLoading(true);
        try {
            const { data } = await apiClient.patch('/user/profile', { username, avatar: avatar || undefined });
            if (data.success) { updateUser(data.data); setSuccess(true); }
        } catch (err: unknown) {
            setError((err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ?? 'Cập nhật thất bại');
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
        <div style={{ maxWidth: '600px', margin: '48px auto', padding: '0 24px' }}>
            <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 700, marginBottom: '32px' }}>Tài khoản của tôi</h1>

            <div style={{ background: '#111118', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #e50914, #b20710)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {avatar ? (
                                <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '32px', color: 'white', fontWeight: 700 }}>{user?.username[0].toUpperCase()}</span>
                            )}
                        </div>
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: '#e50914', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Camera size={14} color="white" />
                        </div>
                    </div>
                    <div>
                        <p style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>{user?.username}</p>
                        <p style={{ color: '#606070', fontSize: '14px' }}>{user?.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', color: '#a0a0b0', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>TÊN NGƯỜI DÙNG</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#a0a0b0', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>URL AVATAR</label>
                        <input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                        />
                    </div>
                    {error && <div style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.3)', borderRadius: '8px', padding: '12px', color: '#e57080', fontSize: '14px' }}>{error}</div>}
                    {success && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '12px', color: '#22c55e', fontSize: '14px' }}>Cập nhật thành công!</div>}
                    <button type="submit" disabled={loading} style={{ padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #e50914, #b20710)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </form>
            </div>
        </div>
    );
}
