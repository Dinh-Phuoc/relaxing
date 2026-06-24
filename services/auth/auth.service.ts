import crypto from 'crypto';

import { connectDB } from '~/lib/db/mongoose';

import { signAccessToken, signRefreshToken, verifyRefreshToken } from '~/lib/auth/jwt';

import { hashPassword, comparePassword } from '~/lib/auth/password';

import { logger } from '~/lib/logger';

import UserModel, { IUser } from '~/models/user.model';

import RefreshTokenModel from '~/models/refresh-token.model';

import { UserRole } from '~/types/auth';



function hashToken(token: string): string {

    return crypto.createHash('sha256').update(token).digest('hex');

}



export interface LoginInput {

    username: string;

    password: string;

}



export interface CreateUserInput {

    username: string;

    password: string;

    role?: UserRole;

    isActive?: boolean;

}



function assertUserActive(user: IUser): void {

    if (user.isActive === false) {

        throw new Error('ACCOUNT_DISABLED');

    }

}



function serializeUser(user: IUser) {

    return {

        _id: user._id.toString(),

        username: user.username,

        avatar: user.avatar,

        role: user.role,

        isActive: user.isActive !== false,

        createdAt: user.createdAt,

        updatedAt: user.updatedAt,

    };

}



function buildTokenPayload(user: IUser) {

    return {

        userId: user._id.toString(),

        username: user.username,

        role: user.role,

    };

}



export const authService = {

    async createUser(input: CreateUserInput) {

        await connectDB();



        const username = input.username.trim();

        const existingUsername = await UserModel.findOne({ username });

        if (existingUsername) throw new Error('USERNAME_EXISTS');



        const role = input.role ?? 'user';

        const validRoles: UserRole[] = ['user', 'admin', 'moderator'];

        if (!validRoles.includes(role)) throw new Error('INVALID_ROLE');



        const passwordHash = await hashPassword(input.password);

        const user = await UserModel.create({

            username,

            passwordHash,

            role,

            isActive: input.isActive ?? true,

        });



        logger.activity(`Tạo tài khoản ${username}.`, {

            type: 'admin-users',

            data: { username, role, isActive: user.isActive },

        });



        return serializeUser(user);

    },



    async updateUserStatus(userId: string, isActive: boolean) {

        await connectDB();



        const current = await UserModel.findById(userId);

        if (!current) throw new Error('USER_NOT_FOUND');



        const updated = await UserModel.findByIdAndUpdate(

            userId,

            { isActive },

            { new: true },

        );



        if (!updated) throw new Error('USER_NOT_FOUND');



        if (!isActive) {

            await RefreshTokenModel.deleteMany({ userId: updated._id });

        }



        logger.activity(`${isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} tài khoản ${updated.username}.`, {

            type: 'admin-users',

            data: { userId, isActive },

            oldData: { isActive: current.isActive },

        });



        return serializeUser(updated);

    },



    async listUsers(page = 1, limit = 50) {

        await connectDB();



        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([

            UserModel.find().select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(limit),

            UserModel.countDocuments(),

        ]);



        return {

            items: users.map(serializeUser),

            pagination: {

                total,

                page,

                limit,

                totalPages: Math.ceil(total / limit) || 0,

            },

        };

    },



    async login(input: LoginInput) {

        await connectDB();



        const user = await UserModel.findOne({ username: input.username.trim() });

        if (!user) throw new Error('INVALID_CREDENTIALS');



        const valid = await comparePassword(input.password, user.passwordHash);

        if (!valid) throw new Error('INVALID_CREDENTIALS');



        assertUserActive(user);



        const payload = buildTokenPayload(user);

        const accessToken = signAccessToken(payload);

        const refreshToken = signRefreshToken(payload);



        await RefreshTokenModel.deleteMany({ userId: user._id, expiresAt: { $lt: new Date() } });



        await RefreshTokenModel.create({

            userId: user._id,

            tokenHash: hashToken(refreshToken),

            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),

        });



        logger.activity(`Đăng nhập ${user.username}.`, { type: 'auth', data: { username: user.username } });



        return {

            accessToken,

            refreshToken,

            user: serializeUser(user),

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



        assertUserActive(user);



        await RefreshTokenModel.deleteOne({ _id: storedToken._id });



        const newPayload = buildTokenPayload(user);

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

        assertUserActive(user);

        return serializeUser(user);

    },

};

