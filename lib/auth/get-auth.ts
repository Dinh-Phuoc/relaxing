import { NextRequest } from 'next/server';
import { verifyAccessToken, JwtPayload } from '~/lib/auth/jwt';

export function getAuthFromRequest(request: NextRequest): JwtPayload | null {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) return null;
        const token = authHeader.slice(7);
        return verifyAccessToken(token);
    } catch {
        return null;
    }
}

export function requireAuth(request: NextRequest): JwtPayload {
    const auth = getAuthFromRequest(request);
    if (!auth) throw new Error('UNAUTHORIZED');
    return auth;
}

export function requireAdmin(request: NextRequest): JwtPayload {
    const auth = requireAuth(request);
    if (auth.role !== 'admin') throw new Error('FORBIDDEN');
    return auth;
}
