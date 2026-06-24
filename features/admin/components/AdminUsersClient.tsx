'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Shield, UserPlus, Users } from 'lucide-react';
import { useAuthStore } from '~/stores/auth.store';
import apiClient from '~/lib/axios/client';
import { User, UserRole } from '~/types/auth';

const ROLES: { label: string; value: UserRole }[] = [
    { label: 'Người dùng', value: 'user' },
    { label: 'Moderator', value: 'moderator' },
    { label: 'Admin', value: 'admin' },
];

const ROLE_LABELS: Record<UserRole, string> = {
    user: 'Người dùng',
    moderator: 'Moderator',
    admin: 'Admin',
};

const ROLE_COLORS: Record<UserRole, string> = {
    user: '#a0a0b0',
    moderator: '#f5c518',
    admin: '#e50914',
};

export default function AdminUsersClient() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, isAuthenticated } = useAuthStore();

    const [form, setForm] = useState({
        username: '',
        password: '',
        role: 'user' as UserRole,
        isActive: true,
    });
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const { data } = await apiClient.get('/admin/users');
            return data.data as { items: User[]; pagination: { total: number } };
        },
        enabled: isAuthenticated && user?.role === 'admin',
    });

    if (!isAuthenticated || user?.role !== 'admin') {
        if (typeof window !== 'undefined') router.replace('/');
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (form.password.length < 6) {
            setError('Mật khẩu tối thiểu 6 ký tự');
            return;
        }

        setLoading(true);
        try {
            const { data } = await apiClient.post('/admin/users', form);
            if (data.success) {
                setSuccess(`Đã tạo tài khoản ${form.username} (${ROLE_LABELS[form.role]})`);
                setForm({ username: '', password: '', role: 'user', isActive: true });
                queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            }
        } catch (err: unknown) {
            const errData = (err as { response?: { data?: { error?: { message?: string; detail?: string } } } })
                ?.response?.data?.error;
            const msg = errData?.message ?? 'Tạo tài khoản thất bại';
            setError(errData?.detail ? `${msg}\n${errData.detail}` : msg);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (userId: string, nextActive: boolean) => {
        setTogglingId(userId);
        setError('');
        try {
            const { data } = await apiClient.patch(`/admin/users/${userId}`, { isActive: nextActive });
            if (data.success) {
                queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            }
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response
                ?.data?.error?.message;
            setError(msg ?? 'Cập nhật trạng thái thất bại');
        } finally {
            setTogglingId(null);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
    };

    return (
        <div style={{ maxWidth: '900px', margin: '48px auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        background: 'rgba(229,9,20,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Shield size={22} color="#e50914" />
                </div>
                <div>
                    <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>Quản lý tài khoản</h1>
                    <p style={{ color: '#606070', fontSize: '14px', marginTop: '4px' }}>
                        Chỉ admin mới có quyền tạo tài khoản mới
                    </p>
                </div>
            </div>

            <div
                style={{
                    background: '#111118',
                    borderRadius: '16px',
                    padding: '28px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    marginBottom: '24px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <UserPlus size={18} color="#e50914" />
                    <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>Tạo tài khoản mới</h2>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    color: '#a0a0b0',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    marginBottom: '8px',
                                }}
                            >
                                TÊN NGƯỜI DÙNG
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="username"
                                required
                                minLength={3}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    color: '#a0a0b0',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    marginBottom: '8px',
                                }}
                            >
                                MẬT KHẨU
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Tối thiểu 6 ký tự"
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    color: '#a0a0b0',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    marginBottom: '8px',
                                }}
                            >
                                VAI TRÒ
                            </label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="dark-select"
                                style={{ ...inputStyle, cursor: 'pointer' }}
                            >
                                {ROLES.map((r) => (
                                    <option key={r.value} value={r.value}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '4px' }}>
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    color: '#c0c0d0',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={form.isActive}
                                    onChange={handleChange}
                                    style={{ width: 16, height: 16, accentColor: '#e50914' }}
                                />
                                Kích hoạt tài khoản ngay
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div
                            style={{
                                background: 'rgba(229,9,20,0.1)',
                                border: '1px solid rgba(229,9,20,0.3)',
                                borderRadius: '8px',
                                padding: '12px',
                                color: '#e57080',
                                fontSize: '14px',
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            style={{
                                background: 'rgba(34,197,94,0.1)',
                                border: '1px solid rgba(34,197,94,0.3)',
                                borderRadius: '8px',
                                padding: '12px',
                                color: '#86efac',
                                fontSize: '14px',
                            }}
                        >
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '14px',
                            borderRadius: '10px',
                            background: loading ? 'rgba(229,9,20,0.5)' : 'linear-gradient(135deg, #e50914, #b20710)',
                            color: 'white',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 700,
                            fontSize: '15px',
                        }}
                    >
                        {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
                    </button>
                </form>
            </div>

            <div
                style={{
                    background: '#111118',
                    borderRadius: '16px',
                    padding: '28px',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <Users size={18} color="#a0a0b0" />
                    <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>
                        Danh sách tài khoản ({usersData?.pagination.total ?? 0})
                    </h2>
                </div>

                {usersLoading ? (
                    <p style={{ color: '#606070', fontSize: '14px' }}>Đang tải...</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {usersData?.items.map((u) => (
                            <div
                                key={u._id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                }}
                            >
                                <div>
                                    <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>{u.username}</p>
                                    <p style={{ color: '#606070', fontSize: '12px' }}>
                                        {ROLE_LABELS[u.role]} · {u.isActive ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: u.isActive ? '#22c55e' : '#606070',
                                            background: u.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                        }}
                                    >
                                        {u.isActive ? 'Active' : 'Disabled'}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: ROLE_COLORS[u.role],
                                            background: `${ROLE_COLORS[u.role]}20`,
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                        }}
                                    >
                                        {ROLE_LABELS[u.role]}
                                    </span>
                                    {u._id !== user?._id && (
                                        <button
                                            type="button"
                                            disabled={togglingId === u._id}
                                            onClick={() => handleToggleActive(u._id, !u.isActive)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(255,255,255,0.12)',
                                                background: 'rgba(255,255,255,0.04)',
                                                color: u.isActive ? '#e57080' : '#86efac',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                cursor: togglingId === u._id ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            {togglingId === u._id
                                                ? '...'
                                                : u.isActive
                                                  ? 'Vô hiệu hóa'
                                                  : 'Kích hoạt'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
