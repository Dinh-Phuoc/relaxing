import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRefreshToken extends Document {
    userId: mongoose.Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
    createdAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        tokenHash: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expireAfterSeconds: 0 },
        },
        userAgent: String,
        ipAddress: String,
    },
    { timestamps: { createdAt: true, updatedAt: false } },
);

const RefreshTokenModel: Model<IRefreshToken> =
    mongoose.models.RefreshToken ??
    mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);

export default RefreshTokenModel;
