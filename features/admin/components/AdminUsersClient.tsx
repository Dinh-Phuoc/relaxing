'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Shield, UserPlus, Users } from 'lucide-react';
import { useAuthStore } from '~/stores/auth.store';
import apiClient from '~/lib/axios/client';
import { User, UserRole } from '~/types/auth';
import { getAssignableRoles, isAccountManager, isSuperAdmin } from '~/lib/auth/roles';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Alert } from '~/components/ui/alert';
import {
    AdminContainer,
    AdminHeader,
    AdminIconBox,
    AdminTitle,
    AdminSubtitle,
    AdminCard,
    AdminCardHeader,
    AdminCardTitle,
    AdminForm,
    AdminFormGrid,
    AdminField,
    AdminCheckboxRow,
    AdminCheckboxLabel,
    AdminCheckbox,
    AdminSelect,
    SuccessAlert,
    UserList,
    UserListItem,
    UserName,
    UserMeta,
    UserBadgeRow,
    StatusBadge,
    RoleBadge,
    LoadingText,
} from '~/styles/components/admin.styles';

const ROLE_LABELS: Record<UserRole, string> = {
    user: 'Người dùng',
    moderator: 'Moderator',
    admin: 'Admin',
    'super-admin': 'Super Admin',
};

const ROLE_COLORS: Record<UserRole, string> = {
    user: '#a0a0b0',
    moderator: '#f5c518',
    admin: '#e50914',
    'super-admin': '#8b5cf6',
};

const ROLE_OPTION_LABELS: Record<UserRole, string> = {
    user: 'Người dùng',
    moderator: 'Moderator',
    admin: 'Admin',
    'super-admin': 'Super Admin',
};

export default function AdminUsersClient() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, isAuthenticated } = useAuthStore();

    const assignableRoles = useMemo(
        () => (user?.role ? getAssignableRoles(user.role) : []),
        [user?.role],
    );

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

    const canManage = isAuthenticated && isAccountManager(user?.role);

    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const { data } = await apiClient.get('/admin/users');
            return data.data as { items: User[]; pagination: { total: number } };
        },
        enabled: canManage,
    });

    if (!canManage) {
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

        const payload = {
            ...form,
            role: assignableRoles.length === 1 ? assignableRoles[0] : form.role,
        };

        setLoading(true);
        try {
            const { data } = await apiClient.post('/admin/users', payload);
            if (data.success) {
                setSuccess(`Đã tạo tài khoản ${form.username} (${ROLE_LABELS[payload.role]})`);
                setForm({
                    username: '',
                    password: '',
                    role: assignableRoles[0] ?? 'user',
                    isActive: true,
                });
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

    const subtitle = isSuperAdmin(user?.role)
        ? 'Super Admin — xem toàn bộ tài khoản, tạo Admin và Người dùng'
        : 'Admin — chỉ xem và quản lý tài khoản do bạn tạo';

    return (
        <AdminContainer>
            <AdminHeader>
                <AdminIconBox>
                    <Shield size={22} color="#e50914" />
                </AdminIconBox>
                <div>
                    <AdminTitle>Quản lý tài khoản</AdminTitle>
                    <AdminSubtitle>{subtitle}</AdminSubtitle>
                </div>
            </AdminHeader>

            <AdminCard>
                <AdminCardHeader>
                    <UserPlus size={18} color="#e50914" />
                    <AdminCardTitle>Tạo tài khoản mới</AdminCardTitle>
                </AdminCardHeader>

                <AdminForm onSubmit={handleSubmit}>
                    <AdminFormGrid>
                        <AdminField>
                            <Label htmlFor="username">Tên người dùng</Label>
                            <Input
                                id="username"
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="username"
                                required
                                minLength={3}
                            />
                        </AdminField>
                        <AdminField>
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Tối thiểu 6 ký tự"
                                required
                            />
                        </AdminField>
                    </AdminFormGrid>

                    <AdminFormGrid>
                        {assignableRoles.length > 1 ? (
                            <AdminField>
                                <Label htmlFor="role">Vai trò</Label>
                                <AdminSelect
                                    id="role"
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="dark-select"
                                >
                                    {assignableRoles.map((role) => (
                                        <option key={role} value={role}>
                                            {ROLE_OPTION_LABELS[role]}
                                        </option>
                                    ))}
                                </AdminSelect>
                            </AdminField>
                        ) : (
                            <AdminField>
                                <Label>Vai trò</Label>
                                <Input value={ROLE_OPTION_LABELS.user} disabled readOnly />
                            </AdminField>
                        )}
                        <AdminCheckboxRow>
                            <AdminCheckboxLabel>
                                <AdminCheckbox
                                    type="checkbox"
                                    name="isActive"
                                    checked={form.isActive}
                                    onChange={handleChange}
                                />
                                Kích hoạt tài khoản ngay
                            </AdminCheckboxLabel>
                        </AdminCheckboxRow>
                    </AdminFormGrid>

                    {error && (
                        <Alert variant="destructive" className="whitespace-pre-wrap">
                            {error}
                        </Alert>
                    )}

                    {success && <SuccessAlert>{success}</SuccessAlert>}

                    <Button type="submit" variant="gradient" size="lg" disabled={loading} className="w-full">
                        {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
                    </Button>
                </AdminForm>
            </AdminCard>

            <AdminCard>
                <AdminCardHeader>
                    <Users size={18} color="#a0a0b0" />
                    <AdminCardTitle>
                        Danh sách tài khoản ({usersData?.pagination.total ?? 0})
                    </AdminCardTitle>
                </AdminCardHeader>

                {usersLoading ? (
                    <LoadingText>Đang tải...</LoadingText>
                ) : (
                    <UserList>
                        {usersData?.items.map((u) => (
                            <UserListItem key={u._id}>
                                <div>
                                    <UserName>{u.username}</UserName>
                                    <UserMeta>
                                        {ROLE_LABELS[u.role]} ·{' '}
                                        {u.isActive ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
                                        {' · '}
                                        Tạo bởi: {u.createdBy?.username ?? '—'}
                                    </UserMeta>
                                </div>
                                <UserBadgeRow>
                                    <StatusBadge $active={u.isActive}>
                                        {u.isActive ? 'Active' : 'Disabled'}
                                    </StatusBadge>
                                    <RoleBadge $color={ROLE_COLORS[u.role]}>
                                        {ROLE_LABELS[u.role]}
                                    </RoleBadge>
                                    {u._id !== user?._id && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={togglingId === u._id}
                                            onClick={() => handleToggleActive(u._id, !u.isActive)}
                                            className={
                                                u.isActive
                                                    ? 'text-error border-error-border'
                                                    : 'text-green-400 border-green-500/30'
                                            }
                                        >
                                            {togglingId === u._id
                                                ? '...'
                                                : u.isActive
                                                  ? 'Vô hiệu hóa'
                                                  : 'Kích hoạt'}
                                        </Button>
                                    )}
                                </UserBadgeRow>
                            </UserListItem>
                        ))}
                    </UserList>
                )}
            </AdminCard>
        </AdminContainer>
    );
}
