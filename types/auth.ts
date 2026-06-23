export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
    _id: string;
    email: string;
    username: string;
    avatar?: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface AuthTokens {
    accessToken: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    username: string;
    password: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
