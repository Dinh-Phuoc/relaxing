import { UserRole } from '~/types/auth';

export const ACCOUNT_MANAGER_ROLES: UserRole[] = ['admin', 'super-admin'];

export function isAccountManager(role?: string | null): boolean {
    return role === 'admin' || role === 'super-admin';
}

export function isSuperAdmin(role?: string | null): boolean {
    return role === 'super-admin';
}

/** Vai trò mà người tạo được phép gán khi tạo tài khoản mới */
export function getAssignableRoles(creatorRole: UserRole): UserRole[] {
    if (creatorRole === 'super-admin') {
        return ['user', 'admin'];
    }
    if (creatorRole === 'admin') {
        return ['user'];
    }
    return [];
}
