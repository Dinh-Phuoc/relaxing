import crypto from 'crypto';
import { connectDB } from '~/lib/db/mongoose';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '~/lib/auth/jwt';
import { hashPassword, comparePassword } from '~/lib/auth/password';
import UserModel from '~/models/user.model';
import RefreshTokenModel from '~/models/refresh-token.model';

function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

export interface RegisterInput {
    email: string;
    username: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export const authService = {
    async register(input: RegisterInput) {
        await connectDB();

        const existingEmail = await UserModel.findOne({ email: input.email.toLowerCase() });
        if (existingEmail) {
            throw new Error('EMAIL_EXISTS');
        }

        const existingUsername = await UserModel.findOne({ username: input.username });
        if (existingUsername) {
            throw new Error('USERNAME_EXISTS');
        }

        const passwordHash = await hashPassword(input.password);
        const user = await UserModel.create({
            email: input.email.toLowerCase(),
            username: input.username,
            passwordHash,
        });

        const payload = { userId: user._id.toString(), email: user.email, role: user.role };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        await RefreshTokenModel.create({
            userId: user._id,
            tokenHash: hashToken(refreshToken),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        return {
            accessToken,
            refreshToken,
            user: {
                _id: user._id.toString(),
                email: user.email,
                username: user.username,
                avatar: user.avatar,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
    },

    async login(input: LoginInput) {
        await connectDB();

        const user = await UserModel.findOne({ email: input.email.toLowerCase() });
        if (!user) throw new Error('INVALID_CREDENTIALS');

        const valid = await comparePassword(input.password, user.passwordHash);
        if (!valid) throw new Error('INVALID_CREDENTIALS');

        const payload = { userId: user._id.toString(), email: user.email, role: user.role };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        await RefreshTokenModel.deleteMany({ userId: user._id, expiresAt: { $lt: new Date() } });

        await RefreshTokenModel.create({
            userId: user._id,
            tokenHash: hashToken(refreshToken),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        return {
            accessToken,
            refreshToken,
            user: {
                _id: user._id.toString(),
                email: user.email,
                username: user.username,
                avatar: user.avatar,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
    },

    async refresh(refreshToken: string) {
        await connectDB();

        let payload;
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch {
            throw new Error('INVALID_REFRESH_TOKEN');
        }

        const tokenHash = hashToken(refreshToken);
        const storedToken = await RefreshTokenModel.findOne({ tokenHash });
        if (!storedToken) throw new Error('INVALID_REFRESH_TOKEN');

        const user = await UserModel.findById(payload.userId);
        if (!user) throw new Error('USER_NOT_FOUND');

        await RefreshTokenModel.deleteOne({ _id: storedToken._id });

        const newPayload = { userId: user._id.toString(), email: user.email, role: user.role };
        const newAccessToken = signAccessToken(newPayload);
        const newRefreshToken = signRefreshToken(newPayload);

        await RefreshTokenModel.create({
            userId: user._id,
            tokenHash: hashToken(newRefreshToken),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    },

    async logout(refreshToken: string) {
        await connectDB();
        if (!refreshToken) return;
        const tokenHash = hashToken(refreshToken);
        await RefreshTokenModel.deleteOne({ tokenHash });
    },

    async getMe(userId: string) {
        await connectDB();
        const user = await UserModel.findById(userId).select('-passwordHash');
        if (!user) throw new Error('USER_NOT_FOUND');
        return {
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },
};
