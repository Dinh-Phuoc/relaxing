export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
    _id: string;
    username: string;
    avatar?: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthTokens {
    accessToken: string;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface RegisterPayload {
    username: string;
    password: string;
}

export interface CreateUserPayload {
    username: string;
    password: string;
    role?: UserRole;
    isActive?: boolean;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
